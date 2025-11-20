import { BaseEntity as TypeOrmBaseEntity } from 'typeorm';
export declare abstract class BaseEntity extends TypeOrmBaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare abstract class TenantAwareEntity extends BaseEntity {
    tenantId: string;
}
//# sourceMappingURL=BaseEntity.d.ts.map