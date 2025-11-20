"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseApp = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../.env') });
let firebaseApp;
exports.firebaseApp = firebaseApp;
if (process.env.NODE_ENV === "development") {
    exports.firebaseApp = firebaseApp = {
        messaging: () => ({
            send: async (msg) => {
                console.log("📩 Mock send message:", msg);
                return "mock-message-id";
            }
        }),
        auth: () => ({
            verifyIdToken: async () => ({ uid: "fake-user", email: "test@example.com" })
        })
    };
    console.log("⚡ Using mock Firebase in development");
}
else {
    exports.firebaseApp = firebaseApp = firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
    console.log("✅ Firebase initialized");
}
//# sourceMappingURL=firebase.js.map