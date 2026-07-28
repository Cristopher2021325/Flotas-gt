import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/db";
import { carga } from "../models/carga";
import { generarId } from "../utils/archivoJson";

interface cargaRow extends RowDataPacket {
  id: string;
  empresa_id: string;
  descripcion: string;
  peso_kg: string | number;
  tipo_carga: string;
  requiere_refrigeracion: number;
  origen_direccion: string;
  destino_direccion: string;
  estado: carga["estado"];
}

function mapear(fila: cargaRow): carga {
  return {
    id: fila.id,
    empresaId: fila.empresa_id,
    descripcion: fila.descripcion,
    pesoKg: Number(fila.peso_kg),
    tipoCarga: fila.tipo_carga,
    requiereRefrigeracion: !!fila.requiere_refrigeracion,
    origenDireccion: fila.origen_direccion,
    destinoDireccion: fila.destino_direccion,
    estado: fila.estado,
  };
}

export async function leerCargas(): Promise<carga[]> {
  const [filas] = await pool.query<cargaRow[]>("SELECT * FROM carga ORDER BY id");
  return filas.map(mapear);
}

export async function buscarPorId(id: string): Promise<carga | undefined> {
  const [filas] = await pool.query<cargaRow[]>("SELECT * FROM carga WHERE id = ?", [id]);
  return filas[0] ? mapear(filas[0]) : undefined;
}

export async function agregarCarga(datos: Omit<carga, "id" | "estado">): Promise<carga> {
  const nueva: carga = { id: generarId(), estado: "pendiente", ...datos };
  await pool.query(
    `INSERT INTO carga (id, empresa_id, descripcion, peso_kg, tipo_carga, requiere_refrigeracion, origen_direccion, destino_direccion, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nueva.id, nueva.empresaId, nueva.descripcion, nueva.pesoKg, nueva.tipoCarga, nueva.requiereRefrigeracion ? 1 : 0, nueva.origenDireccion, nueva.destinoDireccion, nueva.estado]
  );
  return nueva;
}

export async function actualizarCarga(id: string, datos: Partial<carga>): Promise<boolean> {
  const actual = await buscarPorId(id);
  if (!actual) return false;
  const a = { ...actual, ...datos };
  const [resultado] = await pool.query<ResultSetHeader>(
    `UPDATE carga SET empresa_id = ?, descripcion = ?, peso_kg = ?, tipo_carga = ?, requiere_refrigeracion = ?,
     origen_direccion = ?, destino_direccion = ?, estado = ? WHERE id = ?`,
    [a.empresaId, a.descripcion, a.pesoKg, a.tipoCarga, a.requiereRefrigeracion ? 1 : 0, a.origenDireccion, a.destinoDireccion, a.estado, id]
  );
  return resultado.affectedRows > 0;
}

export async function eliminarCarga(id: string): Promise<boolean> {
  const [resultado] = await pool.query<ResultSetHeader>("DELETE FROM carga WHERE id = ?", [id]);
  return resultado.affectedRows > 0;
}
