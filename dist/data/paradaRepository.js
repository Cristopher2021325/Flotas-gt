"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerParadas = leerParadas;
exports.guardarParadas = guardarParadas;
exports.buscarPorId = buscarPorId;
exports.buscarPorRuta = buscarPorRuta;
exports.agregarParada = agregarParada;
exports.actualizarParada = actualizarParada;
exports.eliminarParada = eliminarParada;
const path_1 = __importDefault(require("path"));
const archivoJson_1 = require("../utils/archivoJson");
const rutaArchivo = path_1.default.join(__dirname, "paradas.json");
function leerParadas() {
    return (0, archivoJson_1.leerArchivo)(rutaArchivo);
}
function guardarParadas(datos) {
    (0, archivoJson_1.guardarArchivo)(rutaArchivo, datos);
}
function buscarPorId(id) {
    return leerParadas().find((p) => p.id === id);
}
function buscarPorRuta(rutaId) {
    return leerParadas()
        .filter((p) => p.rutaId === rutaId)
        .sort((a, b) => a.orden - b.orden);
}
function agregarParada(datos) {
    const paradas = leerParadas();
    const nueva = { id: (0, archivoJson_1.generarId)(), ...datos };
    paradas.push(nueva);
    guardarParadas(paradas);
    return nueva;
}
function actualizarParada(id, datos) {
    const paradas = leerParadas();
    const indice = paradas.findIndex((p) => p.id === id);
    if (indice === -1)
        return false;
    paradas[indice] = { ...paradas[indice], ...datos };
    guardarParadas(paradas);
    return true;
}
function eliminarParada(id) {
    const paradas = leerParadas();
    const filtradas = paradas.filter((p) => p.id !== id);
    if (filtradas.length === paradas.length)
        return false;
    guardarParadas(filtradas);
    return true;
}
