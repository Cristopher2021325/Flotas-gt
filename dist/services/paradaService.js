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
exports.obtenerParadas = obtenerParadas;
exports.obtenerParadasDeRuta = obtenerParadasDeRuta;
exports.obtenerParadaPorId = obtenerParadaPorId;
exports.crearParada = crearParada;
exports.eliminarParada = eliminarParada;
const paradaRepository = __importStar(require("../data/paradaRepository"));
const rutaService = __importStar(require("./rutaService"));
function obtenerParadas() {
    return paradaRepository.leerParadas();
}
function obtenerParadasDeRuta(rutaId) {
    rutaService.obtenerRutaPorId(rutaId);
    return paradaRepository.buscarPorRuta(rutaId);
}
function obtenerParadaPorId(id) {
    if (!id)
        throw new Error("debes indicar un id");
    const encontrada = paradaRepository.buscarPorId(id);
    if (!encontrada)
        throw new Error(`no se encontro una parada con el id "${id}"`);
    return encontrada;
}
function crearParada(datos) {
    if (!datos.nombre || !datos.rutaId) {
        throw new Error("nombre y ruta son obligatorios");
    }
    rutaService.obtenerRutaPorId(datos.rutaId);
    return paradaRepository.agregarParada(datos);
}
function eliminarParada(id) {
    obtenerParadaPorId(id);
    const elimino = paradaRepository.eliminarParada(id);
    if (!elimino)
        throw new Error("no se pudo eliminar la parada");
}
