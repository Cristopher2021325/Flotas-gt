import path from "path";
import { puntoParada } from "../models/puntoParada";
import { leerArchivo, guardarArchivo, generarId } from "../utils/archivoJson";

const rutaArchivo = path.join(__dirname, "paradas.json");

export function leerParadas(): puntoParada[] {
  return leerArchivo<puntoParada>(rutaArchivo);
}

export function guardarParadas(datos: puntoParada[]): void {
  guardarArchivo<puntoParada>(rutaArchivo, datos);
}

export function buscarPorId(id: string): puntoParada | undefined {
  return leerParadas().find((p) => p.id === id);
}

export function buscarPorRuta(rutaId: string): puntoParada[] {
  return leerParadas()
    .filter((p) => p.rutaId === rutaId)
    .sort((a, b) => a.orden - b.orden);
}

export function agregarParada(datos: Omit<puntoParada, "id">): puntoParada {
  const paradas = leerParadas();
  const nueva: puntoParada = { id: generarId(), ...datos };
  paradas.push(nueva);
  guardarParadas(paradas);
  return nueva;
}

export function actualizarParada(id: string, datos: Partial<puntoParada>): boolean {
  const paradas = leerParadas();
  const indice = paradas.findIndex((p) => p.id === id);
  if (indice === -1) return false;

  paradas[indice] = { ...paradas[indice], ...datos };
  guardarParadas(paradas);
  return true;
}

export function eliminarParada(id: string): boolean {
  const paradas = leerParadas();
  const filtradas = paradas.filter((p) => p.id !== id);
  if (filtradas.length === paradas.length) return false;

  guardarParadas(filtradas);
  return true;
}
