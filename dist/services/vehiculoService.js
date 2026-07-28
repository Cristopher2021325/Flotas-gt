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
exports.obtenerVehiculos = obtenerVehiculos;
exports.obtenerVehiculoPorId = obtenerVehiculoPorId;
exports.crearVehiculo = crearVehiculo;
exports.actualizarVehiculo = actualizarVehiculo;
exports.eliminarVehiculo = eliminarVehiculo;
const vehiculoRepository = __importStar(require("../data/vehiculoRepository"));
const empresaService = __importStar(require("./empresaService"));
function obtenerVehiculos() {
    return vehiculoRepository.leerVehiculos();
}
function obtenerVehiculoPorId(id) {
    if (!id)
        throw new Error("debes indicar un id");
    const encontrado = vehiculoRepository.buscarPorId(id);
    if (!encontrado)
        throw new Error(`no se encontro un vehiculo con el id "${id}"`);
    return encontrado;
}
function crearVehiculo(datos) {
    if (!datos.placa || !datos.tipo || !datos.empresaId) {
        throw new Error("placa, tipo y empresa son obligatorios");
    }
    empresaService.obtenerEmpresaPorId(datos.empresaId);
    const placaRepetida = vehiculoRepository.buscarPorPlaca(datos.placa);
    if (placaRepetida) {
        throw new Error("ya existe un vehiculo registrado con esa placa");
    }
    return vehiculoRepository.agregarVehiculo(datos);
}
function actualizarVehiculo(id, datos) {
    obtenerVehiculoPorId(id);
    const actualizo = vehiculoRepository.actualizarVehiculo(id, datos);
    if (!actualizo)
        throw new Error("no se pudo actualizar el vehiculo");
}
function eliminarVehiculo(id) {
    obtenerVehiculoPorId(id);
    const elimino = vehiculoRepository.eliminarVehiculo(id);
    if (!elimino)
        throw new Error("no se pudo eliminar el vehiculo");
}
