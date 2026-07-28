"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerConductores = leerConductores;
exports.guardarConductores = guardarConductores;
exports.buscarPorId = buscarPorId;
exports.buscarPorLicencia = buscarPorLicencia;
exports.agregarConductor = agregarConductor;
exports.actualizarConductor = actualizarConductor;
exports.eliminarConductor = eliminarConductor;
const path_1 = __importDefault(require("path"));
const archivoJson_1 = require("../utils/archivoJson");
const rutaArchivo = path_1.default.join(__dirname, "conductores.json");
function leerConductores() {
    return (0, archivoJson_1.leerArchivo)(rutaArchivo);
}
function guardarConductores(datos) {
    (0, archivoJson_1.guardarArchivo)(rutaArchivo, datos);
}
function buscarPorId(id) {
    return leerConductores().find((c) => c.id === id);
}
function buscarPorLicencia(licenciaNumero) {
    return leerConductores().find((c) => c.licenciaNumero === licenciaNumero);
}
function agregarConductor(datos) {
    const conductores = leerConductores();
    const nuevo = { id: (0, archivoJson_1.generarId)(), estado: "disponible", horasManejoHoy: 0, horasDescansoAcumuladas: 0, ...datos };
    conductores.push(nuevo);
    guardarConductores(conductores);
    return nuevo;
}
function actualizarConductor(id, datos) {
    const conductores = leerConductores();
    const indice = conductores.findIndex((c) => c.id === id);
    if (indice === -1)
        return false;
    conductores[indice] = { ...conductores[indice], ...datos };
    guardarConductores(conductores);
    return true;
}
function eliminarConductor(id) {
    const conductores = leerConductores();
    const filtrados = conductores.filter((c) => c.id !== id);
    if (filtrados.length === conductores.length)
        return false;
    guardarConductores(filtrados);
    return true;
}
