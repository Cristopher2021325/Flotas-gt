"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerCargas = leerCargas;
exports.guardarCargas = guardarCargas;
exports.buscarPorId = buscarPorId;
exports.agregarCarga = agregarCarga;
exports.actualizarCarga = actualizarCarga;
exports.eliminarCarga = eliminarCarga;
const path_1 = __importDefault(require("path"));
const archivoJson_1 = require("../utils/archivoJson");
const rutaArchivo = path_1.default.join(__dirname, "cargas.json");
function leerCargas() {
    return (0, archivoJson_1.leerArchivo)(rutaArchivo);
}
function guardarCargas(datos) {
    (0, archivoJson_1.guardarArchivo)(rutaArchivo, datos);
}
function buscarPorId(id) {
    return leerCargas().find((c) => c.id === id);
}
function agregarCarga(datos) {
    const cargas = leerCargas();
    const nueva = { id: (0, archivoJson_1.generarId)(), estado: "pendiente", ...datos };
    cargas.push(nueva);
    guardarCargas(cargas);
    return nueva;
}
function actualizarCarga(id, datos) {
    const cargas = leerCargas();
    const indice = cargas.findIndex((c) => c.id === id);
    if (indice === -1)
        return false;
    cargas[indice] = { ...cargas[indice], ...datos };
    guardarCargas(cargas);
    return true;
}
function eliminarCarga(id) {
    const cargas = leerCargas();
    const filtradas = cargas.filter((c) => c.id !== id);
    if (filtradas.length === cargas.length)
        return false;
    guardarCargas(filtradas);
    return true;
}
