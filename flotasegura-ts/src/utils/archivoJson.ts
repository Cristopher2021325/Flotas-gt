import fs from "fs";
import path from "path";


export function leerArchivo<T>(rutaArchivo: string): T[] {
  if (!fs.existsSync(rutaArchivo)) {
    guardarArchivo(rutaArchivo, []);
    return [];
  }

  let contenido: string;
  try {
    contenido = fs.readFileSync(rutaArchivo, "utf-8");
  } catch (error) {
    throw new Error(`no se pudo leer el archivo "${path.basename(rutaArchivo)}" (revisa permisos del archivo)`);
  }

  if (contenido.trim() === "") {
    return []; // archivo vacio, todavia no hay datos
  }

  try {
    return JSON.parse(contenido) as T[];
  } catch (error) {
    throw new Error(`el archivo "${path.basename(rutaArchivo)}" esta dañado o mal formado (json invalido)`);
  }
}

// guarda una lista de datos en un archivo json
export function guardarArchivo<T>(rutaArchivo: string, datos: T[]): void {
  try {
    fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2), "utf-8");
  } catch (error) {
    throw new Error(`no se pudo guardar el archivo "${path.basename(rutaArchivo)}" (revisa permisos del archivo)`);
  }
}

// genera un id sencillo basado en la fecha actual (suficiente para un proyecto de practica)
export function generarId(): string {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
}
