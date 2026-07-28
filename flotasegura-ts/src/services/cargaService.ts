import { carga } from "../models/carga";
import * as cargaRepository from "../data/cargaRepository";
import * as empresaService from "./empresaService";

export function obtenerCargas(): carga[] {
  return cargaRepository.leerCargas();
}

export function obtenerCargaPorId(id: string): carga {
  if (!id) throw new Error("debes indicar un id");

  const encontrada = cargaRepository.buscarPorId(id);
  if (!encontrada) throw new Error(`no se encontro una carga con el id "${id}"`);

  return encontrada;
}

export function crearCarga(datos: Omit<carga, "id" | "estado">): carga {
  if (!datos.descripcion || !datos.pesoKg || !datos.empresaId) {
    throw new Error("descripcion, peso y empresa son obligatorios");
  }

  empresaService.obtenerEmpresaPorId(datos.empresaId);

  return cargaRepository.agregarCarga(datos);
}

export function actualizarCarga(id: string, datos: Partial<carga>): void {
  obtenerCargaPorId(id);

  const actualizo = cargaRepository.actualizarCarga(id, datos);
  if (!actualizo) throw new Error("no se pudo actualizar la carga");
}

export function eliminarCarga(id: string): void {
  obtenerCargaPorId(id);

  const elimino = cargaRepository.eliminarCarga(id);
  if (!elimino) throw new Error("no se pudo eliminar la carga");
}
