"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerVehiculos = leerVehiculos;
exports.guardarVehiculos = guardarVehiculos;
exports.buscarPorId = buscarPorId;
exports.buscarPorPlaca = buscarPorPlaca;
exports.agregarVehiculo = agregarVehiculo;
exports.actualizarVehiculo = actualizarVehiculo;
exports.eliminarVehiculo = eliminarVehiculo;
const path_1 = __importDefault(require("path"));
const archivoJson_1 = require("../utils/archivoJson");
const rutaArchivo = path_1.default.join(__dirname, "vehiculos.json");
function leerVehiculos() {
    return (0, archivoJson_1.leerArchivo)(rutaArchivo);
}
function guardarVehiculos(datos) {
    (0, archivoJson_1.guardarArchivo)(rutaArchivo, datos);
}
function buscarPorId(id) {
    return leerVehiculos().find((v) => v.id === id);
}
function buscarPorPlaca(placa) {
    return leerVehiculos().find((v) => v.placa === placa);
}
function agregarVehiculo(datos) {
    const vehiculos = leerVehiculos();
    const nuevo = { id: (0, archivoJson_1.generarId)(), estado: "disponible", pesoActualCarga: 0, ...datos };
    vehiculos.push(nuevo);
    guardarVehiculos(vehiculos);
    return nuevo;
}
function actualizarVehiculo(id, datos) {
    const vehiculos = leerVehiculos();
    const indice = vehiculos.findIndex((v) => v.id === id);
    if (indice === -1)
        return false;
    vehiculos[indice] = { ...vehiculos[indice], ...datos };
    guardarVehiculos(vehiculos);
    return true;
}
function eliminarVehiculo(id) {
    const vehiculos = leerVehiculos();
    const filtrados = vehiculos.filter((v) => v.id !== id);
    if (filtrados.length === vehiculos.length)
        return false;
    guardarVehiculos(filtrados);
    return true;
}
