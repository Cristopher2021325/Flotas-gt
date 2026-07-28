"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarMenu = iniciarMenu;
const readline_1 = require("../utils/readline");
const menuEmpresas_1 = require("./menuEmpresas");
const menuConductores_1 = require("./menuConductores");
const menuVehiculos_1 = require("./menuVehiculos");
const menuCargas_1 = require("./menuCargas");
const menuRutas_1 = require("./menuRutas");
const menuViajes_1 = require("./menuViajes");
const menuMonitoreo_1 = require("./menuMonitoreo");
const menuAlertas_1 = require("./menuAlertas");
const menuIncidentes_1 = require("./menuIncidentes");
function mostrarOpciones() {
    console.log("\n===== flotasegura gt - menu principal =====");
    console.log("1. empresas transportistas");
    console.log("2. conductores");
    console.log("3. vehiculos");
    console.log("4. cargas");
    console.log("5. rutas y paradas");
    console.log("6. viajes");
    console.log("7. monitoreo en tiempo real");
    console.log("8. alertas de fatiga");
    console.log("9. incidentes");
    console.log("0. salir del programa");
}
// menu principal: siempre regresa aqui despues de salir de un submenu
async function iniciarMenu() {
    let continuar = true;
    while (continuar) {
        mostrarOpciones();
        const opcion = await (0, readline_1.preguntar)("elige una opcion: ");
        try {
            switch (opcion) {
                case "1":
                    await (0, menuEmpresas_1.menuEmpresas)();
                    break;
                case "2":
                    await (0, menuConductores_1.menuConductores)();
                    break;
                case "3":
                    await (0, menuVehiculos_1.menuVehiculos)();
                    break;
                case "4":
                    await (0, menuCargas_1.menuCargas)();
                    break;
                case "5":
                    await (0, menuRutas_1.menuRutas)();
                    break;
                case "6":
                    await (0, menuViajes_1.menuViajes)();
                    break;
                case "7":
                    await (0, menuMonitoreo_1.menuMonitoreo)();
                    break;
                case "8":
                    await (0, menuAlertas_1.menuAlertas)();
                    break;
                case "9":
                    await (0, menuIncidentes_1.menuIncidentes)();
                    break;
                case "0": {
                    console.log("\ngracias por usar flotasegura gt. hasta pronto!");
                    continuar = false;
                    break;
                }
                default: {
                    console.log("\nopcion invalida, intenta de nuevo.");
                }
            }
        }
        catch (error) {
            // por si algo truena inesperadamente dentro de un submenu,
            // el programa no se cierra, solo avisa y regresa al menu principal
            const mensaje = error instanceof Error ? error.message : "ocurrio un error inesperado";
            console.log(`\nerror: ${mensaje}`);
        }
    }
}
