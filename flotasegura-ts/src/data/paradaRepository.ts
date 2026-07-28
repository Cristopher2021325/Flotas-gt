import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/db";
import { puntoParada } from "../models/puntoParada";
import { generarId } from "../utils/archivoJson";

interface paradaRow extends RowDataPacket {
  id: string;
  ruta_id: string;
  nombre: string;
  tipo: puntoParada["tipo"];
  tiempo_descanso_min: number;
  orden: number;
  obligatorio: number;
}

function mapear(fila: paradaRow): puntoParada {
  return {
    id: fila.id,
    rutaId: fila.ruta_id,
    nombre: fila.nombre,
    tipo: fila.tipo,
    tiempoDescansoMin: fila.tiempo_descanso_min,
    orden: fila.orden,
    obligatorio: !!fila.obligatorio,
  };
}

export async function leerParadas(): Promise<puntoParada[]> {
  const [filas] = await pool.query<paradaRow[]>("SELECT * FROM punto_parada ORDER BY ruta_id, orden");
  return filas.map(mapear);
}

export async function buscarPorId(id: string): Promise<puntoParada | undefined> {
  const [filas] = await pool.query<paradaRow[]>("SELECT * FROM punto_parada WHERE id = ?", [id]);
  return filas[0] ? mapear(filas[0]) : undefined;
}

export async function buscarPorRuta(rutaId: string): Promise<puntoParada[]> {
  const [filas] = await pool.query<paradaRow[]>(
    "SELECT * FROM punto_parada WHERE ruta_id = ? ORDER BY orden",
    [rutaId]
  );
  return filas.map(mapear);
}

export async function agregarParada(datos: Omit<puntoParada, "id">): Promise<puntoParada> {
  const nueva: puntoParada = { id: generarId(), ...datos };
  await pool.query(
    `INSERT INTO punto_parada (id, ruta_id, nombre, tipo, tiempo_descanso_min, orden, obligatorio)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nueva.id, nueva.rutaId, nueva.nombre, nueva.tipo, nueva.tiempoDescansoMin, nueva.orden, nueva.obligatorio ? 1 : 0]
  );
  return nueva;
}

export async function actualizarParada(id: string, datos: Partial<puntoParada>): Promise<boolean> {
  const actual = await buscarPorId(id);
  if (!actual) return false;
  const a = { ...actual, ...datos };
  const [resultado] = await pool.query<ResultSetHeader>(
    `UPDATE punto_parada SET ruta_id = ?, nombre = ?, tipo = ?, tiempo_descanso_min = ?, orden = ?, obligatorio = ? WHERE id = ?`,
    [a.rutaId, a.nombre, a.tipo, a.tiempoDescansoMin, a.orden, a.obligatorio ? 1 : 0, id]
  );
  return resultado.affectedRows > 0;
}

export async function eliminarParada(id: string): Promise<boolean> {
  const [resultado] = await pool.query<ResultSetHeader>("DELETE FROM punto_parada WHERE id = ?", [id]);
  return resultado.affectedRows > 0;
}
