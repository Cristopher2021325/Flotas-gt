import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { alertaFatiga } from "../models/alertaFatiga";
import * as viajeService from "./viajeService";
import * as conductorService from "./conductorService";

export async function obtenerAlertas(): Promise<alertaFatiga[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM alertas_fatiga");
  return rows as alertaFatiga[];
}

export async function obtenerAlertasPendientes(): Promise<alertaFatiga[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM alertas_fatiga WHERE atendida = false"
  );
  return rows as alertaFatiga[];
}

export async function generarAlerta(
  datos: Omit<alertaFatiga, "id" | "atendida" | "generadaEn">
): Promise<alertaFatiga> {
  if (!datos.viajeId || !datos.conductorId || !datos.mensaje) {
    throw new Error("viaje, conductor y mensaje son obligatorios");
  }

  await viajeService.obtenerViajePorId(datos.viajeId);
  await conductorService.obtenerConductorPorId(datos.conductorId);

  const fechaGeneracion = new Date().toISOString();

  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO alertas_fatiga (viajeId, conductorId, mensaje, nivelRiesgo, atendida, generadaEn) VALUES (?, ?, ?, ?, false, ?)",
    [
      datos.viajeId,
      datos.conductorId,
      datos.mensaje,
      (datos as any).nivelRiesgo || "medio",
      fechaGeneracion,
    ]
  );

  const nuevaAlerta: alertaFatiga = {
    id: resultado.insertId.toString(),
    atendida: false,
    generadaEn: fechaGeneracion,
    ...datos,
  };

  return nuevaAlerta;
}

export async function atenderAlerta(id: string): Promise<void> {
  if (!id) throw new Error("debes indicar un id");

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM alertas_fatiga WHERE id = ?",
    [id]
  );
  if (rows.length === 0) throw new Error(`no se encontro una alerta con el id "${id}"`);

  const [resultado] = await pool.query<ResultSetHeader>(
    "UPDATE alertas_fatiga SET atendida = true WHERE id = ?",
    [id]
  );

  if (resultado.affectedRows === 0) throw new Error("no se pudo marcar la alerta como atendida");
}