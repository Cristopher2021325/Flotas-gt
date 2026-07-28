export type estadoVehiculo = "disponible" | "en_ruta" | "mantenimiento" | "inactivo";

export interface vehiculo {
  id: string;
  empresaId: string;
  placa: string;
  tipo: string; // trailer, furgon, cisterna...
  marca: string;
  modelo: string;
  anio: number;
  tonelajeMaximo: number;
  pesoActualCarga: number;
  estado: estadoVehiculo;
  ultimoMantenimiento: string | null;
}
