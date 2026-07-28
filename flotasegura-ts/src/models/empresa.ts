import { estado } from "./estado";

export interface empresa {
  id: string;
  nombre: string;
  nit: string;
  licenciaOperacion: string;
  telefono: string;
  email: string;
  estado: estado;
}
