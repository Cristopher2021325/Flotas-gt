import { alertaFatiga } from "../models/alertaFatiga";
import * as alertaRepository from "../data/alertaRepository";
import * as viajeService from "./viajeService";
import * as conductorService from "./conductorService";

export async function obtenerAlertas(): Promise<alertaFatiga[]> {
  return alertaRepository.leerAlertas();
}

export async function obtenerAlertasPendientes(): Promise<alertaFatiga[]> {
  return alertaRepository.buscarPendientes();
}

export async function generarAlerta(datos: Omit<alertaFatiga, "id" | "atendida" | "generadaEn">): Promise<alertaFatiga> {
  if (!datos.viajeId || !datos.conductorId || !datos.mensaje) {
    throw new Error("viaje, conductor y mensaje son obligatorios");
  }

  await viajeService.obtenerViajePorId(datos.viajeId);
  await conductorService.obtenerConductorPorId(datos.conductorId);

  return alertaRepository.agregarAlerta(datos);
}

export async function atenderAlerta(id: string): Promise<void> {
  if (!id) throw new Error("debes indicar un id");

  const existe = await alertaRepository.buscarPorId(id);
  if (!existe) throw new Error(`no se encontro una alerta con el id "${id}"`);

  const atendio = await alertaRepository.marcarAtendida(id);
  if (!atendio) throw new Error("no se pudo marcar la alerta como atendida");
}
