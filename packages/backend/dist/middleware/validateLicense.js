"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const licenseValidators_1 = require("../services/licenseValidators");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const { professionType, licenseNo } = req.body;
    if (!professionType || !licenseNo) {
        return res.status(400).json({
            success: false,
            message: "Profession type and license number are required",
        });
    }
    try {
        let result;
        switch (professionType) {
            case "CA":
                result = await (0, licenseValidators_1.validateCA)(licenseNo);
                break;
            case "CS":
                result = await (0, licenseValidators_1.validateCS)(licenseNo);
                break;
            case "Advocate":
                result = await (0, licenseValidators_1.validateAdvocate)(licenseNo);
                break;
            case "TaxConsultant":
                result = await (0, licenseValidators_1.validateTaxConsultant)(licenseNo);
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid profession type" });
        }
        if (result.valid) {
            return res.json({ success: true, data: result.data });
        }
        else {
            return res.status(400).json({ success: false, message: result.message });
        }
    }
    catch (err) {
        console.error("License validation error:", err);
        return res.status(500).json({
            success: false,
            message: "License validation failed. Please try again later.",
        });
    }
});
exports.default = router;
//# sourceMappingURL=validateLicense.js.map