import { RowDataPacket } from "mysql2";
import { pool } from "../config/db";
import { incidente } from "../models/incidente";
import { generarId } from "../utils/archivoJson";

interface incidenteRow extends RowDataPacket {
  id: string;
  viaje_id: string;
  conductor_id: string;
  vehiculo_id: string;
  tipo: incidente["tipo"];
  descripcion: string;
  severidad: incidente["severidad"];
  reportado_autoridades: number;
  ocurrido_en: string;
}

function mapear(fila: incidenteRow): incidente {
  return {
    id: fila.id,
    viajeId: fila.viaje_id,
    conductorId: fila.conductor_id,
    vehiculoId: fila.vehiculo_id,
    tipo: fila.tipo,
    descripcion: fila.descripcion,
    severidad: fila.severidad,
    reportadoAutoridades: !!fila.reportado_autoridades,
    ocurridoEn: fila.ocurrido_en,
  };
}

export async function leerIncidentes(): Promise<incidente[]> {
  const [filas] = await pool.query<incidenteRow[]>("SELECT * FROM incidente ORDER BY ocurrido_en DESC");
  return filas.map(mapear);
}

export async function buscarPorId(id: string): Promise<incidente | undefined> {
  const [filas] = await pool.query<incidenteRow[]>("SELECT * FROM incidente WHERE id = ?", [id]);
  return filas[0] ? mapear(filas[0]) : undefined;
}

export async function agregarIncidente(datos: Omit<incidente, "id" | "ocurridoEn">): Promise<incidente> {
  const nuevo: incidente = { id: generarId(), ocurridoEn: new Date().toISOString(), ...datos };
  await pool.query(
    `INSERT INTO incidente (id, viaje_id, conductor_id, vehiculo_id, tipo, descripcion, severidad, reportado_autoridades, ocurrido_en)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nuevo.id, nuevo.viajeId, nuevo.conductorId, nuevo.vehiculoId, nuevo.tipo, nuevo.descripcion, nuevo.severidad, nuevo.reportadoAutoridades ? 1 : 0, nuevo.ocurridoEn]
  );
  return nuevo;
}
