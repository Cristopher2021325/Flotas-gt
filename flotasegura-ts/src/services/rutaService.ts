import { ruta } from "../models/ruta";
import * as rutaRepository from "../data/rutaRepository";

export function obtenerRutas(): ruta[] {
  return rutaRepository.leerRutas();
}

export function obtenerRutaPorId(id: string): ruta {
  if (!id) throw new Error("debes indicar un id");

  const encontrada = rutaRepository.buscarPorId(id);
  if (!encontrada) throw new Error(`no se encontro una ruta con el id "${id}"`);

  return encontrada;
}

export function crearRuta(datos: Omit<ruta, "id" | "activa">): ruta {
  if (!datos.nombre || !datos.origenDescripcion || !datos.destinoDescripcion) {
    throw new Error("nombre, origen y destino son obligatorios");
  }

  return rutaRepository.agregarRuta(datos);
}

export function actualizarRuta(id: string, datos: Partial<ruta>): void {
  obtenerRutaPorId(id);

  const actualizo = rutaRepository.actualizarRuta(id, datos);
  if (!actualizo) throw new Error("no se pudo actualizar la ruta");
}

export function eliminarRuta(id: string): void {
  obtenerRutaPorId(id);

  const elimino = rutaRepository.eliminarRuta(id);
  if (!elimino) throw new Error("no se pudo eliminar la ruta");
}
