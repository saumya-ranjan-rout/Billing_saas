import { Repository, ILike, IsNull, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Vendor } from '../../entities/Vendor';
import { validateGSTIN, validatePAN } from '../../utils/validators';
import logger from '../../utils/logger';
import { PaginatedResponse } from '../../types/customTypes';
import { PaymentInvoice, PaymentStatus } from '../../entities/PaymentInvoice';
import { PurchaseOrder, PurchaseOrderStatus, PurchaseOrderType } from '../../entities/PurchaseOrder';

export class VendorService {
  private vendorRepository: Repository<Vendor>;
  private paymentRepository = AppDataSource.getRepository(PaymentInvoice);
  private purchaseRepository = AppDataSource.getRepository(PurchaseOrder);

  constructor() {
    this.vendorRepository = AppDataSource.getRepository(Vendor);
    this.paymentRepository = AppDataSource.getRepository(PaymentInvoice);
    this.purchaseRepository = AppDataSource.getRepository(PurchaseOrder);
  }
  async getVendorBalance(tenantId: string, vendorId: string) {

    // Sum of outstanding dues from invoice table

    // console.log("vendorId",vendorId);
    // console.log("tenantId",tenantId);
    const totalDueResult = await this.purchaseRepository
      .createQueryBuilder("purchase_orders")
      .select("SUM(purchase_orders.totalAmount)", "totalDue")
      .where("purchase_orders.tenantId = :tenantId", { tenantId })
      .andWhere("purchase_orders.vendorId = :vendorId", { vendorId })
      .getRawOne();

    // Sum of total paid entries from payment table
    const totalPaidResult = await this.paymentRepository
      .createQueryBuilder("payment_invoice")
      .select("SUM(payment_invoice.amount)", "totalPaid")
      .where("payment_invoice.tenantId = :tenantId", { tenantId })
      .andWhere("payment_invoice.vendorId = :vendorId", { vendorId })
      .getRawOne();

    // console.log(" totalDueResult, totalPaidResult",totalDueResult, totalPaidResult);

    const totalDue = Number(totalDueResult?.totalDue ?? 0);
    const totalPaid = Number(totalPaidResult?.totalPaid ?? 0);

    const balance = totalDue - totalPaid
    //console.log(" totalDue, totalPaid",totalDue, totalPaid ,balance);
    return {
      vendorId,
      totalDue,
      totalPaid,
      balance: totalDue - totalPaid
    };
  }


  async recordPayment(data: any) {
    const { amount, method, vendorId, paymentDate, notes, status, paymentType, tenantId } = data;

    // -------- Payment Processing Logic -------- //
    const payment = this.paymentRepository.create({
      amount,
      method,
      vendorId,
      paymentDate,
      notes,
      status,
      paymentType,
      tenantId,
      createdAt: new Date(),
    });

    return await this.paymentRepository.save(payment);
  }


