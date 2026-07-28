export type estadoConductorMonitoreo = "activo" | "alerta_fatiga" | "detenido" | "descanso";

export interface monitoreo {
  id: string;
  viajeId: string;
  latitud: number;
  longitud: number;
  velocidadKmh: number;
  horasConduccionContinua: number;
  estadoConductor: estadoConductorMonitoreo;
  registradoEn: string;
}
