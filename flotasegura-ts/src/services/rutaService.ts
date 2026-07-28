import { ruta } from "../models/ruta";
import * as rutaRepository from "../data/rutaRepository";

export async function obtenerRutas(): Promise<ruta[]> {
  return rutaRepository.leerRutas();
}

export async function obtenerRutaPorId(id: string): Promise<ruta> {
  if (!id) throw new Error("debes indicar un id");

  const encontrada = await rutaRepository.buscarPorId(id);
  if (!encontrada) throw new Error(`no se encontro una ruta con el id "${id}"`);

  return encontrada;
}

export async function crearRuta(datos: Omit<ruta, "id" | "activa">): Promise<ruta> {
  if (!datos.nombre || !datos.origenDescripcion || !datos.destinoDescripcion) {
    throw new Error("nombre, origen y destino son obligatorios");
  }

  return rutaRepository.agregarRuta(datos);
}

export async function actualizarRuta(id: string, datos: Partial<ruta>): Promise<void> {
  await obtenerRutaPorId(id);

  const actualizo = await rutaRepository.actualizarRuta(id, datos);
  if (!actualizo) throw new Error("no se pudo actualizar la ruta");
}

export async function eliminarRuta(id: string): Promise<void> {
  await obtenerRutaPorId(id);

  const elimino = await rutaRepository.eliminarRuta(id);
  if (!elimino) throw new Error("no se pudo eliminar la ruta");
}
