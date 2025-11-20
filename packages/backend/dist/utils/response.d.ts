import { Response } from 'express';
export interface SuccessResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: {
        page?: number;
        limit?: number;
        total?: number;
        pages?: number;
        nextCursor?: string | null;
        hasMore?: boolean;
    };
    timestamp: string;
}
export interface ErrorResponse {
    success: boolean;
    error: {
        code: string;
        message: string;
        details?: any;
    };
    timestamp: string;
}
export declare const ok: <T>(res: Response, data: T, message?: string, pagination?: SuccessResponse['pagination']) => Response;
export declare const created: <T>(res: Response, data: T, message?: string) => Response;
export declare const errorResponse: (res: Response, message: string, statusCode?: number, code?: string, details?: any) => Response;
export declare const validationError: (res: Response, errors: any[], message?: string) => Response;
export declare const notFound: (res: Response, message?: string) => Response;
export declare const unauthorized: (res: Response, message?: string) => Response;
export declare const forbidden: (res: Response, message?: string) => Response;
export declare const badRequest: (res: Response, message?: string, details?: any) => Response;
export declare const conflict: (res: Response, message?: string, details?: any) => Response;
export declare const tooManyRequests: (res: Response, message?: string, retryAfter?: number) => Response;
export declare const paginated: <T>(res: Response, data: T[], pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
}, message?: string) => Response;
export declare const keysetPaginated: <T>(res: Response, data: T[], pagination: {
    nextCursor: string | null;
    limit: number;
    total?: number;
    hasMore: boolean;
}, message?: string) => Response;
export declare const noContent: (res: Response) => Response;
declare const _default: {
    ok: <T>(res: Response<any, Record<string, any>>, data: T, message?: string | undefined, pagination?: {
        page?: number | undefined;
        limit?: number | undefined;
        total?: number | undefined;
        pages?: number | undefined;
        nextCursor?: string | null | undefined;
        hasMore?: boolean | undefined;
    } | undefined) => Response<any, Record<string, any>>;
    created: <T_1>(res: Response<any, Record<string, any>>, data: T_1, message?: string) => Response<any, Record<string, any>>;
    errorResponse: (res: Response<any, Record<string, any>>, message: string, statusCode?: number, code?: string | undefined, details?: any) => Response<any, Record<string, any>>;
    validationError: (res: Response<any, Record<string, any>>, errors: any[], message?: string) => Response<any, Record<string, any>>;
    notFound: (res: Response<any, Record<string, any>>, message?: string) => Response<any, Record<string, any>>;
    unauthorized: (res: Response<any, Record<string, any>>, message?: string) => Response<any, Record<string, any>>;
    forbidden: (res: Response<any, Record<string, any>>, message?: string) => Response<any, Record<string, any>>;
    badRequest: (res: Response<any, Record<string, any>>, message?: string, details?: any) => Response<any, Record<string, any>>;
    conflict: (res: Response<any, Record<string, any>>, message?: string, details?: any) => Response<any, Record<string, any>>;
    tooManyRequests: (res: Response<any, Record<string, any>>, message?: string, retryAfter?: number | undefined) => Response<any, Record<string, any>>;
    paginated: <T_2>(res: Response<any, Record<string, any>>, data: T_2[], pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    }, message?: string | undefined) => Response<any, Record<string, any>>;
    keysetPaginated: <T_3>(res: Response<any, Record<string, any>>, data: T_3[], pagination: {
        nextCursor: string | null;
        limit: number;
        total?: number | undefined;
        hasMore: boolean;
    }, message?: string | undefined) => Response<any, Record<string, any>>;
    noContent: (res: Response<any, Record<string, any>>) => Response<any, Record<string, any>>;
};
export default _default;
//# sourceMappingURL=response.d.ts.map