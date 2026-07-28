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
exports.menuMonitoreo = menuMonitoreo;
const readline_1 = require("../utils/readline");
const monitoreoService = __importStar(require("../services/monitoreoService"));
function mostrarOpciones() {
    console.log("\n----- monitoreo en tiempo real -----");
    console.log("1. ver monitoreos de un viaje");
    console.log("2. registrar nuevo monitoreo");
    console.log("0. volver al menu principal");
}
function mostrarMonitoreo(m) {
    console.log(`${m.registradoEn} | velocidad: ${m.velocidadKmh} km/h | horas continuas: ${m.horasConduccionContinua} | estado: ${m.estadoConductor}`);
}
async function menuMonitoreo() {
    let continuar = true;
    while (continuar) {
        mostrarOpciones();
        const opcion = await (0, readline_1.preguntar)("elige una opcion: ");
        try {
            switch (opcion) {
                case "1": {
                    const viajeId = await (0, readline_1.preguntar)("id del viaje: ");
                    const registros = monitoreoService.obtenerMonitoreosDeViaje(viajeId);
                    console.log(`\nse encontraron ${registros.length} registro(s):`);
                    registros.forEach(mostrarMonitoreo);
                    break;
                }
                case "2": {
                    const viajeId = await (0, readline_1.preguntar)("id del viaje: ");
                    const latitud = Number(await (0, readline_1.preguntar)("latitud: "));
                    const longitud = Number(await (0, readline_1.preguntar)("longitud: "));
                    const velocidadKmh = Number(await (0, readline_1.preguntar)("velocidad (km/h): "));
                    const horasConduccionContinua = Number(await (0, readline_1.preguntar)("horas de conduccion continua: "));
                    const estadoConductor = await (0, readline_1.preguntar)("estado del conductor (activo, alerta_fatiga, detenido, descanso): ");
                    monitoreoService.registrarMonitoreo({
                        viajeId, latitud, longitud, velocidadKmh, horasConduccionContinua,
                        estadoConductor: estadoConductor,
                    });
                    console.log("\nmonitoreo registrado correctamente.");
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
