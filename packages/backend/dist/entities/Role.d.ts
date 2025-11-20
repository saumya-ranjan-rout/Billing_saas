import { BaseEntity } from './BaseEntity';
import { Permission } from './Permission';
export declare class Role extends BaseEntity {
    name: string;
    description: string;
    is_system_role: boolean;
    permissions: Permission[];
}
//# sourceMappingURL=Role.d.ts.map