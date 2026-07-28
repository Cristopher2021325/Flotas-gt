"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerMonitoreos = leerMonitoreos;
exports.guardarMonitoreos = guardarMonitoreos;
exports.buscarPorViaje = buscarPorViaje;
exports.agregarMonitoreo = agregarMonitoreo;
const path_1 = __importDefault(require("path"));
const archivoJson_1 = require("../utils/archivoJson");
const rutaArchivo = path_1.default.join(__dirname, "monitoreos.json");
function leerMonitoreos() {
    return (0, archivoJson_1.leerArchivo)(rutaArchivo);
}
function guardarMonitoreos(datos) {
    (0, archivoJson_1.guardarArchivo)(rutaArchivo, datos);
}
function buscarPorViaje(viajeId) {
    return leerMonitoreos()
        .filter((m) => m.viajeId === viajeId)
        .sort((a, b) => (a.registradoEn < b.registradoEn ? 1 : -1));
}
function agregarMonitoreo(datos) {
    const monitoreos = leerMonitoreos();
    const nuevo = { id: (0, archivoJson_1.generarId)(), registradoEn: new Date().toISOString(), ...datos };
    monitoreos.push(nuevo);
    guardarMonitoreos(monitoreos);
    return nuevo;
}
