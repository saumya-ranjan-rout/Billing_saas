"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createProductSchema = joi_1.default.object({
    name: joi_1.default.string().required().max(255),
    code: joi_1.default.string().required().max(100),
    description: joi_1.default.string().allow('', null).optional(),
    price: joi_1.default.number().min(0).required(),
    currency: joi_1.default.string().length(3).default('USD'),
    isActive: joi_1.default.boolean().default(true),
    taxRateIds: joi_1.default.array().items(joi_1.default.string().uuid()).optional()
});
exports.updateProductSchema = joi_1.default.object({
    name: joi_1.default.string().max(255).optional(),
    code: joi_1.default.string().max(100).optional(),
    description: joi_1.default.string().allow('', null).optional(),
    price: joi_1.default.number().min(0).optional(),
    currency: joi_1.default.string().length(3).optional(),
    isActive: joi_1.default.boolean().optional(),
    taxRateIds: joi_1.default.array().items(joi_1.default.string().uuid()).optional()
});
//# sourceMappingURL=productValidation.js.map