  async getVendorPaymentHistory(tenantId: string, vendorId: string) {
    // console.log("customerId",customerId);
    // console.log("tenantId",tenantId);
    const PaymentHistory = await this.paymentRepository.find({
      where: { tenantId, vendorId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
    //console.log("PaymentHistory",PaymentHistory);
    return { PaymentHistory };
  }


  async createVendor(tenantId: string, vendorData: Partial<Vendor>): Promise<Vendor> {
    try {
      // Validate GSTIN if provided
      if (vendorData.gstin && !validateGSTIN(vendorData.gstin)) {
        throw new Error('Invalid GSTIN format');
      }

      // Validate PAN if provided
      if (vendorData.pan && !validatePAN(vendorData.pan)) {
        throw new Error('Invalid PAN format');
      }

      // =============== DUPLICATE CHECKS ==================

      // Email Duplicate
      if (vendorData.email) {
        const existingEmail = await this.vendorRepository.findOne({
          where: { email: vendorData.email, tenantId, deletedAt: IsNull() }
        });
        if (existingEmail) {
          throw new Error("Email already exists");
        }
      }

      // Phone Duplicate
      if (vendorData.phone) {
        const existingPhone = await this.vendorRepository.findOne({
          where: { phone: vendorData.phone, tenantId, deletedAt: IsNull() }
        });
        if (existingPhone) {
          throw new Error("Phone number already exists");
        }
      }

      // GST Duplicate
      if (vendorData.gstin) {
        const existingGST = await this.vendorRepository.findOne({
          where: { gstin: vendorData.gstin, tenantId, deletedAt: IsNull() }
        });
        if (existingGST) {
          throw new Error("GST number already exists");
        }
      }

      // PAN Duplicate
      if (vendorData.pan) {
        const existingPAN = await this.vendorRepository.findOne({
          where: { pan: vendorData.pan, tenantId, deletedAt: IsNull() }
        });
        if (existingPAN) {
          throw new Error("PAN number already exists");
        }
      }

      // Check if vendor with same name already exists for this tenant
      const existingVendor = await this.vendorRepository.findOne({
        where: { name: vendorData.name, tenantId, deletedAt: IsNull() }
      });

      if (existingVendor) {
        throw new Error('Vendor with this name already exists');
      }

      // Create and save a single vendor entity
      const vendor = this.vendorRepository.create({
        ...vendorData,
        tenantId
      });

      const savedVendor: Vendor = await this.vendorRepository.save(vendor);
      return savedVendor;
    } catch (error) {
      logger.error('Error creating vendor:', error);
      throw error;
    }
  }

  async getVendor(tenantId: string, vendorId: string): Promise<Vendor> {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { id: vendorId, tenantId, deletedAt: IsNull() },
        relations: ['tenant']
      });

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      return vendor;
    } catch (error) {
      logger.error('Error fetching vendor:', error);
      throw error;
    }
  }

