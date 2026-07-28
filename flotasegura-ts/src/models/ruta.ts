export type nivelRiesgo = "bajo" | "medio" | "alto" | "critico";

export interface ruta {
  id: string;
  nombre: string;
  origenDescripcion: string;
  destinoDescripcion: string;
  distanciaKm: number;
  tiempoEstimadoMin: number;
  nivelRiesgo: nivelRiesgo;
  activa: boolean;
}
