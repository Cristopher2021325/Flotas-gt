"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarServidor = iniciarServidor;
const express_1 = __importDefault(require("express"));
const router_1 = require("./router");
const app = (0, express_1.default)();
const puerto = 3000;
app.use(express_1.default.json());
app.use("/api", router_1.router);
function iniciarServidor() {
    app.listen(puerto, () => {
        console.log(`servidor api escuchando en http://localhost:${puerto}/api`);
    });
}
