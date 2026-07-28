import { vehiculo } from "../models/vehiculo";
import * as vehiculoRepository from "../data/vehiculoRepository";
import * as empresaService from "./empresaService";

export async function obtenerVehiculos(): Promise<vehiculo[]> {
  return vehiculoRepository.leerVehiculos();
}

export async function obtenerVehiculoPorId(id: string): Promise<vehiculo> {
  if (!id) throw new Error("debes indicar un id");

  const encontrado = await vehiculoRepository.buscarPorId(id);
  if (!encontrado) throw new Error(`no se encontro un vehiculo con el id "${id}"`);

  return encontrado;
}

export async function crearVehiculo(
  datos: Omit<vehiculo, "id" | "estado" | "pesoActualCarga">
): Promise<vehiculo> {
  if (!datos.placa || !datos.tipo || !datos.empresaId) {
    throw new Error("placa, tipo y empresa son obligatorios");
  }

  await empresaService.obtenerEmpresaPorId(datos.empresaId);

  const placaRepetida = await vehiculoRepository.buscarPorPlaca(datos.placa);
  if (placaRepetida) {
    throw new Error("ya existe un vehiculo registrado con esa placa");
  }

  return vehiculoRepository.agregarVehiculo(datos);
}

export async function actualizarVehiculo(id: string, datos: Partial<vehiculo>): Promise<void> {
  await obtenerVehiculoPorId(id);

  const actualizo = await vehiculoRepository.actualizarVehiculo(id, datos);
  if (!actualizo) throw new Error("no se pudo actualizar el vehiculo");
}

export async function eliminarVehiculo(id: string): Promise<void> {
  await obtenerVehiculoPorId(id);

  const elimino = await vehiculoRepository.eliminarVehiculo(id);
  if (!elimino) throw new Error("no se pudo eliminar el vehiculo");
}
