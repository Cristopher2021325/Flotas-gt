"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const empresaService = __importStar(require("../services/empresaService"));
exports.router = express_1.default.Router();
exports.router.get("/empresas", (_req, res) => {
    const empresas = empresaService.obtenerEmpresas();
    res.json(empresas);
});
exports.router.get("/empresas/:id", (req, res) => {
    try {
        const encontrada = empresaService.obtenerEmpresaPorId(req.params.id);
        res.json(encontrada);
    }
    catch (error) {
        const mensaje = error instanceof Error ? error.message : "error inesperado";
        res.status(404).json({ error: mensaje });
    }
});
exports.router.post("/empresas", (req, res) => {
    try {
        const { nombre, nit, licenciaOperacion, telefono, email } = req.body;
        const nueva = empresaService.crearEmpresa({ nombre, nit, licenciaOperacion, telefono, email });
        res.status(201).json(nueva);
    }
    catch (error) {
        const mensaje = error instanceof Error ? error.message : "error inesperado";
        res.status(400).json({ error: mensaje });
    }
});