  async getVendors(
    tenantId: string,
    options: {
      page: number;
      limit: number;
      name?: string;
      email?: string;
      phone?: string;
      status?: string;
      joinedFrom?: string;
      joinedTo?: string;
    }
  ): Promise<PaginatedResponse<Vendor>> {
    try {
      const { page, limit, name, email, phone, status, joinedFrom, joinedTo } = options;
      const skip = (page - 1) * limit;

      let whereConditions: any = { tenantId, deletedAt: IsNull() };

      // if (search) {
      //   whereConditions = [
      //     { tenantId, name: ILike(`%${search}%`), deletedAt: IsNull() },
      //     { tenantId, email: ILike(`%${search}%`), deletedAt: IsNull() },
      //     { tenantId, phone: ILike(`%${search}%`), deletedAt: IsNull() }
      //   ];
      // }
      if (options.name) {
        whereConditions.name = ILike(`%${options.name}%`);
      }

      if (options.email) {
        whereConditions.email = ILike(`%${options.email}%`);
      }

      if (options.phone) {
        whereConditions.phone = ILike(`%${options.phone}%`);
      }

      // if (options.status) {
      //   whereConditions.paymentStatus = options.status;
      // }

      // // Date filter: joinedFrom - joinedTo
      // if (options.joinedFrom || options.joinedTo) {
      //   whereConditions.createdAt = {};

      //   if (options.joinedFrom) {
      //     whereConditions.createdAt = MoreThanOrEqual(new Date(options.joinedFrom));
      //   }

      //   if (options.joinedTo) {
      //     whereConditions.createdAt = LessThanOrEqual(new Date(options.joinedTo));
      //   }
      // }

      // 10-12-2025(Y)
      if (joinedFrom && joinedTo) {
        const from = new Date(joinedFrom);
        const to = new Date(joinedTo);

        // Set end date to end of day
        to.setHours(23, 59, 59, 999);

        whereConditions.createdAt = Between(from, to);

      } else if (joinedFrom) {
        whereConditions.createdAt = MoreThanOrEqual(new Date(joinedFrom));

      } else if (joinedTo) {
        const to = new Date(joinedTo);
        to.setHours(23, 59, 59, 999);
        whereConditions.createdAt = LessThanOrEqual(to);
      }

      let [vendors, total] = await this.vendorRepository.findAndCount({
        where: whereConditions,
        skip,
        take: limit,
        order: { createdAt: 'DESC' }
      });


      for (const vendor of vendors) {
        const balance = await this.getVendorBalance(tenantId, vendor.id);

        //  console.log("balance",balance);

        const totalDueNum = Number(balance.totalDue ?? 0);
        const totalPaidNum = Number(balance.totalPaid ?? 0);
        const balanceNum = Number(balance.balance ?? 0);

        vendor.totalDue = Number(totalDueNum.toFixed(2));
        vendor.totalPaid = Number(totalPaidNum.toFixed(2));
        vendor.balance = Number(balanceNum.toFixed(2));


        if (balanceNum === 0 && totalDueNum > 0) {
          vendor.paymentStatus = PaymentStatus.COMPLETED;
        } else if (totalPaidNum > 0 && balanceNum > 0) {
          vendor.paymentStatus = PaymentStatus.PARTIAL;;
        } else {
          vendor.paymentStatus = PaymentStatus.PENDING;
        }

      }
      if (options.status) {
        vendors = vendors.filter(v => v.paymentStatus === options.status);
        total = vendors.length;
      }


      return {
        data: vendors,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching vendors:', error);
      throw error;
    }
  }

  async updateVendor(tenantId: string, vendorId: string, updates: any): Promise<Vendor> {
    try {
      // Validate GSTIN if provided
      if (updates.gstin && !validateGSTIN(updates.gstin)) {
        throw new Error('Invalid GSTIN format');
      }

      // Validate PAN if provided
      if (updates.pan && !validatePAN(updates.pan)) {
        throw new Error('Invalid PAN format');
      }

      const vendor = await this.getVendor(tenantId, vendorId);

      // Check if name is being changed and if it's already taken
      if (updates.name && updates.name !== vendor.name) {
        const existingVendor = await this.vendorRepository.findOne({
          where: { name: updates.name, tenantId, deletedAt: IsNull() }
        });

        if (existingVendor && existingVendor.id !== vendorId) {
          throw new Error('Vendor with this name already exists');
        }
      }

      // Update vendor
      Object.assign(vendor, updates);
      return await this.vendorRepository.save(vendor);
    } catch (error) {
      logger.error('Error updating vendor:', error);
      throw error;
    }
  }

  async deleteVendor(tenantId: string, vendorId: string): Promise<void> {
    try {
      const vendor = await this.getVendor(tenantId, vendorId);

      // Soft delete: set deletedAt timestamp
      vendor.deletedAt = new Date();
      await this.vendorRepository.save(vendor);
    } catch (error) {
      logger.error('Error deleting vendor:', error);
      throw error;
    }
  }

  async searchVendors(tenantId: string, query: string): Promise<Vendor[]> {
    try {
      if (!query || query.length < 2) {
        throw new Error('Search query must be at least 2 characters long');
      }

      const vendors = await this.vendorRepository.find({
        where: [
          { tenantId, name: ILike(`%${query}%`), deletedAt: IsNull() },
          { tenantId, email: ILike(`%${query}%`), deletedAt: IsNull() },
          { tenantId, phone: ILike(`%${query}%`), deletedAt: IsNull() },
          { tenantId, gstin: ILike(`%${query}%`), deletedAt: IsNull() }
        ],
        take: 10
      });

      return vendors;
    } catch (error) {
      logger.error('Error searching vendors:', error);
      throw error;
    }
  }

  async getVendorByGSTIN(tenantId: string, gstin: string): Promise<Vendor | null> {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { tenantId, gstin, deletedAt: IsNull() }
      });
      return vendor;
    } catch (error) {
      logger.error('Error fetching vendor by GSTIN:', error);
      throw error;
    }
  }

  async updateOutstandingBalance(tenantId: string, vendorId: string, amount: number): Promise<void> {
    try {
      const vendor = await this.getVendor(tenantId, vendorId);
      vendor.outstandingBalance = Number(vendor.outstandingBalance) + amount;
      await this.vendorRepository.save(vendor);
    } catch (error) {
      logger.error('Error updating vendor balance:', error);
      throw error;
    }
  }
}
