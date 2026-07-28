"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerViajes = leerViajes;
exports.guardarViajes = guardarViajes;
exports.buscarPorId = buscarPorId;
exports.agregarViaje = agregarViaje;
exports.actualizarViaje = actualizarViaje;
exports.eliminarViaje = eliminarViaje;
const path_1 = __importDefault(require("path"));
const archivoJson_1 = require("../utils/archivoJson");
const rutaArchivo = path_1.default.join(__dirname, "viajes.json");
function leerViajes() {
    return (0, archivoJson_1.leerArchivo)(rutaArchivo);
}
function guardarViajes(datos) {
    (0, archivoJson_1.guardarArchivo)(rutaArchivo, datos);
}
function buscarPorId(id) {
    return leerViajes().find((v) => v.id === id);
}
function agregarViaje(datos) {
    const viajes = leerViajes();
    const nuevo = { id: (0, archivoJson_1.generarId)(), estado: "programado", inicioReal: null, finReal: null, notasClaude: "", ...datos };
    viajes.push(nuevo);
    guardarViajes(viajes);
    return nuevo;
}
function actualizarViaje(id, datos) {
    const viajes = leerViajes();
    const indice = viajes.findIndex((v) => v.id === id);
    if (indice === -1)
        return false;
    viajes[indice] = { ...viajes[indice], ...datos };
    guardarViajes(viajes);
    return true;
}
function eliminarViaje(id) {
    const viajes = leerViajes();
    const filtrados = viajes.filter((v) => v.id !== id);
    if (filtrados.length === viajes.length)
        return false;
    guardarViajes(filtrados);
    return true;
}
