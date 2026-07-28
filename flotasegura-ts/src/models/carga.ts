export type estadoCarga = "pendiente" | "asignada" | "en_transito" | "entregada" | "cancelada";

export interface carga {
  id: string;
  empresaId: string;
  descripcion: string;
  pesoKg: number;
  tipoCarga: string; // general, peligrosa, refrigerada...
  requiereRefrigeracion: boolean;
  origenDireccion: string;
  destinoDireccion: string;
  estado: estadoCarga;
}
