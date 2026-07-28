import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
  queueLimit: 0,
});

export async function testConexion() {
  try {
    const connection = await pool.getConnection();
    console.log("Conexion exitosa a la base de datos MySQL");
    connection.release();
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
}

export default pool;