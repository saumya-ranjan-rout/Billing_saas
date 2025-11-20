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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderItem = void 0;
const typeorm_1 = require("typeorm");
const PurchaseOrder_1 = require("./PurchaseOrder");
let PurchaseOrderItem = class PurchaseOrderItem {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PurchaseOrder_1.PurchaseOrder, po => po.items, { onDelete: 'CASCADE' }),
    __metadata("design:type", PurchaseOrder_1.PurchaseOrder)
], PurchaseOrderItem.prototype, "purchaseOrder", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "taxRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "amount", void 0);
PurchaseOrderItem = __decorate([
    (0, typeorm_1.Entity)()
], PurchaseOrderItem);
exports.PurchaseOrderItem = PurchaseOrderItem;
//# sourceMappingURL=PurchaseOrderItem.js.map