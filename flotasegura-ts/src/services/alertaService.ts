import { alertaFatiga } from "../models/alertaFatiga";
import * as alertaRepository from "../data/alertaRepository";
import * as viajeService from "./viajeService";
import * as conductorService from "./conductorService";

export function obtenerAlertas(): alertaFatiga[] {
  return alertaRepository.leerAlertas();
}

export function obtenerAlertasPendientes(): alertaFatiga[] {
  return alertaRepository.buscarPendientes();
}

export function generarAlerta(datos: Omit<alertaFatiga, "id" | "atendida" | "generadaEn">): alertaFatiga {
  if (!datos.viajeId || !datos.conductorId || !datos.mensaje) {
    throw new Error("viaje, conductor y mensaje son obligatorios");
  }

  viajeService.obtenerViajePorId(datos.viajeId);
  conductorService.obtenerConductorPorId(datos.conductorId);

  return alertaRepository.agregarAlerta(datos);
}

export function atenderAlerta(id: string): void {
  if (!id) throw new Error("debes indicar un id");

  const alertas = alertaRepository.leerAlertas();
  const existe = alertas.find((a) => a.id === id);
  if (!existe) throw new Error(`no se encontro una alerta con el id "${id}"`);

  const atendio = alertaRepository.marcarAtendida(id);
  if (!atendio) throw new Error("no se pudo marcar la alerta como atendida");
}
