import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/db";
import { vehiculo } from "../models/vehiculo";
import { generarId } from "../utils/archivoJson";

interface vehiculoRow extends RowDataPacket {
  id: string;
  empresa_id: string;
  placa: string;
  tipo: string;
  marca: string;
  modelo: string;
  anio: number;
  tonelaje_maximo: string | number;
  peso_actual_carga: string | number;
  estado: vehiculo["estado"];
  ultimo_mantenimiento: string | null;
}

function mapearVehiculo(fila: vehiculoRow): vehiculo {
  return {
    id: fila.id,
    empresaId: fila.empresa_id,
    placa: fila.placa,
    tipo: fila.tipo,
    marca: fila.marca,
    modelo: fila.modelo,
    anio: fila.anio,
    tonelajeMaximo: Number(fila.tonelaje_maximo),
    pesoActualCarga: Number(fila.peso_actual_carga),
    estado: fila.estado,
    ultimoMantenimiento: fila.ultimo_mantenimiento,
  };
}

export async function leerVehiculos(): Promise<vehiculo[]> {
  const [filas] = await pool.query<vehiculoRow[]>("SELECT * FROM vehiculo ORDER BY placa");
  return filas.map(mapearVehiculo);
}

export async function buscarPorId(id: string): Promise<vehiculo | undefined> {
  const [filas] = await pool.query<vehiculoRow[]>("SELECT * FROM vehiculo WHERE id = ?", [id]);
  return filas[0] ? mapearVehiculo(filas[0]) : undefined;
}

export async function buscarPorPlaca(placa: string): Promise<vehiculo | undefined> {
  const [filas] = await pool.query<vehiculoRow[]>("SELECT * FROM vehiculo WHERE placa = ?", [placa]);
  return filas[0] ? mapearVehiculo(filas[0]) : undefined;
}

export async function agregarVehiculo(
  datos: Omit<vehiculo, "id" | "estado" | "pesoActualCarga">
): Promise<vehiculo> {
  const nuevo: vehiculo = { id: generarId(), estado: "disponible", pesoActualCarga: 0, ...datos };
  await pool.query(
    `INSERT INTO vehiculo (id, empresa_id, placa, tipo, marca, modelo, anio, tonelaje_maximo, peso_actual_carga, estado, ultimo_mantenimiento)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nuevo.id,
      nuevo.empresaId,
      nuevo.placa,
      nuevo.tipo,
      nuevo.marca,
      nuevo.modelo,
      nuevo.anio,
      nuevo.tonelajeMaximo,
      nuevo.pesoActualCarga,
      nuevo.estado,
      nuevo.ultimoMantenimiento,
    ]
  );
  return nuevo;
}

export async function actualizarVehiculo(id: string, datos: Partial<vehiculo>): Promise<boolean> {
  const actual = await buscarPorId(id);
  if (!actual) return false;

  const actualizado = { ...actual, ...datos };
  const [resultado] = await pool.query<ResultSetHeader>(
    `UPDATE vehiculo SET empresa_id = ?, placa = ?, tipo = ?, marca = ?, modelo = ?, anio = ?,
     tonelaje_maximo = ?, peso_actual_carga = ?, estado = ?, ultimo_mantenimiento = ? WHERE id = ?`,
    [
      actualizado.empresaId,
      actualizado.placa,
      actualizado.tipo,
      actualizado.marca,
      actualizado.modelo,
      actualizado.anio,
      actualizado.tonelajeMaximo,
      actualizado.pesoActualCarga,
      actualizado.estado,
      actualizado.ultimoMantenimiento,
      id,
    ]
  );
  return resultado.affectedRows > 0;
}

export async function eliminarVehiculo(id: string): Promise<boolean> {
  const [resultado] = await pool.query<ResultSetHeader>("DELETE FROM vehiculo WHERE id = ?", [id]);
  return resultado.affectedRows > 0;
}
