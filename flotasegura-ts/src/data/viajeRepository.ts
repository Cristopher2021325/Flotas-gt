import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/db";
import { viaje } from "../models/viaje";
import { generarId } from "../utils/archivoJson";

interface viajeRow extends RowDataPacket {
  id: string;
  conductor_id: string;
  vehiculo_id: string;
  ruta_id: string;
  carga_id: string | null;
  estado: viaje["estado"];
  inicio_programado: string;
  inicio_real: string | null;
  fin_real: string | null;
  notas_claude: string | null;
}

function mapear(fila: viajeRow): viaje {
  return {
    id: fila.id,
    conductorId: fila.conductor_id,
    vehiculoId: fila.vehiculo_id,
    rutaId: fila.ruta_id,
    cargaId: fila.carga_id,
    estado: fila.estado,
    inicioProgramado: fila.inicio_programado,
    inicioReal: fila.inicio_real,
    finReal: fila.fin_real,
    notasClaude: fila.notas_claude ?? "",
  };
}

export async function leerViajes(): Promise<viaje[]> {
  const [filas] = await pool.query<viajeRow[]>("SELECT * FROM viaje ORDER BY inicio_programado DESC");
  return filas.map(mapear);
}

export async function buscarPorId(id: string): Promise<viaje | undefined> {
  const [filas] = await pool.query<viajeRow[]>("SELECT * FROM viaje WHERE id = ?", [id]);
  return filas[0] ? mapear(filas[0]) : undefined;
}

export async function agregarViaje(
  datos: Omit<viaje, "id" | "estado" | "inicioReal" | "finReal" | "notasClaude">
): Promise<viaje> {
  const nuevo: viaje = { id: generarId(), estado: "programado", inicioReal: null, finReal: null, notasClaude: "", ...datos };
  await pool.query(
    `INSERT INTO viaje (id, conductor_id, vehiculo_id, ruta_id, carga_id, estado, inicio_programado, inicio_real, fin_real, notas_claude)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nuevo.id, nuevo.conductorId, nuevo.vehiculoId, nuevo.rutaId, nuevo.cargaId, nuevo.estado, nuevo.inicioProgramado, nuevo.inicioReal, nuevo.finReal, nuevo.notasClaude]
  );
  return nuevo;
}

export async function actualizarViaje(id: string, datos: Partial<viaje>): Promise<boolean> {
  const actual = await buscarPorId(id);
  if (!actual) return false;
  const a = { ...actual, ...datos };
  const [resultado] = await pool.query<ResultSetHeader>(
    `UPDATE viaje SET conductor_id = ?, vehiculo_id = ?, ruta_id = ?, carga_id = ?, estado = ?,
     inicio_programado = ?, inicio_real = ?, fin_real = ?, notas_claude = ? WHERE id = ?`,
    [a.conductorId, a.vehiculoId, a.rutaId, a.cargaId, a.estado, a.inicioProgramado, a.inicioReal, a.finReal, a.notasClaude, id]
  );
  return resultado.affectedRows > 0;
}

export async function eliminarViaje(id: string): Promise<boolean> {
  const [resultado] = await pool.query<ResultSetHeader>("DELETE FROM viaje WHERE id = ?", [id]);
  return resultado.affectedRows > 0;
}
