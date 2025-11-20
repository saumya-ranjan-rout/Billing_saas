import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { ProfessionalUser } from '../entities/ProfessionalUser';
import { Tenant } from '../entities/Tenant';

export class ProfessionalController {
  // Register a new professional
  static async registerProfessional(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(ProfessionalUser);

      const professional = repo.create(req.body);
      await repo.save(professional);

      return res.json({
        success: true,
        message: 'Professional registered successfully',
        data: professional,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Dashboard data
  static async getDashboard(req: Request, res: Response) {
    try {
      const professionalId = (req as any).professional?.id;

      return res.json({
        success: true,
        data: {
          professionalId,
          stats: {
            tenants: 12,
            filingsDue: 4,
            completed: 27,
          },
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // List managed tenants
static async getManagedTenants(req: Request, res: Response) {
  try {
    const professionalId = (req as any).professional?.id;

    const repo = AppDataSource.getRepository(ProfessionalUser);

    const professional = await repo.findOne({
      where: { id: professionalId },
      relations: ['managedTenants'], // load tenants
    });

    return res.json({
      success: true,
      data: professional?.managedTenants || [],
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}


  // Assign professional to tenant
static async assignToTenant(req: Request, res: Response) {
  try {
    const { tenantId } = req.params;
    const professionalId = (req as any).professional?.id;

    const professionalRepo = AppDataSource.getRepository(ProfessionalUser);
    const tenantRepo = AppDataSource.getRepository(Tenant);

    const professional = await professionalRepo.findOne({
      where: { id: professionalId },
      relations: ['managedTenants'], 
    });

    const tenant = await tenantRepo.findOne({ where: { id: tenantId } });

    if (!professional) {
      return res.status(404).json({ success: false, error: "Professional not found" });
    }

    if (!tenant) {
      return res.status(404).json({ success: false, error: "Tenant not found" });
    }

    // Add tenant only if not already assigned
    const alreadyAssigned = professional.managedTenants.some(t => t.id === tenantId);
    if (!alreadyAssigned) {
      professional.managedTenants.push(tenant);
    }

    await professionalRepo.save(professional);

    return res.json({
      success: true,
      message: "Assigned to tenant successfully",
      data: professional,
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

}
