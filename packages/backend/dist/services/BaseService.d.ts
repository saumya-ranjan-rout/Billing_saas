import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { BaseEntity } from '../entities/BaseEntity';
export declare abstract class BaseService<T extends BaseEntity> {
    protected repository: Repository<T>;
    constructor(repository: Repository<T>);
    findById(id: string, relations?: string[]): Promise<T>;
    findAll(options?: FindManyOptions<T>): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
    exists(where: FindOptionsWhere<T>): Promise<boolean>;
}
export declare abstract class TenantAwareService<T extends BaseEntity> extends BaseService<T> {
    constructor(repository: Repository<T>);
    findAllByTenant(tenantId: string, options?: FindManyOptions<T>): Promise<T[]>;
    findByIdAndTenant(id: string, tenantId: string, relations?: string[]): Promise<T>;
}
//# sourceMappingURL=BaseService.d.ts.map