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
exports.menuCargas = menuCargas;
const readline_1 = require("../utils/readline");
const cargaService = __importStar(require("../services/cargaService"));
function mostrarOpciones() {
    console.log("\n----- cargas -----");
    console.log("1. listar cargas");
    console.log("2. buscar carga por id");
    console.log("3. registrar nueva carga");
    console.log("4. cambiar estado de la carga");
    console.log("5. eliminar carga");
    console.log("0. volver al menu principal");
}
function mostrarCarga(c) {
    console.log(`id: ${c.id} | ${c.descripcion} | peso: ${c.pesoKg} kg | tipo: ${c.tipoCarga} | estado: ${c.estado}`);
    console.log(`   origen: ${c.origenDireccion} -> destino: ${c.destinoDireccion} | refrigeracion: ${c.requiereRefrigeracion ? "si" : "no"}`);
}
async function menuCargas() {
    let continuar = true;
    while (continuar) {
        mostrarOpciones();
        const opcion = await (0, readline_1.preguntar)("elige una opcion: ");
        try {
            switch (opcion) {
                case "1": {
                    const cargas = cargaService.obtenerCargas();
                    console.log(`\nse encontraron ${cargas.length} carga(s):`);
                    cargas.forEach(mostrarCarga);
                    break;
                }
                case "2": {
                    const id = await (0, readline_1.preguntar)("id de la carga: ");
                    const encontrada = cargaService.obtenerCargaPorId(id);
                    console.log("\ncarga encontrada:");
                    mostrarCarga(encontrada);
                    break;
                }
                case "3": {
                    const empresaId = await (0, readline_1.preguntar)("id de la empresa duena de la carga: ");
                    const descripcion = await (0, readline_1.preguntar)("descripcion de la carga: ");
                    const pesoKg = Number(await (0, readline_1.preguntar)("peso en kg: "));
                    const tipoCarga = await (0, readline_1.preguntar)("tipo de carga (general, peligrosa, refrigerada...): ");
                    const requiereRefrigeracionTexto = await (0, readline_1.preguntar)("requiere refrigeracion? (si/no): ");
                    const origenDireccion = await (0, readline_1.preguntar)("direccion de origen: ");
                    const destinoDireccion = await (0, readline_1.preguntar)("direccion de destino: ");
                    const nueva = cargaService.crearCarga({
                        empresaId, descripcion, pesoKg, tipoCarga,
                        requiereRefrigeracion: requiereRefrigeracionTexto.toLowerCase() === "si",
                        origenDireccion, destinoDireccion,
                    });
                    console.log("\ncarga registrada con exito:");
                    mostrarCarga(nueva);
                    break;
                }
                case "4": {
                    const id = await (0, readline_1.preguntar)("id de la carga: ");
                    const nuevoEstado = await (0, readline_1.preguntar)("nuevo estado (pendiente, asignada, en_transito, entregada, cancelada): ");
                    cargaService.actualizarCarga(id, { estado: nuevoEstado });
                    console.log("\nestado actualizado correctamente.");
                    break;
                }
                case "5": {
                    const id = await (0, readline_1.preguntar)("id de la carga a eliminar: ");
                    cargaService.eliminarCarga(id);
                    console.log("\ncarga eliminada correctamente.");
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
