export type estadoViaje = "programado" | "en_curso" | "pausado" | "completado" | "cancelado" | "accidente";

export interface viaje {
  id: string;
  conductorId: string;
  vehiculoId: string;
  rutaId: string;
  cargaId: string | null;
  estado: estadoViaje;
  inicioProgramado: string;
  inicioReal: string | null;
  finReal: string | null;
  notasClaude: string;
}
