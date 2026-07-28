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
exports.obtenerEmpresas = obtenerEmpresas;
exports.obtenerEmpresasActivas = obtenerEmpresasActivas;
exports.crearEmpresa = crearEmpresa;
exports.obtenerEmpresaPorId = obtenerEmpresaPorId;
exports.actualizarDatosEmpresa = actualizarDatosEmpresa;
exports.desactivarEmpresa = desactivarEmpresa;
exports.eliminarEmpresaDefinitivo = eliminarEmpresaDefinitivo;
const empresaRepository = __importStar(require("../data/empresaRepository"));
function obtenerEmpresas() {
    return empresaRepository.leerEmpresas();
}
function obtenerEmpresasActivas() {
    return empresaRepository.leerEmpresas().filter((e) => e.estado === "activa");
}
function crearEmpresa(datos) {
    if (!datos.nombre || !datos.nit || !datos.licenciaOperacion) {
        throw new Error("nombre, nit y licencia de operacion son obligatorios");
    }
    const nitRepetido = empresaRepository.buscarPorNit(datos.nit);
    if (nitRepetido) {
        throw new Error("ya existe una empresa registrada con ese nit");
    }
    return empresaRepository.agregarEmpresa(datos);
}
function obtenerEmpresaPorId(id) {
    if (!id)
        throw new Error("debes indicar un id");
    const encontrada = empresaRepository.buscarPorId(id);
    if (!encontrada)
        throw new Error(`no se encontro una empresa con el id "${id}"`);
    return encontrada;
}
function actualizarDatosEmpresa(id, datos) {
    obtenerEmpresaPorId(id); // valida que exista, si no existe lanza error
    const actualizo = empresaRepository.actualizarEmpresa(id, datos);
    if (!actualizo)
        throw new Error("no se pudo actualizar la empresa");
}
function desactivarEmpresa(id) {
    actualizarDatosEmpresa(id, { estado: "inactiva" });
}
function eliminarEmpresaDefinitivo(id) {
    obtenerEmpresaPorId(id); // valida que exista
    const elimino = empresaRepository.eliminarEmpresa(id);
    if (!elimino)
        throw new Error("no se pudo eliminar la empresa");
}
