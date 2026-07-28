import { viaje } from "../models/viaje";
import * as viajeRepository from "../data/viajeRepository";
import * as conductorService from "./conductorService";
import * as vehiculoService from "./vehiculoService";
import * as rutaService from "./rutaService";
import * as cargaService from "./cargaService";

export async function obtenerViajes(): Promise<viaje[]> {
  return viajeRepository.leerViajes();
}

export async function obtenerViajePorId(id: string): Promise<viaje> {
  if (!id) throw new Error("debes indicar un id");

  const encontrado = await viajeRepository.buscarPorId(id);
  if (!encontrado) throw new Error(`no se encontro un viaje con el id "${id}"`);

  return encontrado;
}

export async function crearViaje(
  datos: Omit<viaje, "id" | "estado" | "inicioReal" | "finReal" | "notasClaude">
): Promise<viaje> {
  if (!datos.conductorId || !datos.vehiculoId || !datos.rutaId || !datos.inicioProgramado) {
    throw new Error("conductor, vehiculo, ruta y fecha de inicio programado son obligatorios");
  }

  await conductorService.obtenerConductorPorId(datos.conductorId);
  await vehiculoService.obtenerVehiculoPorId(datos.vehiculoId);
  await rutaService.obtenerRutaPorId(datos.rutaId);
  if (datos.cargaId) {
    await cargaService.obtenerCargaPorId(datos.cargaId);
  }

  return viajeRepository.agregarViaje(datos);
}

export async function cambiarEstadoViaje(id: string, nuevoEstado: viaje["estado"]): Promise<void> {
  await obtenerViajePorId(id);

  const datos: Partial<viaje> = { estado: nuevoEstado };
  if (nuevoEstado === "en_curso") datos.inicioReal = new Date().toISOString();
  if (nuevoEstado === "completado" || nuevoEstado === "cancelado") datos.finReal = new Date().toISOString();

  const actualizo = await viajeRepository.actualizarViaje(id, datos);
  if (!actualizo) throw new Error("no se pudo actualizar el viaje");
}

export async function eliminarViaje(id: string): Promise<void> {
  await obtenerViajePorId(id);

  const elimino = await viajeRepository.eliminarViaje(id);
  if (!elimino) throw new Error("no se pudo eliminar el viaje");
}
