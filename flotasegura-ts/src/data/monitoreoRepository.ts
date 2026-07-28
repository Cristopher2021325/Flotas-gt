import path from "path";
import { monitoreo } from "../models/monitoreo";
import { leerArchivo, guardarArchivo, generarId } from "../utils/archivoJson";

const rutaArchivo = path.join(__dirname, "monitoreos.json");

export function leerMonitoreos(): monitoreo[] {
  return leerArchivo<monitoreo>(rutaArchivo);
}

export function guardarMonitoreos(datos: monitoreo[]): void {
  guardarArchivo<monitoreo>(rutaArchivo, datos);
}

export function buscarPorViaje(viajeId: string): monitoreo[] {
  return leerMonitoreos()
    .filter((m) => m.viajeId === viajeId)
    .sort((a, b) => (a.registradoEn < b.registradoEn ? 1 : -1));
}

export function agregarMonitoreo(datos: Omit<monitoreo, "id" | "registradoEn">): monitoreo {
  const monitoreos = leerMonitoreos();
  const nuevo: monitoreo = { id: generarId(), registradoEn: new Date().toISOString(), ...datos };
  monitoreos.push(nuevo);
  guardarMonitoreos(monitoreos);
  return nuevo;
}
