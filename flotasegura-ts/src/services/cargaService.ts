import { carga } from "../models/carga";
import * as cargaRepository from "../data/cargaRepository";
import * as empresaService from "./empresaService";

export async function obtenerCargas(): Promise<carga[]> {
  return cargaRepository.leerCargas();
}

export async function obtenerCargaPorId(id: string): Promise<carga> {
  if (!id) throw new Error("debes indicar un id");

  const encontrada = await cargaRepository.buscarPorId(id);
  if (!encontrada) throw new Error(`no se encontro una carga con el id "${id}"`);

  return encontrada;
}

export async function crearCarga(datos: Omit<carga, "id" | "estado">): Promise<carga> {
  if (!datos.descripcion || !datos.pesoKg || !datos.empresaId) {
    throw new Error("descripcion, peso y empresa son obligatorios");
  }

  await empresaService.obtenerEmpresaPorId(datos.empresaId);

  return cargaRepository.agregarCarga(datos);
}

export async function actualizarCarga(id: string, datos: Partial<carga>): Promise<void> {
  await obtenerCargaPorId(id);

  const actualizo = await cargaRepository.actualizarCarga(id, datos);
  if (!actualizo) throw new Error("no se pudo actualizar la carga");
}

export async function eliminarCarga(id: string): Promise<void> {
  await obtenerCargaPorId(id);

  const elimino = await cargaRepository.eliminarCarga(id);
  if (!elimino) throw new Error("no se pudo eliminar la carga");
}
