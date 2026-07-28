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
exports.menuEmpresas = menuEmpresas;
const readline_1 = require("../utils/readline");
const empresaService = __importStar(require("../services/empresaService"));
function mostrarOpciones() {
    console.log("\n----- empresas transportistas -----");
    console.log("1. listar todas las empresas");
    console.log("2. listar solo empresas activas");
    console.log("3. buscar empresa por id");
    console.log("4. registrar nueva empresa");
    console.log("5. actualizar telefono o email de una empresa");
    console.log("6. desactivar empresa");
    console.log("7. eliminar empresa");
    console.log("0. volver al menu principal");
}
function mostrarEmpresa(e) {
    console.log(`id: ${e.id} | nombre: ${e.nombre} | nit: ${e.nit} | estado: ${e.estado}`);
    console.log(`   licencia: ${e.licenciaOperacion} | telefono: ${e.telefono} | email: ${e.email}`);
}
async function menuEmpresas() {
    let continuar = true;
    while (continuar) {
        mostrarOpciones();
        const opcion = await (0, readline_1.preguntar)("elige una opcion: ");
        try {
            switch (opcion) {
                case "1": {
                    const empresas = empresaService.obtenerEmpresas();
                    console.log(`\nse encontraron ${empresas.length} empresa(s):`);
                    empresas.forEach(mostrarEmpresa);
                    break;
                }
                case "2": {
                    const activas = empresaService.obtenerEmpresasActivas();
                    console.log(`\nempresas activas (${activas.length}):`);
                    activas.forEach(mostrarEmpresa);
                    break;
                }
                case "3": {
                    const id = await (0, readline_1.preguntar)("ingresa el id de la empresa: ");
                    const encontrada = empresaService.obtenerEmpresaPorId(id);
                    console.log("\nempresa encontrada:");
                    mostrarEmpresa(encontrada);
                    break;
                }
                case "4": {
                    const nombre = await (0, readline_1.preguntar)("nombre de la empresa: ");
                    const nit = await (0, readline_1.preguntar)("nit: ");
                    const licenciaOperacion = await (0, readline_1.preguntar)("licencia de operacion: ");
                    const telefono = await (0, readline_1.preguntar)("telefono: ");
                    const email = await (0, readline_1.preguntar)("email: ");
                    const nueva = empresaService.crearEmpresa({ nombre, nit, licenciaOperacion, telefono, email });
                    console.log("\nempresa registrada con exito:");
                    mostrarEmpresa(nueva);
                    break;
                }
                case "5": {
                    const id = await (0, readline_1.preguntar)("id de la empresa a actualizar: ");
                    const telefono = await (0, readline_1.preguntar)("nuevo telefono (dejar vacio para no cambiar): ");
                    const email = await (0, readline_1.preguntar)("nuevo email (dejar vacio para no cambiar): ");
                    const datos = {};
                    if (telefono)
                        datos.telefono = telefono;
                    if (email)
                        datos.email = email;
                    empresaService.actualizarDatosEmpresa(id, datos);
                    console.log("\nempresa actualizada correctamente.");
                    break;
                }
                case "6": {
                    const id = await (0, readline_1.preguntar)("id de la empresa a desactivar: ");
                    empresaService.desactivarEmpresa(id);
                    console.log("\nempresa desactivada correctamente.");
                    break;
                }
                case "7": {
                    const id = await (0, readline_1.preguntar)("id de la empresa a eliminar: ");
                    empresaService.eliminarEmpresaDefinitivo(id);
                    console.log("\nempresa eliminada correctamente.");
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
