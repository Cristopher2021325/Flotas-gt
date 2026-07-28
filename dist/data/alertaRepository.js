"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerAlertas = leerAlertas;
exports.guardarAlertas = guardarAlertas;
exports.buscarPorId = buscarPorId;
exports.buscarPendientes = buscarPendientes;
exports.agregarAlerta = agregarAlerta;
exports.marcarAtendida = marcarAtendida;
const path_1 = __importDefault(require("path"));
const archivoJson_1 = require("../utils/archivoJson");
const rutaArchivo = path_1.default.join(__dirname, "alertas.json");
function leerAlertas() {
    return (0, archivoJson_1.leerArchivo)(rutaArchivo);
}
function guardarAlertas(datos) {
    (0, archivoJson_1.guardarArchivo)(rutaArchivo, datos);
}
function buscarPorId(id) {
    return leerAlertas().find((a) => a.id === id);
}
function buscarPendientes() {
    return leerAlertas().filter((a) => !a.atendida);
}
function agregarAlerta(datos) {
    const alertas = leerAlertas();
    const nueva = { id: (0, archivoJson_1.generarId)(), atendida: false, generadaEn: new Date().toISOString(), ...datos };
    alertas.push(nueva);
    guardarAlertas(alertas);
    return nueva;
}
function marcarAtendida(id) {
    const alertas = leerAlertas();
    const indice = alertas.findIndex((a) => a.id === id);
    if (indice === -1)
        return false;
    alertas[indice].atendida = true;
    guardarAlertas(alertas);
    return true;
}
