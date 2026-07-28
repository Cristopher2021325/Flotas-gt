"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerArchivo = leerArchivo;
exports.guardarArchivo = guardarArchivo;
exports.generarId = generarId;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function leerArchivo(rutaArchivo) {
    if (!fs_1.default.existsSync(rutaArchivo)) {
        guardarArchivo(rutaArchivo, []);
        return [];
    }
    let contenido;
    try {
        contenido = fs_1.default.readFileSync(rutaArchivo, "utf-8");
    }
    catch (error) {
        throw new Error(`no se pudo leer el archivo "${path_1.default.basename(rutaArchivo)}" (revisa permisos del archivo)`);
    }
    if (contenido.trim() === "") {
        return []; // archivo vacio, todavia no hay datos
    }
    try {
        return JSON.parse(contenido);
    }
    catch (error) {
        throw new Error(`el archivo "${path_1.default.basename(rutaArchivo)}" esta dañado o mal formado (json invalido)`);
    }
}
// guarda una lista de datos en un archivo json
function guardarArchivo(rutaArchivo, datos) {
    try {
        fs_1.default.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2), "utf-8");
    }
    catch (error) {
        throw new Error(`no se pudo guardar el archivo "${path_1.default.basename(rutaArchivo)}" (revisa permisos del archivo)`);
    }
}
// genera un id sencillo basado en la fecha actual (suficiente para un proyecto de practica)
function generarId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000);
}
