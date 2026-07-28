"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cliente_1 = require("./client/cliente");
const server_1 = require("./api/server");
process.on("uncaughtException", (error) => {
    console.log(`\nerror inesperado: ${error.message}`);
});
process.on("unhandledRejection", (razon) => {
    const mensaje = razon instanceof Error ? razon.message : String(razon);
    console.log(`\nerror inesperado (promesa): ${mensaje}`);
});
const modo = process.argv[2];
if (modo === "api") {
    (0, server_1.iniciarServidor)();
}
else {
    (0, cliente_1.iniciarCliente)().catch((error) => {
        const mensaje = error instanceof Error ? error.message : "ocurrio un error inesperado";
        console.log(`\nno se pudo iniciar el programa: ${mensaje}`);
    });
}
