import { puntoParada } from "../models/puntoParada";
import * as paradaRepository from "../data/paradaRepository";
import * as rutaService from "./rutaService";

export async function obtenerParadas(): Promise<puntoParada[]> {
  return paradaRepository.leerParadas();
}

export async function obtenerParadasDeRuta(rutaId: string): Promise<puntoParada[]> {
  await rutaService.obtenerRutaPorId(rutaId);
  return paradaRepository.buscarPorRuta(rutaId);
}

export async function obtenerParadaPorId(id: string): Promise<puntoParada> {
  if (!id) throw new Error("debes indicar un id");

  const encontrada = await paradaRepository.buscarPorId(id);
  if (!encontrada) throw new Error(`no se encontro una parada con el id "${id}"`);

  return encontrada;
}

export async function crearParada(datos: Omit<puntoParada, "id">): Promise<puntoParada> {
  if (!datos.nombre || !datos.rutaId) {
    throw new Error("nombre y ruta son obligatorios");
  }

  await rutaService.obtenerRutaPorId(datos.rutaId);

  return paradaRepository.agregarParada(datos);
}

export async function eliminarParada(id: string): Promise<void> {
  await obtenerParadaPorId(id);

  const elimino = await paradaRepository.eliminarParada(id);
  if (!elimino) throw new Error("no se pudo eliminar la parada");
}
