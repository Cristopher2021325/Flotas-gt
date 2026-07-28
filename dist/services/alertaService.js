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
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerAlertas = obtenerAlertas;
exports.obtenerAlertasPendientes = obtenerAlertasPendientes;
exports.generarAlerta = generarAlerta;
exports.atenderAlerta = atenderAlerta;
const alertaRepository = __importStar(require("../data/alertaRepository"));
const viajeService = __importStar(require("./viajeService"));
const conductorService = __importStar(require("./conductorService"));
function obtenerAlertas() {
    return alertaRepository.leerAlertas();
}
function obtenerAlertasPendientes() {
    return alertaRepository.buscarPendientes();
}
function generarAlerta(datos) {
    if (!datos.viajeId || !datos.conductorId || !datos.mensaje) {
        throw new Error("viaje, conductor y mensaje son obligatorios");
    }
    viajeService.obtenerViajePorId(datos.viajeId);
    conductorService.obtenerConductorPorId(datos.conductorId);
    return alertaRepository.agregarAlerta(datos);
}
function atenderAlerta(id) {
    if (!id)
        throw new Error("debes indicar un id");
    const alertas = alertaRepository.leerAlertas();
    const existe = alertas.find((a) => a.id === id);
    if (!existe)
        throw new Error(`no se encontro una alerta con el id "${id}"`);
    const atendio = alertaRepository.marcarAtendida(id);
    if (!atendio)
        throw new Error("no se pudo marcar la alerta como atendida");
}
