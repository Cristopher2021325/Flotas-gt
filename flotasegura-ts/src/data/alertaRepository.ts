import path from "path";
import { alertaFatiga } from "../models/alertaFatiga";
import { leerArchivo, guardarArchivo, generarId } from "../utils/archivoJson";

const rutaArchivo = path.join(__dirname, "alertas.json");

export function leerAlertas(): alertaFatiga[] {
  return leerArchivo<alertaFatiga>(rutaArchivo);
}

export function guardarAlertas(datos: alertaFatiga[]): void {
  guardarArchivo<alertaFatiga>(rutaArchivo, datos);
}

export function buscarPorId(id: string): alertaFatiga | undefined {
  return leerAlertas().find((a) => a.id === id);
}

export function buscarPendientes(): alertaFatiga[] {
  return leerAlertas().filter((a) => !a.atendida);
}

export function agregarAlerta(datos: Omit<alertaFatiga, "id" | "atendida" | "generadaEn">): alertaFatiga {
  const alertas = leerAlertas();
  const nueva: alertaFatiga = { id: generarId(), atendida: false, generadaEn: new Date().toISOString(), ...datos };
  alertas.push(nueva);
  guardarAlertas(alertas);
  return nueva;
}

export function marcarAtendida(id: string): boolean {
  const alertas = leerAlertas();
  const indice = alertas.findIndex((a) => a.id === id);
  if (indice === -1) return false;

  alertas[indice].atendida = true;
  guardarAlertas(alertas);
  return true;
}
