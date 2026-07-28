import path from "path";
import { vehiculo } from "../models/vehiculo";
import { leerArchivo, guardarArchivo, generarId } from "../utils/archivoJson";

const rutaArchivo = path.join(__dirname, "vehiculos.json");

export function leerVehiculos(): vehiculo[] {
  return leerArchivo<vehiculo>(rutaArchivo);
}

export function guardarVehiculos(datos: vehiculo[]): void {
  guardarArchivo<vehiculo>(rutaArchivo, datos);
}

export function buscarPorId(id: string): vehiculo | undefined {
  return leerVehiculos().find((v) => v.id === id);
}

export function buscarPorPlaca(placa: string): vehiculo | undefined {
  return leerVehiculos().find((v) => v.placa === placa);
}

export function agregarVehiculo(datos: Omit<vehiculo, "id" | "estado" | "pesoActualCarga">): vehiculo {
  const vehiculos = leerVehiculos();
  const nuevo: vehiculo = { id: generarId(), estado: "disponible", pesoActualCarga: 0, ...datos };
  vehiculos.push(nuevo);
  guardarVehiculos(vehiculos);
  return nuevo;
}

export function actualizarVehiculo(id: string, datos: Partial<vehiculo>): boolean {
  const vehiculos = leerVehiculos();
  const indice = vehiculos.findIndex((v) => v.id === id);
  if (indice === -1) return false;

  vehiculos[indice] = { ...vehiculos[indice], ...datos };
  guardarVehiculos(vehiculos);
  return true;
}

export function eliminarVehiculo(id: string): boolean {
  const vehiculos = leerVehiculos();
  const filtrados = vehiculos.filter((v) => v.id !== id);
  if (filtrados.length === vehiculos.length) return false;

  guardarVehiculos(filtrados);
  return true;
}
