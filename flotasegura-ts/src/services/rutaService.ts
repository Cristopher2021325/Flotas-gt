import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { ruta } from "../models/ruta";

type CrearRutaDTO = Omit<ruta, "id" | "activa"> & { estimacionHoras?: number | null };

export async function obtenerRutas(): Promise<ruta[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM rutas");
  return rows as ruta[];
}

export async function obtenerRutaPorId(id: string): Promise<ruta> {
  if (!id) throw new Error("debes indicar un id");

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM rutas WHERE id = ?",
    [id]
  );
  if (rows.length === 0) throw new Error(`no se encontro una ruta con el id "${id}"`);

  return rows[0] as ruta;
}

  export async function crearRuta(datos: CrearRutaDTO): Promise<ruta> {
  if (!datos.nombre || !datos.origenDescripcion || !datos.destinoDescripcion) {
    throw new Error("nombre, origen y destino son obligatorios");
  }

  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO rutas (nombre, origenDescripcion, destinoDescripcion, distanciaKm, estimacionHoras, activa) VALUES (?, ?, ?, ?, ?, true)",
    [
      datos.nombre,
      datos.origenDescripcion,
      datos.destinoDescripcion,
      datos.distanciaKm || null,
      datos.estimacionHoras || null,
    ]
  );

  const nuevaRuta: ruta = {
    id: resultado.insertId.toString(),
    activa: true,
    ...datos,
  };

  return nuevaRuta;
}

export async function actualizarRuta(id: string, datos: Partial<ruta>): Promise<void> {
  await obtenerRutaPorId(id);

  const campos: string[] = [];
  const valores: any[] = [];

  Object.entries(datos).forEach(([llave, valor]) => {
    if (valor !== undefined) {
      campos.push(`${llave} = ?`);
      valores.push(valor);
    }
  });

  if (campos.length === 0) return;

  valores.push(id);
  const [resultado] = await pool.query<ResultSetHeader>(
    `UPDATE rutas SET ${campos.join(", ")} WHERE id = ?`,
    valores
  );

  if (resultado.affectedRows === 0) throw new Error("no se pudo actualizar la ruta");
}

export async function eliminarRuta(id: string): Promise<void> {
  await obtenerRutaPorId(id);

  const [resultado] = await pool.query<ResultSetHeader>(
    "DELETE FROM rutas WHERE id = ?",
    [id]
  );
  if (resultado.affectedRows === 0) throw new Error("no se pudo eliminar la ruta");
}