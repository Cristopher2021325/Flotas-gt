export type tipoAlerta = "pre_fatiga" | "fatiga" | "descanso_obligatorio" | "velocidad_excesiva" | "ruta_peligrosa";

export interface alertaFatiga {
  id: string;
  viajeId: string;
  conductorId: string;
  tipoAlerta: tipoAlerta;
  mensaje: string;
  horasSinDescanso: number;
  atendida: boolean;
  generadaEn: string;
}
