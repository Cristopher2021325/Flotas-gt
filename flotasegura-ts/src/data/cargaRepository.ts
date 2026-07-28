import path from "path";
import { carga } from "../models/carga";
import { leerArchivo, guardarArchivo, generarId } from "../utils/archivoJson";

const rutaArchivo = path.join(__dirname, "cargas.json");

export function leerCargas(): carga[] {
  return leerArchivo<carga>(rutaArchivo);
}

export function guardarCargas(datos: carga[]): void {
  guardarArchivo<carga>(rutaArchivo, datos);
}

export function buscarPorId(id: string): carga | undefined {
  return leerCargas().find((c) => c.id === id);
}

export function agregarCarga(datos: Omit<carga, "id" | "estado">): carga {
  const cargas = leerCargas();
  const nueva: carga = { id: generarId(), estado: "pendiente", ...datos };
  cargas.push(nueva);
  guardarCargas(cargas);
  return nueva;
}

export function actualizarCarga(id: string, datos: Partial<carga>): boolean {
  const cargas = leerCargas();
  const indice = cargas.findIndex((c) => c.id === id);
  if (indice === -1) return false;

  cargas[indice] = { ...cargas[indice], ...datos };
  guardarCargas(cargas);
  return true;
}

export function eliminarCarga(id: string): boolean {
  const cargas = leerCargas();
  const filtradas = cargas.filter((c) => c.id !== id);
  if (filtradas.length === cargas.length) return false;

  guardarCargas(filtradas);
  return true;
}
