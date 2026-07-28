export type tipoParada = "descanso" | "gasolinera" | "puerto_carga" | "revision" | "emergencia" | "comida";

export interface puntoParada {
  id: string;
  rutaId: string;
  nombre: string;
  tipo: tipoParada;
  tiempoDescansoMin: number;
  orden: number;
  obligatorio: boolean;
}
