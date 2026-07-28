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
exports.obtenerCargas = obtenerCargas;
exports.obtenerCargaPorId = obtenerCargaPorId;
exports.crearCarga = crearCarga;
exports.actualizarCarga = actualizarCarga;
exports.eliminarCarga = eliminarCarga;
const cargaRepository = __importStar(require("../data/cargaRepository"));
const empresaService = __importStar(require("./empresaService"));
function obtenerCargas() {
    return cargaRepository.leerCargas();
}
function obtenerCargaPorId(id) {
    if (!id)
        throw new Error("debes indicar un id");
    const encontrada = cargaRepository.buscarPorId(id);
    if (!encontrada)
        throw new Error(`no se encontro una carga con el id "${id}"`);
    return encontrada;
}
function crearCarga(datos) {
    if (!datos.descripcion || !datos.pesoKg || !datos.empresaId) {
        throw new Error("descripcion, peso y empresa son obligatorios");
    }
    empresaService.obtenerEmpresaPorId(datos.empresaId);
    return cargaRepository.agregarCarga(datos);
}
function actualizarCarga(id, datos) {
    obtenerCargaPorId(id);
    const actualizo = cargaRepository.actualizarCarga(id, datos);
    if (!actualizo)
        throw new Error("no se pudo actualizar la carga");
}
function eliminarCarga(id) {
    obtenerCargaPorId(id);
    const elimino = cargaRepository.eliminarCarga(id);
    if (!elimino)
        throw new Error("no se pudo eliminar la carga");
}
