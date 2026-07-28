import path from "path";
import { viaje } from "../models/viaje";
import { leerArchivo, guardarArchivo, generarId } from "../utils/archivoJson";

const rutaArchivo = path.join(__dirname, "viajes.json");

export function leerViajes(): viaje[] {
  return leerArchivo<viaje>(rutaArchivo);
}

export function guardarViajes(datos: viaje[]): void {
  guardarArchivo<viaje>(rutaArchivo, datos);
}

export function buscarPorId(id: string): viaje | undefined {
  return leerViajes().find((v) => v.id === id);
}

export function agregarViaje(datos: Omit<viaje, "id" | "estado" | "inicioReal" | "finReal" | "notasClaude">): viaje {
  const viajes = leerViajes();
  const nuevo: viaje = { id: generarId(), estado: "programado", inicioReal: null, finReal: null, notasClaude: "", ...datos };
  viajes.push(nuevo);
  guardarViajes(viajes);
  return nuevo;
}

export function actualizarViaje(id: string, datos: Partial<viaje>): boolean {
  const viajes = leerViajes();
  const indice = viajes.findIndex((v) => v.id === id);
  if (indice === -1) return false;

  viajes[indice] = { ...viajes[indice], ...datos };
  guardarViajes(viajes);
  return true;
}

export function eliminarViaje(id: string): boolean {
  const viajes = leerViajes();
  const filtrados = viajes.filter((v) => v.id !== id);
  if (filtrados.length === viajes.length) return false;

  guardarViajes(filtrados);
  return true;
}
