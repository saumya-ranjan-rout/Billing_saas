// E:\BillingSoftware-SaaS\packages\backend\src\types\express\index.d.ts

import { JWTPayload } from '../customTypes';
import { SuperAdmin } from '../../entities/SuperAdmin';
import { Tenant } from '../../entities/Tenant';
import { User } from '../../entities/User';
import { Professional } from "../../entities/Professional";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload | User; // ✅ can be token payload or DB user
      tenant?: Tenant;
      superAdmin?: SuperAdmin;
            professional?: Professional;
    }
  }
}





// declare global {
//   namespace Express {
//     interface Request {
//       user?: JWTPayload;
//       tenant?: {
//         id: string;
//         name: string;
//       };
//     }
//   }
// }
