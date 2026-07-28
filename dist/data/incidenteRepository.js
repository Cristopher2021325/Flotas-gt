"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerIncidentes = leerIncidentes;
exports.guardarIncidentes = guardarIncidentes;
exports.buscarPorId = buscarPorId;
exports.agregarIncidente = agregarIncidente;
const path_1 = __importDefault(require("path"));
const archivoJson_1 = require("../utils/archivoJson");
const rutaArchivo = path_1.default.join(__dirname, "incidentes.json");
function leerIncidentes() {
    return (0, archivoJson_1.leerArchivo)(rutaArchivo);
}
function guardarIncidentes(datos) {
    (0, archivoJson_1.guardarArchivo)(rutaArchivo, datos);
}
function buscarPorId(id) {
    return leerIncidentes().find((i) => i.id === id);
}
function agregarIncidente(datos) {
    const incidentes = leerIncidentes();
    const nuevo = { id: (0, archivoJson_1.generarId)(), ocurridoEn: new Date().toISOString(), ...datos };
    incidentes.push(nuevo);
    guardarIncidentes(incidentes);
    return nuevo;
}
