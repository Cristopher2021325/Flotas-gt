import { incidente } from "../models/incidente";
import * as incidenteRepository from "../data/incidenteRepository";
import * as viajeService from "./viajeService";
import * as conductorService from "./conductorService";
import * as vehiculoService from "./vehiculoService";

export function obtenerIncidentes(): incidente[] {
  return incidenteRepository.leerIncidentes();
}

export function obtenerIncidentePorId(id: string): incidente {
  if (!id) throw new Error("debes indicar un id");

  const encontrado = incidenteRepository.buscarPorId(id);
  if (!encontrado) throw new Error(`no se encontro un incidente con el id "${id}"`);

  return encontrado;
}

export function reportarIncidente(datos: Omit<incidente, "id" | "ocurridoEn">): incidente {
  if (!datos.viajeId || !datos.conductorId || !datos.vehiculoId || !datos.descripcion) {
    throw new Error("viaje, conductor, vehiculo y descripcion son obligatorios");
  }

  viajeService.obtenerViajePorId(datos.viajeId);
  conductorService.obtenerConductorPorId(datos.conductorId);
  vehiculoService.obtenerVehiculoPorId(datos.vehiculoId);

  if (datos.severidad === "grave" || datos.severidad === "fatal") {
    viajeService.cambiarEstadoViaje(datos.viajeId, "accidente");
  }

  return incidenteRepository.agregarIncidente(datos);
}
