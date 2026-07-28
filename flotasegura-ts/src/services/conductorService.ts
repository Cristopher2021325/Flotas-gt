import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { conductor } from "../models/conductor";
import * as empresaService from "./empresaService";

export async function obtenerConductores(): Promise<conductor[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM conductores");
  return rows as conductor[];
}

export async function obtenerConductorPorId(id: string): Promise<conductor> {
  if (!id) throw new Error("debes indicar un id");

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM conductores WHERE id = ?",
    [id]
  );
  if (rows.length === 0) throw new Error(`no se encontro un conductor con el id "${id}"`);

  return rows[0] as conductor;
}

export async function crearConductor(
  datos: {
    nombreCompleto: string;
    licenciaNumero: string;
    empresaId: string;
    tipoLicencia?: string | null;
    telefono?: string | null;
  }
): Promise<conductor> {
  if (!datos.nombreCompleto || !datos.licenciaNumero || !datos.empresaId) {
    throw new Error("nombre completo, numero de licencia y empresa son obligatorios");
  }

  await empresaService.obtenerEmpresaPorId(datos.empresaId);

  const [licenciaRepetida] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM conductores WHERE licenciaNumero = ?",
    [datos.licenciaNumero]
  );
  if (licenciaRepetida.length > 0) {
    throw new Error("ya existe un conductor registrado con ese numero de licencia");
  }

  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO conductores (nombreCompleto, licenciaNumero, tipoLicencia, empresaId, telefono, estado, horasManejoHoy, horasDescansoAcumuladas) VALUES (?, ?, ?, ?, ?, 'disponible', 0, 0)",
    [
      datos.nombreCompleto,
      datos.licenciaNumero,
      datos.tipoLicencia || null,
      datos.empresaId,
      datos.telefono || null,
    ]
  );

  const nuevoConductor: conductor = {
    id: resultado.insertId.toString(),
    estado: "disponible" as conductor["estado"],
    horasManejoHoy: 0,
    horasDescansoAcumuladas: 0,
    nombreCompleto: datos.nombreCompleto,
    licenciaNumero: datos.licenciaNumero,
    empresaId: datos.empresaId,
    telefono: datos.telefono || "",
    licenciaTipo: (datos.tipoLicencia || "") as conductor["licenciaTipo"],
    licenciaVencimiento: "" as any,
  };

  return nuevoConductor;
}

export async function actualizarConductor(id: string, datos: Partial<conductor>): Promise<void> {
  await obtenerConductorPorId(id);

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
    `UPDATE conductores SET ${campos.join(", ")} WHERE id = ?`,
    valores
  );

  if (resultado.affectedRows === 0) throw new Error("no se pudo actualizar el conductor");
}

export async function eliminarConductor(id: string): Promise<void> {
  await obtenerConductorPorId(id);

  const [resultado] = await pool.query<ResultSetHeader>(
    "DELETE FROM conductores WHERE id = ?",
    [id]
  );
  if (resultado.affectedRows === 0) throw new Error("no se pudo eliminar el conductor");
}