import { AppDataSource } from '../config/database';
import { Setting } from "../entities/Setting";
import { Not } from 'typeorm';

export class SettingService {
  private repo = AppDataSource.getRepository(Setting);

  async getByTenant(tenantId: string) {
    return await this.repo.findOne({ where: { tenantId } });
  }

  // async update(tenantId: string, data: Partial<Setting>) {
  //   let settings = await this.repo.findOne({ where: { tenantId } });

  //   if (!settings) {
  //     settings = this.repo.create({ tenantId, ...data });
  //   } else {
  //     Object.assign(settings, data);
  //   }

  //   return await this.repo.save(settings);
  // }
  
  async update(tenantId: string, data: Partial<Setting>) {
    let settings = await this.repo.findOne({ where: { tenantId } });

    // ----- Duplicate checks -----
    if (data.contactEmail) {
      const existingEmail = await this.repo.findOne({
        where: { contactEmail: data.contactEmail, tenantId: Not(tenantId) },
      });
      if (existingEmail) {
        throw new Error('Contact Email already exists');
      }
    }

    if (data.contactPhone) {
      const existingPhone = await this.repo.findOne({
        where: { contactPhone: data.contactPhone, tenantId: Not(tenantId) },
      });
      if (existingPhone) {
        throw new Error('Contact Phone already exists');
      }
    }

    if (data.gstNumber) {
      const existingGST = await this.repo.findOne({
        where: { gstNumber: data.gstNumber, tenantId: Not(tenantId) },
      });
      if (existingGST) {
        throw new Error('GST Number already exists');
      }
    }

    // ----- Update / Create -----
    if (!settings) {
      settings = this.repo.create({ tenantId, ...data });
    } else {
      Object.assign(settings, data);
    }

    return await this.repo.save(settings);
  }
}
