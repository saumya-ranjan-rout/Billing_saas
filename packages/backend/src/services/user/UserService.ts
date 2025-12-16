import { Repository, ILike, IsNull, MoreThan, LessThanOrEqual } from "typeorm";
import { AppDataSource } from "../../config/database";
import { User, UserStatus } from "../../entities/User";
import logger from "../../utils/logger";
import * as bcrypt from "bcryptjs";
import { PaginatedResponse } from "../../types/customTypes";
import { Subscription } from "../../entities/Subscription";
import { SubscriptionPlan } from "../../entities/SubscriptionPlan";

export class UserService {
  private userRepository: Repository<User>;
  private subscriptionRepository: Repository<Subscription>;
  private subscriptionPlanRepository: Repository<SubscriptionPlan>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.subscriptionRepository = AppDataSource.getRepository(Subscription);
    this.subscriptionPlanRepository = AppDataSource.getRepository(SubscriptionPlan);
  }

  // ✅ Create new user
  // async createUser(tenantId: string, userData: Partial<User>): Promise<User> {
  //   try {
  //     const existingUser = await this.userRepository.findOne({
  //       where: { email: userData.email, tenantId },
  //     });

  //     if (existingUser) throw new Error("User with this email already exists");

  //     const activeUsersCount = await this.userRepository.count({
  //       where: { status: UserStatus.ACTIVE, tenantId },
  //     });

  //     if (activeUsersCount >= 3) {
  //       throw new Error("Tenant already has 3 active users");
  //     }

  //     const user = this.userRepository.create({ ...userData, tenantId });
  //     const savedUser = await this.userRepository.save(user);

  //     return await this.userRepository.findOneOrFail({
  //       where: { id: savedUser.id },
  //       relations: ["tenant"],
  //     });
  //   } catch (error) {
  //     logger.error("Error creating user:", error);
  //     throw error;
  //   }
  // }

  // ✅ Create new user with stacked plan logic + dynamic maxUsers
  async createUser(tenantId: string, userData: Partial<User>): Promise<User> {
    try {

      // 1️⃣ Check if email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email, tenantId },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // 2️⃣ Fetch ACTIVE subscription (based on stacked plan logic)
      const activeSubscription = await this.subscriptionRepository.findOne({
        where: {
          tenantId,
          startDate: LessThanOrEqual(new Date()),
          endDate: MoreThan(new Date()),
        },
        order: { endDate: "DESC" },
        relations: ["plan"], // Get plan & maxUsers
      });

      if (!activeSubscription) {
        throw new Error("No active subscription found for this tenant");
      }

      // 3️⃣ Extract maxUsers from the plan
      const maxUsers = activeSubscription.plan?.maxUsers;

      if (!maxUsers) {
        throw new Error("Subscription plan has no maxUsers defined");
      }

      // 4️⃣ Count existing ACTIVE users
      const activeUsersCount = await this.userRepository.count({
        where: { status: UserStatus.ACTIVE, tenantId },
      });

      // 5️⃣ Check if limit reached
      if (activeUsersCount >= maxUsers) {
        const msg = `User limit reached. Allowed: ${maxUsers}, Current: ${activeUsersCount}`;
        throw new Error(msg);
      }

      const newUser = this.userRepository.create({
        ...userData,
        tenantId,
      });

      const savedUser = await this.userRepository.save(newUser);

      // 7️⃣ Fetch user with tenant relation
      const finalUser = await this.userRepository.findOneOrFail({
        where: { id: savedUser.id },
        relations: ["tenant"],
      });

      return finalUser;

    } catch (error) {
      logger.error("Error creating user:", error);
      throw error;
    }
  }

  // ✅ Get single user
  async getUser(tenantId: string, userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, tenantId },
      relations: ["tenant"],
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  // ✅ Get paginated users
  async getUsers(tenantId: string, options: { page: number; limit: number; search?: string }): Promise<PaginatedResponse<User>> {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const whereConditions = search
      ? [
        { tenantId, firstName: ILike(`%${search}%`) },
        { tenantId, lastName: ILike(`%${search}%`) },
        { tenantId, email: ILike(`%${search}%`) },
      ]
      : { tenantId };

    const [users, total] = await this.userRepository.findAndCount({
      where: whereConditions,
      skip,
      take: limit,
      order: { createdAt: "DESC" },
    });

    return {
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  // ✅ Update user
  async updateUser(
    tenantId: string,
    userId: string,
    updates: Partial<User>
  ): Promise<User> {
    try {
      const user = await this.getUser(tenantId, userId);

      // ✅ Check if email is being updated
      if (updates.email && updates.email !== user.email) {
        const emailExists = await this.userRepository.findOne({
          where: { email: updates.email, tenantId },
        });

        if (emailExists) {
          throw new Error("User with this email already exists");
        }
      }

      // ✅ Check active users count only if status is being changed to ACTIVE
      if (updates.status === UserStatus.ACTIVE && user.status !== UserStatus.ACTIVE) {
        const activeUsersCount = await this.userRepository.count({
          where: { status: UserStatus.ACTIVE, tenantId },
        });

        if (activeUsersCount >= 3) {
          throw new Error("Tenant already has 3 active users");
        }
      }

      // Update user fields
      Object.assign(user, updates);
      await this.userRepository.save(user);

      return await this.userRepository.findOneOrFail({
        where: { id: userId },
        relations: ["tenant"],
      });
    } catch (error) {
      logger.error("Error updating user:", error);
      throw error;
    }
  }

  // ✅ Soft delete user
  async deleteUser(tenantId: string, userId: string): Promise<void> {
    const user = await this.getUser(tenantId, userId);
    user.status = UserStatus.SUSPENDED;
    await this.userRepository.save(user);
  }

  // ✅ Admin password reset
  async resetPassword(tenantId: string, userId: string, newPassword: string): Promise<User> {
    const user = await this.getUser(tenantId, userId);
    user.password = await bcrypt.hash(newPassword, 12);
    await this.userRepository.save(user);
    return user;
  }

  // ✅ Change own password
  async changePassword(
    userId: string,
    tenantId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {

    // 1️⃣ Find user (tenant-safe)
    const user = await this.userRepository.findOne({
      where: { id: userId, tenantId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 2️⃣ Validate old password
    const isMatch = await user.validatePassword(oldPassword);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    // 3️⃣ Hash new password
    user.password = await bcrypt.hash(newPassword, 12);

    // 4️⃣ Save updated password
    await this.userRepository.save(user);
  }
}
