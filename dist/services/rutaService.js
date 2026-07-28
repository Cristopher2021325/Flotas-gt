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
exports.obtenerRutas = obtenerRutas;
exports.obtenerRutaPorId = obtenerRutaPorId;
exports.crearRuta = crearRuta;
exports.actualizarRuta = actualizarRuta;
exports.eliminarRuta = eliminarRuta;
const rutaRepository = __importStar(require("../data/rutaRepository"));
function obtenerRutas() {
    return rutaRepository.leerRutas();
}
function obtenerRutaPorId(id) {
    if (!id)
        throw new Error("debes indicar un id");
    const encontrada = rutaRepository.buscarPorId(id);
    if (!encontrada)
        throw new Error(`no se encontro una ruta con el id "${id}"`);
    return encontrada;
}
function crearRuta(datos) {
    if (!datos.nombre || !datos.origenDescripcion || !datos.destinoDescripcion) {
        throw new Error("nombre, origen y destino son obligatorios");
    }
    return rutaRepository.agregarRuta(datos);
}
function actualizarRuta(id, datos) {
    obtenerRutaPorId(id);
    const actualizo = rutaRepository.actualizarRuta(id, datos);
    if (!actualizo)
        throw new Error("no se pudo actualizar la ruta");
}
function eliminarRuta(id) {
    obtenerRutaPorId(id);
    const elimino = rutaRepository.eliminarRuta(id);
    if (!elimino)
        throw new Error("no se pudo eliminar la ruta");
}
