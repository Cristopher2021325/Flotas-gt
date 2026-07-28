import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { vehiculo } from "../models/vehiculo";
import * as empresaService from "./empresaService";

export async function obtenerVehiculos(): Promise<vehiculo[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM vehiculos");
  return rows as vehiculo[];
}

export async function obtenerVehiculoPorId(id: string): Promise<vehiculo> {
  if (!id) throw new Error("debes indicar un id");

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM vehiculos WHERE id = ?",
    [id]
  );
  if (rows.length === 0) throw new Error(`no se encontro un vehiculo con el id "${id}"`);

  return rows[0] as vehiculo;
}

export async function crearVehiculo(
  datos: Omit<vehiculo, "id" | "estado" | "pesoActualCarga">
): Promise<vehiculo> {
  if (!datos.placa || !datos.tipo || !datos.empresaId) {
    throw new Error("placa, tipo y empresa son obligatorios");
  }

  await empresaService.obtenerEmpresaPorId(datos.empresaId);

  const [placaRepetida] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM vehiculos WHERE placa = ?",
    [datos.placa]
  );
  if (placaRepetida.length > 0) {
    throw new Error("ya existe un vehiculo registrado con esa placa");
  }

  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO vehiculos (placa, tipo, marca, modelo, capacidadPeso, empresaId, estado, pesoActualCarga) VALUES (?, ?, ?, ?, ?, ?, 'disponible', 0)",
    [datos.placa, datos.tipo, datos.marca || null, datos.modelo || null, datos.empresaId]
  );

  const nuevoVehiculo: vehiculo = {
    id: resultado.insertId.toString(),
    estado: "disponible" as vehiculo["estado"],
    pesoActualCarga: 0,
    ...datos,
  };

  return nuevoVehiculo;
}

export async function actualizarVehiculo(id: string, datos: Partial<vehiculo>): Promise<void> {
  await obtenerVehiculoPorId(id);

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
    `UPDATE vehiculos SET ${campos.join(", ")} WHERE id = ?`,
    valores
  );

  if (resultado.affectedRows === 0) throw new Error("no se pudo actualizar el vehiculo");
}

export async function eliminarVehiculo(id: string): Promise<void> {
  await obtenerVehiculoPorId(id);

  const [resultado] = await pool.query<ResultSetHeader>(
    "DELETE FROM vehiculos WHERE id = ?",
    [id]
  );
  if (resultado.affectedRows === 0) throw new Error("no se pudo eliminar el vehiculo");
}