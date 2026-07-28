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
exports.obtenerConductores = obtenerConductores;
exports.obtenerConductorPorId = obtenerConductorPorId;
exports.crearConductor = crearConductor;
exports.actualizarConductor = actualizarConductor;
exports.eliminarConductor = eliminarConductor;
const conductorRepository = __importStar(require("../data/conductorRepository"));
const empresaService = __importStar(require("./empresaService"));
function obtenerConductores() {
    return conductorRepository.leerConductores();
}
function obtenerConductorPorId(id) {
    if (!id)
        throw new Error("debes indicar un id");
    const encontrado = conductorRepository.buscarPorId(id);
    if (!encontrado)
        throw new Error(`no se encontro un conductor con el id "${id}"`);
    return encontrado;
}
function crearConductor(datos) {
    if (!datos.nombreCompleto || !datos.licenciaNumero || !datos.empresaId) {
        throw new Error("nombre completo, numero de licencia y empresa son obligatorios");
    }
    empresaService.obtenerEmpresaPorId(datos.empresaId); // valida que la empresa exista
    const licenciaRepetida = conductorRepository.buscarPorLicencia(datos.licenciaNumero);
    if (licenciaRepetida) {
        throw new Error("ya existe un conductor registrado con ese numero de licencia");
    }
    return conductorRepository.agregarConductor(datos);
}
function actualizarConductor(id, datos) {
    obtenerConductorPorId(id);
    const actualizo = conductorRepository.actualizarConductor(id, datos);
    if (!actualizo)
        throw new Error("no se pudo actualizar el conductor");
}
function eliminarConductor(id) {
    obtenerConductorPorId(id);
    const elimino = conductorRepository.eliminarConductor(id);
    if (!elimino)
        throw new Error("no se pudo eliminar el conductor");
}
