import { monitoreo } from "../models/monitoreo";
import * as monitoreoRepository from "../data/monitoreoRepository";
import * as viajeService from "./viajeService";

export async function obtenerMonitoreosDeViaje(viajeId: string): Promise<monitoreo[]> {
  await viajeService.obtenerViajePorId(viajeId);
  return monitoreoRepository.buscarPorViaje(viajeId);
}

export async function registrarMonitoreo(datos: Omit<monitoreo, "id" | "registradoEn">): Promise<monitoreo> {
  if (!datos.viajeId) throw new Error("el viaje es obligatorio");

  await viajeService.obtenerViajePorId(datos.viajeId);

  return monitoreoRepository.agregarMonitoreo(datos);
}
