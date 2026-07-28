import { conductor } from "../models/conductor";
import * as conductorRepository from "../data/conductorRepository";
import * as empresaService from "./empresaService";

export function obtenerConductores(): conductor[] {
  return conductorRepository.leerConductores();
}

export function obtenerConductorPorId(id: string): conductor {
  if (!id) throw new Error("debes indicar un id");

  const encontrado = conductorRepository.buscarPorId(id);
  if (!encontrado) throw new Error(`no se encontro un conductor con el id "${id}"`);

  return encontrado;
}

export function crearConductor(datos: Omit<conductor, "id" | "estado" | "horasManejoHoy" | "horasDescansoAcumuladas">): conductor {
  if (!datos.nombreCompleto || !datos.licenciaNumero || !datos.empresaId) {
    throw new Error("nombre completo, numero de licencia y empresa son obligatorios");
  }

  empresaService.obtenerEmpresaPorId(datos.empresaId); // valida que la empresa exista

  const licenciaRepetida = conductorRepository.buscarPorLicencia(datos.licenciaNumero);
  if (licenciaRepetida) {
    throw new Error("ya existe un conductor registrado con ese numero de licencia");
  }

  return conductorRepository.agregarConductor(datos);
}

export function actualizarConductor(id: string, datos: Partial<conductor>): void {
  obtenerConductorPorId(id);

  const actualizo = conductorRepository.actualizarConductor(id, datos);
  if (!actualizo) throw new Error("no se pudo actualizar el conductor");
}

export function eliminarConductor(id: string): void {
  obtenerConductorPorId(id);

  const elimino = conductorRepository.eliminarConductor(id);
  if (!elimino) throw new Error("no se pudo eliminar el conductor");
}
