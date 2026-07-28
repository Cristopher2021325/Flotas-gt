import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/db";
import { empresa } from "../models/empresa";
import { generarId } from "../utils/archivoJson";

interface empresaRow extends RowDataPacket {
  id: string;
  nombre: string;
  nit: string;
  licencia_operacion: string;
  telefono: string;
  email: string;
  estado: "activa" | "inactiva";
}

function mapearEmpresa(fila: empresaRow): empresa {
  return {
    id: fila.id,
    nombre: fila.nombre,
    nit: fila.nit,
    licenciaOperacion: fila.licencia_operacion,
    telefono: fila.telefono,
    email: fila.email,
    estado: fila.estado,
  };
}

export async function leerEmpresas(): Promise<empresa[]> {
  const [filas] = await pool.query<empresaRow[]>("SELECT * FROM empresa ORDER BY nombre");
  return filas.map(mapearEmpresa);
}

export async function buscarPorId(id: string): Promise<empresa | undefined> {
  const [filas] = await pool.query<empresaRow[]>("SELECT * FROM empresa WHERE id = ?", [id]);
  return filas[0] ? mapearEmpresa(filas[0]) : undefined;
}

export async function buscarPorNit(nit: string): Promise<empresa | undefined> {
  const [filas] = await pool.query<empresaRow[]>("SELECT * FROM empresa WHERE nit = ?", [nit]);
  return filas[0] ? mapearEmpresa(filas[0]) : undefined;
}

export async function agregarEmpresa(datos: Omit<empresa, "id" | "estado">): Promise<empresa> {
  const nueva: empresa = { id: generarId(), estado: "activa", ...datos };
  await pool.query(
    `INSERT INTO empresa (id, nombre, nit, licencia_operacion, telefono, email, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nueva.id, nueva.nombre, nueva.nit, nueva.licenciaOperacion, nueva.telefono, nueva.email, nueva.estado]
  );
  return nueva;
}

export async function actualizarEmpresa(id: string, datos: Partial<empresa>): Promise<boolean> {
  const actual = await buscarPorId(id);
  if (!actual) return false;

  const actualizado = { ...actual, ...datos };
  const [resultado] = await pool.query<ResultSetHeader>(
    `UPDATE empresa SET nombre = ?, nit = ?, licencia_operacion = ?, telefono = ?, email = ?, estado = ?
     WHERE id = ?`,
    [
      actualizado.nombre,
      actualizado.nit,
      actualizado.licenciaOperacion,
      actualizado.telefono,
      actualizado.email,
      actualizado.estado,
      id,
    ]
  );
  return resultado.affectedRows > 0;
}

export async function eliminarEmpresa(id: string): Promise<boolean> {
  const [resultado] = await pool.query<ResultSetHeader>("DELETE FROM empresa WHERE id = ?", [id]);
  return resultado.affectedRows > 0;
}
