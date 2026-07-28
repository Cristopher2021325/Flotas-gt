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
exports.obtenerViajes = obtenerViajes;
exports.obtenerViajePorId = obtenerViajePorId;
exports.crearViaje = crearViaje;
exports.cambiarEstadoViaje = cambiarEstadoViaje;
exports.eliminarViaje = eliminarViaje;
const viajeRepository = __importStar(require("../data/viajeRepository"));
const conductorService = __importStar(require("./conductorService"));
const vehiculoService = __importStar(require("./vehiculoService"));
const rutaService = __importStar(require("./rutaService"));
const cargaService = __importStar(require("./cargaService"));
function obtenerViajes() {
    return viajeRepository.leerViajes();
}
function obtenerViajePorId(id) {
    if (!id)
        throw new Error("debes indicar un id");
    const encontrado = viajeRepository.buscarPorId(id);
    if (!encontrado)
        throw new Error(`no se encontro un viaje con el id "${id}"`);
    return encontrado;
}
function crearViaje(datos) {
    if (!datos.conductorId || !datos.vehiculoId || !datos.rutaId || !datos.inicioProgramado) {
        throw new Error("conductor, vehiculo, ruta y fecha de inicio programado son obligatorios");
    }
    conductorService.obtenerConductorPorId(datos.conductorId);
    vehiculoService.obtenerVehiculoPorId(datos.vehiculoId);
    rutaService.obtenerRutaPorId(datos.rutaId);
    if (datos.cargaId) {
        cargaService.obtenerCargaPorId(datos.cargaId);
    }
    return viajeRepository.agregarViaje(datos);
}
function cambiarEstadoViaje(id, nuevoEstado) {
    obtenerViajePorId(id);
    const datos = { estado: nuevoEstado };
    if (nuevoEstado === "en_curso")
        datos.inicioReal = new Date().toISOString();
    if (nuevoEstado === "completado" || nuevoEstado === "cancelado")
        datos.finReal = new Date().toISOString();
    const actualizo = viajeRepository.actualizarViaje(id, datos);
    if (!actualizo)
        throw new Error("no se pudo actualizar el viaje");
}
function eliminarViaje(id) {
    obtenerViajePorId(id);
    const elimino = viajeRepository.eliminarViaje(id);
    if (!elimino)
        throw new Error("no se pudo eliminar el viaje");
}
