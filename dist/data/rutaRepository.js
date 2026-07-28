"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerRutas = leerRutas;
exports.guardarRutas = guardarRutas;
exports.buscarPorId = buscarPorId;
exports.agregarRuta = agregarRuta;
exports.actualizarRuta = actualizarRuta;
exports.eliminarRuta = eliminarRuta;
const path_1 = __importDefault(require("path"));
const archivoJson_1 = require("../utils/archivoJson");
const rutaArchivo = path_1.default.join(__dirname, "rutas.json");
function leerRutas() {
    return (0, archivoJson_1.leerArchivo)(rutaArchivo);
}
function guardarRutas(datos) {
    (0, archivoJson_1.guardarArchivo)(rutaArchivo, datos);
}
function buscarPorId(id) {
    return leerRutas().find((r) => r.id === id);
}
function agregarRuta(datos) {
    const rutas = leerRutas();
    const nueva = { id: (0, archivoJson_1.generarId)(), activa: true, ...datos };
    rutas.push(nueva);
    guardarRutas(rutas);
    return nueva;
}
function actualizarRuta(id, datos) {
    const rutas = leerRutas();
    const indice = rutas.findIndex((r) => r.id === id);
    if (indice === -1)
        return false;
    rutas[indice] = { ...rutas[indice], ...datos };
    guardarRutas(rutas);
    return true;
}
function eliminarRuta(id) {
    const rutas = leerRutas();
    const filtradas = rutas.filter((r) => r.id !== id);
    if (filtradas.length === rutas.length)
        return false;
    guardarRutas(filtradas);
    return true;
}
