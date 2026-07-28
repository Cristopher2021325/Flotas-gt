import path from "path";
import { conductor } from "../models/conductor";
import { leerArchivo, guardarArchivo, generarId } from "../utils/archivoJson";

const rutaArchivo = path.join(__dirname, "conductores.json");

export function leerConductores(): conductor[] {
  return leerArchivo<conductor>(rutaArchivo);
}

export function guardarConductores(datos: conductor[]): void {
  guardarArchivo<conductor>(rutaArchivo, datos);
}

export function buscarPorId(id: string): conductor | undefined {
  return leerConductores().find((c) => c.id === id);
}

export function buscarPorLicencia(licenciaNumero: string): conductor | undefined {
  return leerConductores().find((c) => c.licenciaNumero === licenciaNumero);
}

export function agregarConductor(datos: Omit<conductor, "id" | "estado" | "horasManejoHoy" | "horasDescansoAcumuladas">): conductor {
  const conductores = leerConductores();
  const nuevo: conductor = { id: generarId(), estado: "disponible", horasManejoHoy: 0, horasDescansoAcumuladas: 0, ...datos };
  conductores.push(nuevo);
  guardarConductores(conductores);
  return nuevo;
}

export function actualizarConductor(id: string, datos: Partial<conductor>): boolean {
  const conductores = leerConductores();
  const indice = conductores.findIndex((c) => c.id === id);
  if (indice === -1) return false;

  conductores[indice] = { ...conductores[indice], ...datos };
  guardarConductores(conductores);
  return true;
}

export function eliminarConductor(id: string): boolean {
  const conductores = leerConductores();
  const filtrados = conductores.filter((c) => c.id !== id);
  if (filtrados.length === conductores.length) return false;

  guardarConductores(filtrados);
  return true;
}
