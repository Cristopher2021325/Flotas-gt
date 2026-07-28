import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { empresa } from "../models/empresa";

export async function obtenerEmpresas(): Promise<empresa[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM empresas");
  return rows as empresa[];
}

export async function obtenerEmpresasActivas(): Promise<empresa[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM empresas WHERE estado = 'activa'"
  );
  return rows as empresa[];
}

export async function crearEmpresa(datos: Omit<empresa, "id" | "estado">): Promise<empresa> {
  if (!datos.nombre || !datos.nit || !datos.licenciaOperacion) {
    throw new Error("nombre, nit y licencia de operacion son obligatorios");
  }

  const [nitRepetido] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM empresas WHERE nit = ?",
    [datos.nit]
  );
  if (nitRepetido.length > 0) {
    throw new Error("ya existe una empresa registrada con ese nit");
  }

  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO empresas (nombre, nit, licenciaOperacion, direccion, telefono, email, estado) VALUES (?, ?, ?, ?, ?, ?, 'activa')",
    [
      datos.nombre,
      datos.nit,
      datos.licenciaOperacion,
      (datos as any).direccion || null,
      (datos as any).telefono || null,
      (datos as any).email || null,
    ]
  );

  const nuevaEmpresa: empresa = {
    id: resultado.insertId.toString(),
    estado: "activa" as empresa["estado"],
    ...datos,
  };

  return nuevaEmpresa;
}

export async function obtenerEmpresaPorId(id: string): Promise<empresa> {
  if (!id) throw new Error("debes indicar un id");

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM empresas WHERE id = ?",
    [id]
  );
  if (rows.length === 0) throw new Error(`no se encontro una empresa con el id "${id}"`);

  return rows[0] as empresa;
}

export async function actualizarDatosEmpresa(id: string, datos: Partial<empresa>): Promise<void> {
  await obtenerEmpresaPorId(id);

  const campos: string[] = [];
  const valores: any[] = [];

  Object.entries(datos).forEach(([llave, valor]) => {
    if (valor !== undefined) {
      campos.push(`${llave} = ?`);
      valores.push(valor);
    }
  });

  if (campos.length === 0) return;

  valores.push(id);
  const [resultado] = await pool.query<ResultSetHeader>(
    `UPDATE empresas SET ${campos.join(", ")} WHERE id = ?`,
    valores
  );

  if (resultado.affectedRows === 0) throw new Error("no se pudo actualizar la empresa");
}

export async function desactivarEmpresa(id: string): Promise<void> {
  await actualizarDatosEmpresa(id, { estado: "inactiva" as empresa["estado"] });
}

export async function eliminarEmpresaDefinitivo(id: string): Promise<void> {
  await obtenerEmpresaPorId(id);

  const [resultado] = await pool.query<ResultSetHeader>(
    "DELETE FROM empresas WHERE id = ?",
    [id]
  );
  if (resultado.affectedRows === 0) throw new Error("no se pudo eliminar la empresa");
}