"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerEmpresas = leerEmpresas;
exports.guardarEmpresas = guardarEmpresas;
exports.buscarPorId = buscarPorId;
exports.buscarPorNit = buscarPorNit;
exports.agregarEmpresa = agregarEmpresa;
exports.actualizarEmpresa = actualizarEmpresa;
exports.eliminarEmpresa = eliminarEmpresa;
const path_1 = __importDefault(require("path"));
const archivoJson_1 = require("../utils/archivoJson");
const rutaArchivo = path_1.default.join(__dirname, "empresas.json");
function leerEmpresas() {
    return (0, archivoJson_1.leerArchivo)(rutaArchivo);
}
function guardarEmpresas(empresas) {
    (0, archivoJson_1.guardarArchivo)(rutaArchivo, empresas);
}
function buscarPorId(id) {
    return leerEmpresas().find((e) => e.id === id);
}
function buscarPorNit(nit) {
    return leerEmpresas().find((e) => e.nit === nit);
}
function agregarEmpresa(datos) {
    const empresas = leerEmpresas();
    const nueva = { id: (0, archivoJson_1.generarId)(), estado: "activa", ...datos };
    empresas.push(nueva);
    guardarEmpresas(empresas);
    return nueva;
}
function actualizarEmpresa(id, datos) {
    const empresas = leerEmpresas();
    const indice = empresas.findIndex((e) => e.id === id);
    if (indice === -1)
        return false;
    empresas[indice] = { ...empresas[indice], ...datos };
    guardarEmpresas(empresas);
    return true;
}
function eliminarEmpresa(id) {
    const empresas = leerEmpresas();
    const filtradas = empresas.filter((e) => e.id !== id);
    if (filtradas.length === empresas.length)
        return false;
    guardarEmpresas(filtradas);
    return true;
}
