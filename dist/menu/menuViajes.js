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
exports.menuViajes = menuViajes;
const readline_1 = require("../utils/readline");
const viajeService = __importStar(require("../services/viajeService"));
function mostrarOpciones() {
    console.log("\n----- viajes -----");
    console.log("1. listar viajes");
    console.log("2. buscar viaje por id");
    console.log("3. programar nuevo viaje");
    console.log("4. cambiar estado del viaje");
    console.log("5. eliminar viaje");
    console.log("0. volver al menu principal");
}
function mostrarViaje(v) {
    console.log(`id: ${v.id} | estado: ${v.estado} | inicio programado: ${v.inicioProgramado}`);
    console.log(`   conductor: ${v.conductorId} | vehiculo: ${v.vehiculoId} | ruta: ${v.rutaId} | carga: ${v.cargaId ?? "sin carga"}`);
}
async function menuViajes() {
    let continuar = true;
    while (continuar) {
        mostrarOpciones();
        const opcion = await (0, readline_1.preguntar)("elige una opcion: ");
        try {
            switch (opcion) {
                case "1": {
                    const viajes = viajeService.obtenerViajes();
                    console.log(`\nse encontraron ${viajes.length} viaje(s):`);
                    viajes.forEach(mostrarViaje);
                    break;
                }
                case "2": {
                    const id = await (0, readline_1.preguntar)("id del viaje: ");
                    const encontrado = viajeService.obtenerViajePorId(id);
                    console.log("\nviaje encontrado:");
                    mostrarViaje(encontrado);
                    break;
                }
                case "3": {
                    const conductorId = await (0, readline_1.preguntar)("id del conductor: ");
                    const vehiculoId = await (0, readline_1.preguntar)("id del vehiculo: ");
                    const rutaId = await (0, readline_1.preguntar)("id de la ruta: ");
                    const cargaIdTexto = await (0, readline_1.preguntar)("id de la carga (dejar vacio si no aplica): ");
                    const inicioProgramado = await (0, readline_1.preguntar)("fecha y hora de inicio (aaaa-mm-dd hh:mm): ");
                    const nuevo = viajeService.crearViaje({
                        conductorId, vehiculoId, rutaId,
                        cargaId: cargaIdTexto || null,
                        inicioProgramado,
                    });
                    console.log("\nviaje programado con exito:");
                    mostrarViaje(nuevo);
                    break;
                }
                case "4": {
                    const id = await (0, readline_1.preguntar)("id del viaje: ");
                    const nuevoEstado = await (0, readline_1.preguntar)("nuevo estado (programado, en_curso, pausado, completado, cancelado, accidente): ");
                    viajeService.cambiarEstadoViaje(id, nuevoEstado);
                    console.log("\nestado del viaje actualizado correctamente.");
                    break;
                }
                case "5": {
                    const id = await (0, readline_1.preguntar)("id del viaje a eliminar: ");
                    viajeService.eliminarViaje(id);
                    console.log("\nviaje eliminado correctamente.");
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
