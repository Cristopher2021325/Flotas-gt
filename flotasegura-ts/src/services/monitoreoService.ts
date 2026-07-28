import { monitoreo } from "../models/monitoreo";
import * as monitoreoRepository from "../data/monitoreoRepository";
import * as viajeService from "./viajeService";

export function obtenerMonitoreosDeViaje(viajeId: string): monitoreo[] {
  viajeService.obtenerViajePorId(viajeId); 
  return monitoreoRepository.buscarPorViaje(viajeId);
}

export function registrarMonitoreo(datos: Omit<monitoreo, "id" | "registradoEn">): monitoreo {
  if (!datos.viajeId) throw new Error("el viaje es obligatorio");

  viajeService.obtenerViajePorId(datos.viajeId);

  return monitoreoRepository.agregarMonitoreo(datos);
}
