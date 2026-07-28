import { empresa } from "../models/empresa";
import * as empresaRepository from "../data/empresaRepository";


export function obtenerEmpresas(): empresa[] {
  return empresaRepository.leerEmpresas();
}


export function obtenerEmpresasActivas(): empresa[] {
  return empresaRepository.leerEmpresas().filter((e) => e.estado === "activa");
}

export function crearEmpresa(datos: Omit<empresa, "id" | "estado">): empresa {
  if (!datos.nombre || !datos.nit || !datos.licenciaOperacion) {
    throw new Error("nombre, nit y licencia de operacion son obligatorios");
  }

  const nitRepetido = empresaRepository.buscarPorNit(datos.nit);
  if (nitRepetido) {
    throw new Error("ya existe una empresa registrada con ese nit");
  }

  return empresaRepository.agregarEmpresa(datos);
}


export function obtenerEmpresaPorId(id: string): empresa {
  if (!id) throw new Error("debes indicar un id");

  const encontrada = empresaRepository.buscarPorId(id);
  if (!encontrada) throw new Error(`no se encontro una empresa con el id "${id}"`);

  return encontrada;
}


export function actualizarDatosEmpresa(id: string, datos: Partial<empresa>): void {
  obtenerEmpresaPorId(id); // valida que exista, si no existe lanza error

  const actualizo = empresaRepository.actualizarEmpresa(id, datos);
  if (!actualizo) throw new Error("no se pudo actualizar la empresa");
}


export function desactivarEmpresa(id: string): void {
  actualizarDatosEmpresa(id, { estado: "inactiva" });
}

export function eliminarEmpresaDefinitivo(id: string): void {
  obtenerEmpresaPorId(id); // valida que exista

  const elimino = empresaRepository.eliminarEmpresa(id);
  if (!elimino) throw new Error("no se pudo eliminar la empresa");
}
