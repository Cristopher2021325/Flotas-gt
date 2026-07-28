import path from "path";
import { incidente } from "../models/incidente";
import { leerArchivo, guardarArchivo, generarId } from "../utils/archivoJson";

const rutaArchivo = path.join(__dirname, "incidentes.json");

export function leerIncidentes(): incidente[] {
  return leerArchivo<incidente>(rutaArchivo);
}

export function guardarIncidentes(datos: incidente[]): void {
  guardarArchivo<incidente>(rutaArchivo, datos);
}

export function buscarPorId(id: string): incidente | undefined {
  return leerIncidentes().find((i) => i.id === id);
}

export function agregarIncidente(datos: Omit<incidente, "id" | "ocurridoEn">): incidente {
  const incidentes = leerIncidentes();
  const nuevo: incidente = { id: generarId(), ocurridoEn: new Date().toISOString(), ...datos };
  incidentes.push(nuevo);
  guardarIncidentes(incidentes);
  return nuevo;
}
