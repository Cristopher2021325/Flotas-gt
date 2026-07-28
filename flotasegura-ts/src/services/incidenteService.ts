import { incidente } from "../models/incidente";
import * as incidenteRepository from "../data/incidenteRepository";
import * as viajeService from "./viajeService";
import * as conductorService from "./conductorService";
import * as vehiculoService from "./vehiculoService";

export async function obtenerIncidentes(): Promise<incidente[]> {
  return incidenteRepository.leerIncidentes();
}

export async function obtenerIncidentePorId(id: string): Promise<incidente> {
  if (!id) throw new Error("debes indicar un id");

  const encontrado = await incidenteRepository.buscarPorId(id);
  if (!encontrado) throw new Error(`no se encontro un incidente con el id "${id}"`);

  return encontrado;
}

export async function reportarIncidente(datos: Omit<incidente, "id" | "ocurridoEn">): Promise<incidente> {
  if (!datos.viajeId || !datos.conductorId || !datos.vehiculoId || !datos.descripcion) {
    throw new Error("viaje, conductor, vehiculo y descripcion son obligatorios");
  }

  await viajeService.obtenerViajePorId(datos.viajeId);
  await conductorService.obtenerConductorPorId(datos.conductorId);
  await vehiculoService.obtenerVehiculoPorId(datos.vehiculoId);

  if (datos.severidad === "grave" || datos.severidad === "fatal") {
    await viajeService.cambiarEstadoViaje(datos.viajeId, "accidente");
  }

  return incidenteRepository.agregarIncidente(datos);
}
