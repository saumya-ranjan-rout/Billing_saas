"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Category_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
const Product_1 = require("./Product");
let Category = Category_1 = class Category extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category_1, category => category.children, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parentId' }),
    __metadata("design:type", Category)
], Category.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Category.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Category.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.categories),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], Category.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Category_1, category => category.parent),
    __metadata("design:type", Array)
], Category.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product_1.Product, product => product.category),
    __metadata("design:type", Array)
], Category.prototype, "products", void 0);
Category = Category_1 = __decorate([
    (0, typeorm_1.Entity)('categories')
], Category);
exports.Category = Category;
//# sourceMappingURL=Category.js.map