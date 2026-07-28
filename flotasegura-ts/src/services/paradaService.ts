import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { puntoParada } from "../models/puntoParada";
import * as rutaService from "./rutaService";

export async function obtenerParadas(): Promise<puntoParada[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM puntos_parada");
  return rows as puntoParada[];
}

export async function obtenerParadasDeRuta(rutaId: string): Promise<puntoParada[]> {
  await rutaService.obtenerRutaPorId(rutaId);

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM puntos_parada WHERE rutaId = ? ORDER BY orden ASC",
    [rutaId]
  );
  return rows as puntoParada[];
}

export async function obtenerParadaPorId(id: string): Promise<puntoParada> {
  if (!id) throw new Error("debes indicar un id");

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM puntos_parada WHERE id = ?",
    [id]
  );
  if (rows.length === 0) throw new Error(`no se encontro una parada con el id "${id}"`);

  return rows[0] as puntoParada;
}

export async function crearParada(datos: Omit<puntoParada, "id">): Promise<puntoParada> {
  if (!datos.nombre || !datos.rutaId) {
    throw new Error("nombre y ruta son obligatorios");
  }

  await rutaService.obtenerRutaPorId(datos.rutaId);

  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO puntos_parada (nombre, rutaId, orden) VALUES (?, ?, ?)",
    [datos.nombre, datos.rutaId, datos.orden || null]
  );

  const nuevaParada: puntoParada = {
    id: resultado.insertId.toString(),
    ...datos,
  };

  return nuevaParada;
}

export async function eliminarParada(id: string): Promise<void> {
  await obtenerParadaPorId(id);

  const [resultado] = await pool.query<ResultSetHeader>(
    "DELETE FROM puntos_parada WHERE id = ?",
    [id]
  );
  if (resultado.affectedRows === 0) throw new Error("no se pudo eliminar la parada");
}