import { conductor } from "../models/conductor";
import * as conductorRepository from "../data/conductorRepository";
import * as empresaService from "./empresaService";

export async function obtenerConductores(): Promise<conductor[]> {
  return conductorRepository.leerConductores();
}

export async function obtenerConductorPorId(id: string): Promise<conductor> {
  if (!id) throw new Error("debes indicar un id");

  const encontrado = await conductorRepository.buscarPorId(id);
  if (!encontrado) throw new Error(`no se encontro un conductor con el id "${id}"`);

  return encontrado;
}

export async function crearConductor(datos: Omit<conductor, "id" | "estado" | "horasManejoHoy" | "horasDescansoAcumuladas">): Promise<conductor> {
  if (!datos.nombreCompleto || !datos.licenciaNumero || !datos.empresaId) {
    throw new Error("nombre completo, numero de licencia y empresa son obligatorios");
  }

  await empresaService.obtenerEmpresaPorId(datos.empresaId); // valida que la empresa exista

  const licenciaRepetida = await conductorRepository.buscarPorLicencia(datos.licenciaNumero);
  if (licenciaRepetida) {
    throw new Error("ya existe un conductor registrado con ese numero de licencia");
  }

  return conductorRepository.agregarConductor(datos);
}

export async function actualizarConductor(id: string, datos: Partial<conductor>): Promise<void> {
  await obtenerConductorPorId(id);

  const actualizo = await conductorRepository.actualizarConductor(id, datos);
  if (!actualizo) throw new Error("no se pudo actualizar el conductor");
}

export async function eliminarConductor(id: string): Promise<void> {
  await obtenerConductorPorId(id);

  const elimino = await conductorRepository.eliminarConductor(id);
  if (!elimino) throw new Error("no se pudo eliminar el conductor");
}
