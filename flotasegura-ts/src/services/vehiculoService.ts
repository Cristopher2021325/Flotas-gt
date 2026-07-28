import { vehiculo } from "../models/vehiculo";
import * as vehiculoRepository from "../data/vehiculoRepository";
import * as empresaService from "./empresaService";

export function obtenerVehiculos(): vehiculo[] {
  return vehiculoRepository.leerVehiculos();
}

export function obtenerVehiculoPorId(id: string): vehiculo {
  if (!id) throw new Error("debes indicar un id");

  const encontrado = vehiculoRepository.buscarPorId(id);
  if (!encontrado) throw new Error(`no se encontro un vehiculo con el id "${id}"`);

  return encontrado;
}

export function crearVehiculo(datos: Omit<vehiculo, "id" | "estado" | "pesoActualCarga">): vehiculo {
  if (!datos.placa || !datos.tipo || !datos.empresaId) {
    throw new Error("placa, tipo y empresa son obligatorios");
  }

  empresaService.obtenerEmpresaPorId(datos.empresaId); 

  const placaRepetida = vehiculoRepository.buscarPorPlaca(datos.placa);
  if (placaRepetida) {
    throw new Error("ya existe un vehiculo registrado con esa placa");
  }

  return vehiculoRepository.agregarVehiculo(datos);
}

export function actualizarVehiculo(id: string, datos: Partial<vehiculo>): void {
  obtenerVehiculoPorId(id);

  const actualizo = vehiculoRepository.actualizarVehiculo(id, datos);
  if (!actualizo) throw new Error("no se pudo actualizar el vehiculo");
}

export function eliminarVehiculo(id: string): void {
  obtenerVehiculoPorId(id);

  const elimino = vehiculoRepository.eliminarVehiculo(id);
  if (!elimino) throw new Error("no se pudo eliminar el vehiculo");
}
