import path from "path";
import { empresa } from "../models/empresa";
import { leerArchivo, guardarArchivo, generarId } from "../utils/archivoJson";

const rutaArchivo = path.join(__dirname, "empresas.json");

export function leerEmpresas(): empresa[] {
  return leerArchivo<empresa>(rutaArchivo);
}

export function guardarEmpresas(empresas: empresa[]): void {
  guardarArchivo<empresa>(rutaArchivo, empresas);
}

export function buscarPorId(id: string): empresa | undefined {
  return leerEmpresas().find((e) => e.id === id);
}

export function buscarPorNit(nit: string): empresa | undefined {
  return leerEmpresas().find((e) => e.nit === nit);
}

export function agregarEmpresa(datos: Omit<empresa, "id" | "estado">): empresa {
  const empresas = leerEmpresas();
  const nueva: empresa = { id: generarId(), estado: "activa", ...datos };
  empresas.push(nueva);
  guardarEmpresas(empresas);
  return nueva;
}

export function actualizarEmpresa(id: string, datos: Partial<empresa>): boolean {
  const empresas = leerEmpresas();
  const indice = empresas.findIndex((e) => e.id === id);
  if (indice === -1) return false;

  empresas[indice] = { ...empresas[indice], ...datos };
  guardarEmpresas(empresas);
  return true;
}

export function eliminarEmpresa(id: string): boolean {
  const empresas = leerEmpresas();
  const filtradas = empresas.filter((e) => e.id !== id);
  if (filtradas.length === empresas.length) return false;

  guardarEmpresas(filtradas);
  return true;
}
