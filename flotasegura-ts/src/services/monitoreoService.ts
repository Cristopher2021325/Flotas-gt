import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { monitoreo } from "../models/monitoreo";
import * as viajeService from "./viajeService";

export async function obtenerMonitoreosDeViaje(viajeId: string): Promise<monitoreo[]> {
  await viajeService.obtenerViajePorId(viajeId);

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM monitoreos WHERE viajeId = ? ORDER BY registradoEn DESC",
    [viajeId]
  );
  return rows as monitoreo[];
}

export async function registrarMonitoreo(datos: Omit<monitoreo, "id" | "registradoEn">): Promise<monitoreo> {
  if (!datos.viajeId) throw new Error("el viaje es obligatorio");

  await viajeService.obtenerViajePorId(datos.viajeId);

  const fechaRegistro = new Date().toISOString();

  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO monitoreos (viajeId, latitud, longitud, velocidad, registradoEn, comentario) VALUES (?, ?, ?, ?, ?, ?)",
    [
      datos.viajeId,
      datos.latitud || null,
      datos.longitud || null,
      datos.velocidadKmh || null,
      fechaRegistro,
      ((datos as any).comentario ?? null),
    ]
  );

  const nuevoMonitoreo: monitoreo = {
    id: resultado.insertId.toString(),
    registradoEn: fechaRegistro,
    ...datos,
  };

  return nuevoMonitoreo;
}