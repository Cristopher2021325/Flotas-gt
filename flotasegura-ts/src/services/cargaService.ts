import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { carga } from "../models/carga";
import * as empresaService from "./empresaService";

export async function obtenerCargas(): Promise<carga[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM cargas");
  return rows as carga[];
}

export async function obtenerCargaPorId(id: string): Promise<carga> {
  if (!id) throw new Error("debes indicar un id");

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM cargas WHERE id = ?",
    [id]
  );
  if (rows.length === 0) throw new Error(`no se encontro una carga con el id "${id}"`);

  return rows[0] as carga;
}

export async function crearCarga(datos: Omit<carga, "id" | "estado">): Promise<carga> {
  if (!datos.descripcion || !datos.pesoKg || !datos.empresaId) {
    throw new Error("descripcion, peso y empresa son obligatorios");
  }

  await empresaService.obtenerEmpresaPorId(datos.empresaId);

  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO cargas (descripcion, pesoKg, tipoCarga, empresaId, estado) VALUES (?, ?, ?, ?, 'pendiente')",
    [
      datos.descripcion,
      datos.pesoKg,
      datos.tipoCarga || null,
      datos.empresaId,
    ]
  );

  const nuevaCarga: carga = {
    id: resultado.insertId.toString(),
    estado: "pendiente" as carga["estado"],
    ...datos,
  };

  return nuevaCarga;
}

export async function actualizarCarga(id: string, datos: Partial<carga>): Promise<void> {
  await obtenerCargaPorId(id);

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
    `UPDATE cargas SET ${campos.join(", ")} WHERE id = ?`,
    valores
  );

  if (resultado.affectedRows === 0) throw new Error("no se pudo actualizar la carga");
}

export async function eliminarCarga(id: string): Promise<void> {
  await obtenerCargaPorId(id);

  const [resultado] = await pool.query<ResultSetHeader>(
    "DELETE FROM cargas WHERE id = ?",
    [id]
  );
  if (resultado.affectedRows === 0) throw new Error("no se pudo eliminar la carga");
}