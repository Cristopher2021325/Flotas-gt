export type estadoConductor = "disponible" | "en_ruta" | "descansando" | "inactivo";

export interface conductor {
  id: string;
  empresaId: string;
  nombreCompleto: string;
  licenciaTipo: string; // A, B, C, E...
  licenciaNumero: string;
  licenciaVencimiento: string; // fecha en formato aaaa-mm-dd
  horasManejoHoy: number;
  horasDescansoAcumuladas: number;
  estado: estadoConductor;
  telefono: string;
}
