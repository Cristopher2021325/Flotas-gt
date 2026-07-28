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
exports.menuVehiculos = menuVehiculos;
const readline_1 = require("../utils/readline");
const vehiculoService = __importStar(require("../services/vehiculoService"));
function mostrarOpciones() {
    console.log("\n----- vehiculos -----");
    console.log("1. listar vehiculos");
    console.log("2. buscar vehiculo por id");
    console.log("3. registrar nuevo vehiculo");
    console.log("4. cambiar estado del vehiculo");
    console.log("5. registrar mantenimiento");
    console.log("6. eliminar vehiculo");
    console.log("0. volver al menu principal");
}
function mostrarVehiculo(v) {
    console.log(`id: ${v.id} | placa: ${v.placa} | ${v.marca} ${v.modelo} (${v.anio}) | estado: ${v.estado}`);
    console.log(`   empresa: ${v.empresaId} | tipo: ${v.tipo} | tonelaje max: ${v.tonelajeMaximo} | carga actual: ${v.pesoActualCarga}`);
}
async function menuVehiculos() {
    let continuar = true;
    while (continuar) {
        mostrarOpciones();
        const opcion = await (0, readline_1.preguntar)("elige una opcion: ");
        try {
            switch (opcion) {
                case "1": {
                    const vehiculos = vehiculoService.obtenerVehiculos();
                    console.log(`\nse encontraron ${vehiculos.length} vehiculo(s):`);
                    vehiculos.forEach(mostrarVehiculo);
                    break;
                }
                case "2": {
                    const id = await (0, readline_1.preguntar)("id del vehiculo: ");
                    const encontrado = vehiculoService.obtenerVehiculoPorId(id);
                    console.log("\nvehiculo encontrado:");
                    mostrarVehiculo(encontrado);
                    break;
                }
                case "3": {
                    const empresaId = await (0, readline_1.preguntar)("id de la empresa a la que pertenece: ");
                    const placa = await (0, readline_1.preguntar)("placa: ");
                    const tipo = await (0, readline_1.preguntar)("tipo (trailer, furgon, cisterna...): ");
                    const marca = await (0, readline_1.preguntar)("marca: ");
                    const modelo = await (0, readline_1.preguntar)("modelo: ");
                    const anio = Number(await (0, readline_1.preguntar)("anio: "));
                    const tonelajeMaximo = Number(await (0, readline_1.preguntar)("tonelaje maximo: "));
                    const nuevo = vehiculoService.crearVehiculo({
                        empresaId, placa, tipo, marca, modelo, anio, tonelajeMaximo, ultimoMantenimiento: null,
                    });
                    console.log("\nvehiculo registrado con exito:");
                    mostrarVehiculo(nuevo);
                    break;
                }
                case "4": {
                    const id = await (0, readline_1.preguntar)("id del vehiculo: ");
                    const nuevoEstado = await (0, readline_1.preguntar)("nuevo estado (disponible, en_ruta, mantenimiento, inactivo): ");
                    vehiculoService.actualizarVehiculo(id, { estado: nuevoEstado });
                    console.log("\nestado actualizado correctamente.");
                    break;
                }
                case "5": {
                    const id = await (0, readline_1.preguntar)("id del vehiculo: ");
                    vehiculoService.actualizarVehiculo(id, { ultimoMantenimiento: new Date().toISOString() });
                    console.log("\nmantenimiento registrado correctamente.");
                    break;
                }
                case "6": {
                    const id = await (0, readline_1.preguntar)("id del vehiculo a eliminar: ");
                    vehiculoService.eliminarVehiculo(id);
                    console.log("\nvehiculo eliminado correctamente.");
                    break;
                }
                case "0": {
                    continuar = false;
                    break;
                }
                default: {
                    console.log("\nopcion invalida, intenta de nuevo.");
                }
            }
        }
        catch (error) {
            const mensaje = error instanceof Error ? error.message : "ocurrio un error inesperado";
            console.log(`\nerror: ${mensaje}`);
        }
    }
}
