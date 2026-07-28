import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { viaje } from "../models/viaje";
import * as conductorService from "./conductorService";
import * as vehiculoService from "./vehiculoService";
import * as rutaService from "./rutaService";
import * as cargaService from "./cargaService";

export async function obtenerViajes(): Promise<viaje[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM viajes");
  return rows as viaje[];
}

export async function obtenerViajePorId(id: string): Promise<viaje> {
  if (!id) throw new Error("debes indicar un id");

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM viajes WHERE id = ?",
    [id]
  );
  if (rows.length === 0) throw new Error(`no se encontro un viaje con el id "${id}"`);

  return rows[0] as viaje;
}

export async function crearViaje(
  datos: Omit<viaje, "id" | "estado" | "inicioReal" | "finReal" | "notasClaude">
): Promise<viaje> {
  if (!datos.conductorId || !datos.vehiculoId || !datos.rutaId || !datos.inicioProgramado) {
    throw new Error("conductor, vehiculo, ruta y fecha de inicio programado son obligatorios");
  }

  await conductorService.obtenerConductorPorId(datos.conductorId);
  await vehiculoService.obtenerVehiculoPorId(datos.vehiculoId);
  await rutaService.obtenerRutaPorId(datos.rutaId);
  if (datos.cargaId) {
    await cargaService.obtenerCargaPorId(datos.cargaId);
  }

  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO viajes (conductorId, vehiculoId, rutaId, inicioProgramado, cargaId, estado) VALUES (?, ?, ?, ?, ?, 'pendiente')",
    [datos.conductorId, datos.vehiculoId, datos.rutaId, datos.inicioProgramado, datos.cargaId || null]
  );

  const nuevoViaje: viaje = {
    id: resultado.insertId.toString(),
    estado: "pendiente" as viaje["estado"],
    inicioReal: null,
    finReal: null,
    notasClaude: "",
    ...datos,
  };

  return nuevoViaje;
}

export async function cambiarEstadoViaje(id: string, nuevoEstado: viaje["estado"]): Promise<void> {
  await obtenerViajePorId(id);

  let inicioReal: string | null = null;
  let finReal: string | null = null;

  if (nuevoEstado === "en_curso") inicioReal = new Date().toISOString();
  if (nuevoEstado === "completado" || nuevoEstado === "cancelado") finReal = new Date().toISOString();

  await pool.query(
    "UPDATE viajes SET estado = ?, inicioReal = COALESCE(?, inicioReal), finReal = COALESCE(?, finReal) WHERE id = ?",
    [nuevoEstado, inicioReal, finReal, id]
  );
}

export async function eliminarViaje(id: string): Promise<void> {
  await obtenerViajePorId(id);

  const [resultado] = await pool.query<ResultSetHeader>("DELETE FROM viajes WHERE id = ?", [id]);
  if (resultado.affectedRows === 0) throw new Error("no se pudo eliminar el viaje");
}