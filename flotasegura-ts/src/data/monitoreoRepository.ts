import { RowDataPacket } from "mysql2";
import { pool } from "../config/db";
import { monitoreo } from "../models/monitoreo";
import { generarId } from "../utils/archivoJson";

interface monitoreoRow extends RowDataPacket {
  id: string;
  viaje_id: string;
  latitud: string | number;
  longitud: string | number;
  velocidad_kmh: string | number;
  horas_conduccion_continua: string | number;
  estado_conductor: monitoreo["estadoConductor"];
  registrado_en: string;
}

function mapear(fila: monitoreoRow): monitoreo {
  return {
    id: fila.id,
    viajeId: fila.viaje_id,
    latitud: Number(fila.latitud),
    longitud: Number(fila.longitud),
    velocidadKmh: Number(fila.velocidad_kmh),
    horasConduccionContinua: Number(fila.horas_conduccion_continua),
    estadoConductor: fila.estado_conductor,
    registradoEn: fila.registrado_en,
  };
}

export async function leerMonitoreos(): Promise<monitoreo[]> {
  const [filas] = await pool.query<monitoreoRow[]>("SELECT * FROM monitoreo ORDER BY registrado_en DESC");
  return filas.map(mapear);
}

export async function buscarPorViaje(viajeId: string): Promise<monitoreo[]> {
  const [filas] = await pool.query<monitoreoRow[]>(
    "SELECT * FROM monitoreo WHERE viaje_id = ? ORDER BY registrado_en DESC",
    [viajeId]
  );
  return filas.map(mapear);
}

export async function agregarMonitoreo(datos: Omit<monitoreo, "id" | "registradoEn">): Promise<monitoreo> {
  const nuevo: monitoreo = { id: generarId(), registradoEn: new Date().toISOString(), ...datos };
  await pool.query(
    `INSERT INTO monitoreo (id, viaje_id, latitud, longitud, velocidad_kmh, horas_conduccion_continua, estado_conductor, registrado_en)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nuevo.id, nuevo.viajeId, nuevo.latitud, nuevo.longitud, nuevo.velocidadKmh, nuevo.horasConduccionContinua, nuevo.estadoConductor, nuevo.registradoEn]
  );
  return nuevo;
}
