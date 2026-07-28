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
exports.menuConductores = menuConductores;
const readline_1 = require("../utils/readline");
const conductorService = __importStar(require("../services/conductorService"));
function mostrarOpciones() {
    console.log("\n----- conductores -----");
    console.log("1. listar conductores");
    console.log("2. buscar conductor por id");
    console.log("3. registrar nuevo conductor");
    console.log("4. actualizar horas de manejo / descanso");
    console.log("5. cambiar estado del conductor");
    console.log("6. eliminar conductor");
    console.log("0. volver al menu principal");
}
function mostrarConductor(c) {
    console.log(`id: ${c.id} | ${c.nombreCompleto} | licencia: ${c.licenciaNumero} (${c.licenciaTipo}) | estado: ${c.estado}`);
    console.log(`   empresa: ${c.empresaId} | horas manejo hoy: ${c.horasManejoHoy} | horas descanso: ${c.horasDescansoAcumuladas}`);
}
async function menuConductores() {
    let continuar = true;
    while (continuar) {
        mostrarOpciones();
        const opcion = await (0, readline_1.preguntar)("elige una opcion: ");
        try {
            switch (opcion) {
                case "1": {
                    const conductores = conductorService.obtenerConductores();
                    console.log(`\nse encontraron ${conductores.length} conductor(es):`);
                    conductores.forEach(mostrarConductor);
                    break;
                }
                case "2": {
                    const id = await (0, readline_1.preguntar)("id del conductor: ");
                    const encontrado = conductorService.obtenerConductorPorId(id);
                    console.log("\nconductor encontrado:");
                    mostrarConductor(encontrado);
                    break;
                }
                case "3": {
                    const empresaId = await (0, readline_1.preguntar)("id de la empresa a la que pertenece: ");
                    const nombreCompleto = await (0, readline_1.preguntar)("nombre completo: ");
                    const licenciaTipo = await (0, readline_1.preguntar)("tipo de licencia (a, b, c, e): ");
                    const licenciaNumero = await (0, readline_1.preguntar)("numero de licencia: ");
                    const licenciaVencimiento = await (0, readline_1.preguntar)("vencimiento de licencia (aaaa-mm-dd): ");
                    const telefono = await (0, readline_1.preguntar)("telefono: ");
                    const nuevo = conductorService.crearConductor({
                        empresaId, nombreCompleto, licenciaTipo, licenciaNumero, licenciaVencimiento, telefono,
                    });
                    console.log("\nconductor registrado con exito:");
                    mostrarConductor(nuevo);
                    break;
                }
                case "4": {
                    const id = await (0, readline_1.preguntar)("id del conductor: ");
                    const horasManejoHoy = await (0, readline_1.preguntar)("horas de manejo hoy (dejar vacio para no cambiar): ");
                    const horasDescansoAcumuladas = await (0, readline_1.preguntar)("horas de descanso acumuladas (dejar vacio para no cambiar): ");
                    const datos = {};
                    if (horasManejoHoy)
                        datos.horasManejoHoy = Number(horasManejoHoy);
                    if (horasDescansoAcumuladas)
                        datos.horasDescansoAcumuladas = Number(horasDescansoAcumuladas);
                    conductorService.actualizarConductor(id, datos);
                    console.log("\nconductor actualizado correctamente.");
                    break;
                }
                case "5": {
                    const id = await (0, readline_1.preguntar)("id del conductor: ");
                    const nuevoEstado = await (0, readline_1.preguntar)("nuevo estado (disponible, en_ruta, descansando, inactivo): ");
                    conductorService.actualizarConductor(id, { estado: nuevoEstado });
                    console.log("\nestado actualizado correctamente.");
                    break;
                }
                case "6": {
                    const id = await (0, readline_1.preguntar)("id del conductor a eliminar: ");
                    conductorService.eliminarConductor(id);
                    console.log("\nconductor eliminado correctamente.");
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
