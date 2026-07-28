import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/db";
import { ruta } from "../models/ruta";
import { generarId } from "../utils/archivoJson";

interface rutaRow extends RowDataPacket {
  id: string;
  nombre: string;
  origen_descripcion: string;
  destino_descripcion: string;
  distancia_km: string | number;
  tiempo_estimado_min: number;
  nivel_riesgo: ruta["nivelRiesgo"];
  activa: number;
}

function mapearRuta(fila: rutaRow): ruta {
  return {
    id: fila.id,
    nombre: fila.nombre,
    origenDescripcion: fila.origen_descripcion,
    destinoDescripcion: fila.destino_descripcion,
    distanciaKm: Number(fila.distancia_km),
    tiempoEstimadoMin: fila.tiempo_estimado_min,
    nivelRiesgo: fila.nivel_riesgo,
    activa: !!fila.activa,
  };
}

export async function leerRutas(): Promise<ruta[]> {
  const [filas] = await pool.query<rutaRow[]>("SELECT * FROM ruta ORDER BY nombre");
  return filas.map(mapearRuta);
}

export async function buscarPorId(id: string): Promise<ruta | undefined> {
  const [filas] = await pool.query<rutaRow[]>("SELECT * FROM ruta WHERE id = ?", [id]);
  return filas[0] ? mapearRuta(filas[0]) : undefined;
}

export async function agregarRuta(datos: Omit<ruta, "id" | "activa">): Promise<ruta> {
  const nueva: ruta = { id: generarId(), activa: true, ...datos };
  await pool.query(
    `INSERT INTO ruta (id, nombre, origen_descripcion, destino_descripcion, distancia_km, tiempo_estimado_min, nivel_riesgo, activa)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nueva.id,
      nueva.nombre,
      nueva.origenDescripcion,
      nueva.destinoDescripcion,
      nueva.distanciaKm,
      nueva.tiempoEstimadoMin,
      nueva.nivelRiesgo,
      nueva.activa ? 1 : 0,
    ]
  );
  return nueva;
}

export async function actualizarRuta(id: string, datos: Partial<ruta>): Promise<boolean> {
  const actual = await buscarPorId(id);
  if (!actual) return false;

  const actualizado = { ...actual, ...datos };
  const [resultado] = await pool.query<ResultSetHeader>(
    `UPDATE ruta SET nombre = ?, origen_descripcion = ?, destino_descripcion = ?, distancia_km = ?,
     tiempo_estimado_min = ?, nivel_riesgo = ?, activa = ? WHERE id = ?`,
    [
      actualizado.nombre,
      actualizado.origenDescripcion,
      actualizado.destinoDescripcion,
      actualizado.distanciaKm,
      actualizado.tiempoEstimadoMin,
      actualizado.nivelRiesgo,
      actualizado.activa ? 1 : 0,
      id,
    ]
  );
  return resultado.affectedRows > 0;
}

export async function eliminarRuta(id: string): Promise<boolean> {
  const [resultado] = await pool.query<ResultSetHeader>("DELETE FROM ruta WHERE id = ?", [id]);
  return resultado.affectedRows > 0;
}
