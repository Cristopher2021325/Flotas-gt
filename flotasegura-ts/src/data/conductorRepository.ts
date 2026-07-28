import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/db";
import { conductor } from "../models/conductor";
import { generarId } from "../utils/archivoJson";

interface conductorRow extends RowDataPacket {
  id: string;
  empresa_id: string;
  nombre_completo: string;
  licencia_tipo: string;
  licencia_numero: string;
  licencia_vencimiento: string;
  horas_manejo_hoy: string | number;
  horas_descanso_acumuladas: string | number;
  estado: conductor["estado"];
  telefono: string;
}

function mapear(fila: conductorRow): conductor {
  return {
    id: fila.id,
    empresaId: fila.empresa_id,
    nombreCompleto: fila.nombre_completo,
    licenciaTipo: fila.licencia_tipo,
    licenciaNumero: fila.licencia_numero,
    licenciaVencimiento: fila.licencia_vencimiento,
    horasManejoHoy: Number(fila.horas_manejo_hoy),
    horasDescansoAcumuladas: Number(fila.horas_descanso_acumuladas),
    estado: fila.estado,
    telefono: fila.telefono,
  };
}

export async function leerConductores(): Promise<conductor[]> {
  const [filas] = await pool.query<conductorRow[]>("SELECT * FROM conductor ORDER BY nombre_completo");
  return filas.map(mapear);
}

export async function buscarPorId(id: string): Promise<conductor | undefined> {
  const [filas] = await pool.query<conductorRow[]>("SELECT * FROM conductor WHERE id = ?", [id]);
  return filas[0] ? mapear(filas[0]) : undefined;
}

export async function buscarPorLicencia(licenciaNumero: string): Promise<conductor | undefined> {
  const [filas] = await pool.query<conductorRow[]>("SELECT * FROM conductor WHERE licencia_numero = ?", [licenciaNumero]);
  return filas[0] ? mapear(filas[0]) : undefined;
}

export async function agregarConductor(
  datos: Omit<conductor, "id" | "estado" | "horasManejoHoy" | "horasDescansoAcumuladas">
): Promise<conductor> {
  const nuevo: conductor = { id: generarId(), estado: "disponible", horasManejoHoy: 0, horasDescansoAcumuladas: 0, ...datos };
  await pool.query(
    `INSERT INTO conductor (id, empresa_id, nombre_completo, licencia_tipo, licencia_numero, licencia_vencimiento,
     horas_manejo_hoy, horas_descanso_acumuladas, estado, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nuevo.id, nuevo.empresaId, nuevo.nombreCompleto, nuevo.licenciaTipo, nuevo.licenciaNumero,
      nuevo.licenciaVencimiento, nuevo.horasManejoHoy, nuevo.horasDescansoAcumuladas, nuevo.estado, nuevo.telefono,
    ]
  );
  return nuevo;
}

export async function actualizarConductor(id: string, datos: Partial<conductor>): Promise<boolean> {
  const actual = await buscarPorId(id);
  if (!actual) return false;
  const a = { ...actual, ...datos };
  const [resultado] = await pool.query<ResultSetHeader>(
    `UPDATE conductor SET empresa_id = ?, nombre_completo = ?, licencia_tipo = ?, licencia_numero = ?,
     licencia_vencimiento = ?, horas_manejo_hoy = ?, horas_descanso_acumuladas = ?, estado = ?, telefono = ? WHERE id = ?`,
    [a.empresaId, a.nombreCompleto, a.licenciaTipo, a.licenciaNumero, a.licenciaVencimiento, a.horasManejoHoy, a.horasDescansoAcumuladas, a.estado, a.telefono, id]
  );
  return resultado.affectedRows > 0;
}

export async function eliminarConductor(id: string): Promise<boolean> {
  const [resultado] = await pool.query<ResultSetHeader>("DELETE FROM conductor WHERE id = ?", [id]);
  return resultado.affectedRows > 0;
}
