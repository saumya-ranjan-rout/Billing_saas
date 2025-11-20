import Joi from 'joi';
import winston from 'winston';
export declare const validateEmail: (email: string) => boolean;
export declare const validateGSTIN: (gstin: string) => boolean;
export declare const validatePhone: (phone: string) => boolean;
export declare const invoiceSchema: Joi.ObjectSchema<any>;
export declare const customerSchema: Joi.ObjectSchema<any>;
export declare const userSchema: Joi.ObjectSchema<any>;
declare const logger: winston.Logger;
export declare const stream: {
    write: (message: string) => winston.Logger;
};
export declare const auditLog: (message: string, meta?: any) => winston.Logger;
export declare const apiLog: (req: any, res: any, responseTime: number) => void;
export declare const dbQueryLog: (query: string, parameters: any[] | undefined, executionTime: number) => void;
export declare const errorWithContext: (error: Error, context?: any) => void;
export default logger;
//# sourceMappingURL=logger.d.ts.map