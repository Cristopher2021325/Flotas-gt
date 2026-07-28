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
exports.menuIncidentes = menuIncidentes;
const readline_1 = require("../utils/readline");
const incidenteService = __importStar(require("../services/incidenteService"));
function mostrarOpciones() {
    console.log("\n----- incidentes -----");
    console.log("1. listar incidentes");
    console.log("2. buscar incidente por id");
    console.log("3. reportar nuevo incidente");
    console.log("0. volver al menu principal");
}
function mostrarIncidente(i) {
    console.log(`id: ${i.id} | tipo: ${i.tipo} | severidad: ${i.severidad} | viaje: ${i.viajeId}`);
    console.log(`   ${i.descripcion} | reportado a autoridades: ${i.reportadoAutoridades ? "si" : "no"} | ${i.ocurridoEn}`);
}
async function menuIncidentes() {
    let continuar = true;
    while (continuar) {
        mostrarOpciones();
        const opcion = await (0, readline_1.preguntar)("elige una opcion: ");
        try {
            switch (opcion) {
                case "1": {
                    const incidentes = incidenteService.obtenerIncidentes();
                    console.log(`\nse encontraron ${incidentes.length} incidente(s):`);
                    incidentes.forEach(mostrarIncidente);
                    break;
                }
                case "2": {
                    const id = await (0, readline_1.preguntar)("id del incidente: ");
                    const encontrado = incidenteService.obtenerIncidentePorId(id);
                    console.log("\nincidente encontrado:");
                    mostrarIncidente(encontrado);
                    break;
                }
                case "3": {
                    const viajeId = await (0, readline_1.preguntar)("id del viaje: ");
                    const conductorId = await (0, readline_1.preguntar)("id del conductor: ");
                    const vehiculoId = await (0, readline_1.preguntar)("id del vehiculo: ");
                    const tipo = await (0, readline_1.preguntar)("tipo (accidente, falla_mecanica, robo, clima, cierre_vial, otro): ");
                    const descripcion = await (0, readline_1.preguntar)("descripcion del incidente: ");
                    const severidad = await (0, readline_1.preguntar)("severidad (leve, moderado, grave, fatal): ");
                    const reportadoTexto = await (0, readline_1.preguntar)("se reporto a las autoridades? (si/no): ");
                    const nuevo = incidenteService.reportarIncidente({
                        viajeId, conductorId, vehiculoId,
                        tipo: tipo,
                        descripcion,
                        severidad: severidad,
                        reportadoAutoridades: reportadoTexto.toLowerCase() === "si",
                    });
                    console.log("\nincidente reportado correctamente:");
                    mostrarIncidente(nuevo);
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
