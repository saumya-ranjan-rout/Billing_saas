"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = exports.sanitizeInput = exports.isWithinBusinessHours = exports.formatDate = exports.formatCurrency = exports.calculateInvoiceTotals = exports.generateInvoiceNumber = void 0;
const generateInvoiceNumber = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `INV-${timestamp}-${random}`;
};
exports.generateInvoiceNumber = generateInvoiceNumber;
const calculateInvoiceTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
    const total = subtotal + tax;
    return { subtotal, tax, total };
};
exports.calculateInvoiceTotals = calculateInvoiceTotals;
const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
const formatDate = (date, includeTime = false) => {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    return new Intl.DateTimeFormat('en-IN', options).format(date);
};
exports.formatDate = formatDate;
const isWithinBusinessHours = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 9 && hours < 17;
};
exports.isWithinBusinessHours = isWithinBusinessHours;
const sanitizeInput = (input) => {
    return input.trim().replace(/[<>]/g, '');
};
exports.sanitizeInput = sanitizeInput;
const generateRandomString = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.generateRandomString = generateRandomString;
//# sourceMappingURL=helpers.js.map