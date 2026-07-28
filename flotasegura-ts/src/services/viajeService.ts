import { viaje } from "../models/viaje";
import * as viajeRepository from "../data/viajeRepository";
import * as conductorService from "./conductorService";
import * as vehiculoService from "./vehiculoService";
import * as rutaService from "./rutaService";
import * as cargaService from "./cargaService";

export function obtenerViajes(): viaje[] {
  return viajeRepository.leerViajes();
}

export function obtenerViajePorId(id: string): viaje {
  if (!id) throw new Error("debes indicar un id");

  const encontrado = viajeRepository.buscarPorId(id);
  if (!encontrado) throw new Error(`no se encontro un viaje con el id "${id}"`);

  return encontrado;
}

export function crearViaje(
  datos: Omit<viaje, "id" | "estado" | "inicioReal" | "finReal" | "notasClaude">
): viaje {
  if (!datos.conductorId || !datos.vehiculoId || !datos.rutaId || !datos.inicioProgramado) {
    throw new Error("conductor, vehiculo, ruta y fecha de inicio programado son obligatorios");
  }

  
  conductorService.obtenerConductorPorId(datos.conductorId);
  vehiculoService.obtenerVehiculoPorId(datos.vehiculoId);
  rutaService.obtenerRutaPorId(datos.rutaId);
  if (datos.cargaId) {
    cargaService.obtenerCargaPorId(datos.cargaId);
  }

  return viajeRepository.agregarViaje(datos);
}


export function cambiarEstadoViaje(id: string, nuevoEstado: viaje["estado"]): void {
  obtenerViajePorId(id);

  const datos: Partial<viaje> = { estado: nuevoEstado };
  if (nuevoEstado === "en_curso") datos.inicioReal = new Date().toISOString();
  if (nuevoEstado === "completado" || nuevoEstado === "cancelado") datos.finReal = new Date().toISOString();

  const actualizo = viajeRepository.actualizarViaje(id, datos);
  if (!actualizo) throw new Error("no se pudo actualizar el viaje");
}

export function eliminarViaje(id: string): void {
  obtenerViajePorId(id);

  const elimino = viajeRepository.eliminarViaje(id);
  if (!elimino) throw new Error("no se pudo eliminar el viaje");
}
