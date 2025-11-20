"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalRequestController = void 0;
const ProfessionalRequestService_1 = require("../services/professional/ProfessionalRequestService");
const User_1 = require("../entities/User");
const database_1 = require("../config/database");
class ProfessionalRequestController {
    constructor() {
        this.service = new ProfessionalRequestService_1.ProfessionalRequestService();
        this.userRepo = database_1.AppDataSource.getRepository(User_1.User);
    }
    async createRequest(req, res) {
        try {
            const user = req.user;
            const { requestedId, message } = req.body;
            const newCustomer = await this.service.createRequest(user, requestedId, message);
            res.status(201).json(newCustomer);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getRequests(req, res) {
        try {
            const user = req.user;
            const requests = await this.service.getRequests(user);
            res.json(requests);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getProfessionals(req, res) {
        try {
            const userData = req.user;
            if (!userData) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const user = await this.userRepo.findOne({
                where: { id: userData.id },
                relations: ["tenant"],
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const professionals = await this.service.getProfessionals(user);
            res.json(professionals);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updated = await this.service.updateStatus(id, status);
            res.json(updated);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.ProfessionalRequestController = ProfessionalRequestController;
//# sourceMappingURL=ProfessionalRequestController.js.map