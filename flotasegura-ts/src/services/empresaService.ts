import { empresa } from "../models/empresa";
import * as empresaRepository from "../data/empresaRepository";


export async function obtenerEmpresas(): Promise<empresa[]> {
  return empresaRepository.leerEmpresas();
}


export async function obtenerEmpresasActivas(): Promise<empresa[]> {
  const empresas = await empresaRepository.leerEmpresas();
  return empresas.filter((e) => e.estado === "activa");
}

export async function crearEmpresa(datos: Omit<empresa, "id" | "estado">): Promise<empresa> {
  if (!datos.nombre || !datos.nit || !datos.licenciaOperacion) {
    throw new Error("nombre, nit y licencia de operacion son obligatorios");
  }

  const nitRepetido = await empresaRepository.buscarPorNit(datos.nit);
  if (nitRepetido) {
    throw new Error("ya existe una empresa registrada con ese nit");
  }

  return empresaRepository.agregarEmpresa(datos);
}


export async function obtenerEmpresaPorId(id: string): Promise<empresa> {
  if (!id) throw new Error("debes indicar un id");

  const encontrada = await empresaRepository.buscarPorId(id);
  if (!encontrada) throw new Error(`no se encontro una empresa con el id "${id}"`);

  return encontrada;
}


export async function actualizarDatosEmpresa(id: string, datos: Partial<empresa>): Promise<void> {
  await obtenerEmpresaPorId(id); // valida que exista, si no existe lanza error

  const actualizo = await empresaRepository.actualizarEmpresa(id, datos);
  if (!actualizo) throw new Error("no se pudo actualizar la empresa");
}


export async function desactivarEmpresa(id: string): Promise<void> {
  await actualizarDatosEmpresa(id, { estado: "inactiva" });
}

export async function eliminarEmpresaDefinitivo(id: string): Promise<void> {
  await obtenerEmpresaPorId(id); // valida que exista

  const elimino = await empresaRepository.eliminarEmpresa(id);
  if (!elimino) throw new Error("no se pudo eliminar la empresa");
}
