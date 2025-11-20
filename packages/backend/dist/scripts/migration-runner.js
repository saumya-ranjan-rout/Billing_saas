"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const logger_1 = __importDefault(require("../utils/logger"));
const runMigrationsScript = async () => {
    try {
        await database_1.AppDataSource.initialize();
        logger_1.default.info("Database connected for migrations");
        await database_1.AppDataSource.runMigrations();
        logger_1.default.info("Migrations completed successfully");
        await database_1.AppDataSource.destroy();
    }
    catch (error) {
        logger_1.default.error("Migration error:", error);
        process.exit(1);
    }
};
const command = process.argv[2];
switch (command) {
    case "run":
        runMigrationsScript();
        break;
    case "revert":
        (async () => {
            try {
                await database_1.AppDataSource.initialize();
                await database_1.AppDataSource.undoLastMigration();
                logger_1.default.info("Last migration reverted");
                await database_1.AppDataSource.destroy();
            }
            catch (error) {
                logger_1.default.error("Migration revert error:", error);
            }
        })();
        break;
    default:
        logger_1.default.info("Usage: npm run migration:run OR npm run migration:revert");
}
//# sourceMappingURL=migration-runner.js.map