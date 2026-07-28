"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarCliente = iniciarCliente;
const menuPrincipal_1 = require("../menu/menuPrincipal");
const readline_1 = require("../utils/readline");
async function iniciarCliente() {
    console.log("bienvenido a flotasegura gt");
    console.log("sistema de gestion de empresas transportistas\n");
    await (0, menuPrincipal_1.iniciarMenu)();
    (0, readline_1.cerrarLectura)();
}
