import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/db";
import { alertaFatiga } from "../models/alertaFatiga";
import { generarId } from "../utils/archivoJson";

interface alertaRow extends RowDataPacket {
  id: string;
  viaje_id: string;
  conductor_id: string;
  tipo_alerta: alertaFatiga["tipoAlerta"];
  mensaje: string;
  horas_sin_descanso: string | number;
  atendida: number;
  generada_en: string;
}

function mapear(fila: alertaRow): alertaFatiga {
  return {
    id: fila.id,
    viajeId: fila.viaje_id,
    conductorId: fila.conductor_id,
    tipoAlerta: fila.tipo_alerta,
    mensaje: fila.mensaje,
    horasSinDescanso: Number(fila.horas_sin_descanso),
    atendida: !!fila.atendida,
    generadaEn: fila.generada_en,
  };
}

export async function leerAlertas(): Promise<alertaFatiga[]> {
  const [filas] = await pool.query<alertaRow[]>("SELECT * FROM alerta_fatiga ORDER BY generada_en DESC");
  return filas.map(mapear);
}

export async function buscarPorId(id: string): Promise<alertaFatiga | undefined> {
  const [filas] = await pool.query<alertaRow[]>("SELECT * FROM alerta_fatiga WHERE id = ?", [id]);
  return filas[0] ? mapear(filas[0]) : undefined;
}

export async function buscarPendientes(): Promise<alertaFatiga[]> {
  const [filas] = await pool.query<alertaRow[]>("SELECT * FROM alerta_fatiga WHERE atendida = 0 ORDER BY generada_en DESC");
  return filas.map(mapear);
}

export async function agregarAlerta(datos: Omit<alertaFatiga, "id" | "atendida" | "generadaEn">): Promise<alertaFatiga> {
  const nueva: alertaFatiga = { id: generarId(), atendida: false, generadaEn: new Date().toISOString(), ...datos };
  await pool.query(
    `INSERT INTO alerta_fatiga (id, viaje_id, conductor_id, tipo_alerta, mensaje, horas_sin_descanso, atendida, generada_en)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nueva.id, nueva.viajeId, nueva.conductorId, nueva.tipoAlerta, nueva.mensaje, nueva.horasSinDescanso, nueva.atendida ? 1 : 0, nueva.generadaEn]
  );
  return nueva;
}

export async function marcarAtendida(id: string): Promise<boolean> {
  const [resultado] = await pool.query<ResultSetHeader>("UPDATE alerta_fatiga SET atendida = 1 WHERE id = ?", [id]);
  return resultado.affectedRows > 0;
}
