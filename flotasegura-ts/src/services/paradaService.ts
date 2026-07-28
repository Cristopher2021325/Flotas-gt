import { puntoParada } from "../models/puntoParada";
import * as paradaRepository from "../data/paradaRepository";
import * as rutaService from "./rutaService";

export function obtenerParadas(): puntoParada[] {
  return paradaRepository.leerParadas();
}

export function obtenerParadasDeRuta(rutaId: string): puntoParada[] {
  rutaService.obtenerRutaPorId(rutaId); // valida que la ruta exista
  return paradaRepository.buscarPorRuta(rutaId);
}

export function obtenerParadaPorId(id: string): puntoParada {
  if (!id) throw new Error("debes indicar un id");

  const encontrada = paradaRepository.buscarPorId(id);
  if (!encontrada) throw new Error(`no se encontro una parada con el id "${id}"`);

  return encontrada;
}

export function crearParada(datos: Omit<puntoParada, "id">): puntoParada {
  if (!datos.nombre || !datos.rutaId) {
    throw new Error("nombre y ruta son obligatorios");
  }

  rutaService.obtenerRutaPorId(datos.rutaId);

  return paradaRepository.agregarParada(datos);
}

export function eliminarParada(id: string): void {
  obtenerParadaPorId(id);

  const elimino = paradaRepository.eliminarParada(id);
  if (!elimino) throw new Error("no se pudo eliminar la parada");
}
