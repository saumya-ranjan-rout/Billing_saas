"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
function validationMiddleware(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        console.log("Main Error:", error);
        if (error) {
            return res.status(400).json({
                errors: error.details.map(d => d.message),
            });
        }
        next();
    };
}
exports.validationMiddleware = validationMiddleware;
//# sourceMappingURL=validation.js.map