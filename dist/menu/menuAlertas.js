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
exports.menuAlertas = menuAlertas;
const readline_1 = require("../utils/readline");
const alertaService = __importStar(require("../services/alertaService"));
function mostrarOpciones() {
    console.log("\n----- alertas de fatiga -----");
    console.log("1. listar todas las alertas");
    console.log("2. listar alertas pendientes");
    console.log("3. generar nueva alerta");
    console.log("4. marcar alerta como atendida");
    console.log("0. volver al menu principal");
}
function mostrarAlerta(a) {
    console.log(`id: ${a.id} | ${a.tipoAlerta} | conductor: ${a.conductorId} | atendida: ${a.atendida ? "si" : "no"}`);
    console.log(`   ${a.mensaje} (horas sin descanso: ${a.horasSinDescanso})`);
}
async function menuAlertas() {
    let continuar = true;
    while (continuar) {
        mostrarOpciones();
        const opcion = await (0, readline_1.preguntar)("elige una opcion: ");
        try {
            switch (opcion) {
                case "1": {
                    const alertas = alertaService.obtenerAlertas();
                    console.log(`\nse encontraron ${alertas.length} alerta(s):`);
                    alertas.forEach(mostrarAlerta);
                    break;
                }
                case "2": {
                    const pendientes = alertaService.obtenerAlertasPendientes();
                    console.log(`\nalertas pendientes (${pendientes.length}):`);
                    pendientes.forEach(mostrarAlerta);
                    break;
                }
                case "3": {
                    const viajeId = await (0, readline_1.preguntar)("id del viaje: ");
                    const conductorId = await (0, readline_1.preguntar)("id del conductor: ");
                    const tipoAlerta = await (0, readline_1.preguntar)("tipo de alerta (pre_fatiga, fatiga, descanso_obligatorio, velocidad_excesiva, ruta_peligrosa): ");
                    const mensaje = await (0, readline_1.preguntar)("mensaje de la alerta: ");
                    const horasSinDescanso = Number(await (0, readline_1.preguntar)("horas sin descanso: "));
                    const nueva = alertaService.generarAlerta({
                        viajeId, conductorId, tipoAlerta: tipoAlerta, mensaje, horasSinDescanso,
                    });
                    console.log("\nalerta generada correctamente:");
                    mostrarAlerta(nueva);
                    break;
                }
                case "4": {
                    const id = await (0, readline_1.preguntar)("id de la alerta a atender: ");
                    alertaService.atenderAlerta(id);
                    console.log("\nalerta marcada como atendida.");
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
