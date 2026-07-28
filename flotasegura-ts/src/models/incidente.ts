export type tipoIncidente = "accidente" | "falla_mecanica" | "robo" | "clima" | "cierre_vial" | "otro";
export type severidadIncidente = "leve" | "moderado" | "grave" | "fatal";

export interface incidente {
  id: string;
  viajeId: string;
  conductorId: string;
  vehiculoId: string;
  tipo: tipoIncidente;
  descripcion: string;
  severidad: severidadIncidente;
  reportadoAutoridades: boolean;
  ocurridoEn: string;
}
