import { Setting } from "../entities/Setting";
export declare class SettingService {
    private repo;
    getByTenant(tenantId: string): Promise<Setting | null>;
    update(tenantId: string, data: Partial<Setting>): Promise<Setting>;
}
//# sourceMappingURL=SettingService.d.ts.map