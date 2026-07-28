import path from "path";
import { ruta } from "../models/ruta";
import { leerArchivo, guardarArchivo, generarId } from "../utils/archivoJson";

const rutaArchivo = path.join(__dirname, "rutas.json");

export function leerRutas(): ruta[] {
  return leerArchivo<ruta>(rutaArchivo);
}

export function guardarRutas(datos: ruta[]): void {
  guardarArchivo<ruta>(rutaArchivo, datos);
}

export function buscarPorId(id: string): ruta | undefined {
  return leerRutas().find((r) => r.id === id);
}

export function agregarRuta(datos: Omit<ruta, "id" | "activa">): ruta {
  const rutas = leerRutas();
  const nueva: ruta = { id: generarId(), activa: true, ...datos };
  rutas.push(nueva);
  guardarRutas(rutas);
  return nueva;
}

export function actualizarRuta(id: string, datos: Partial<ruta>): boolean {
  const rutas = leerRutas();
  const indice = rutas.findIndex((r) => r.id === id);
  if (indice === -1) return false;

  rutas[indice] = { ...rutas[indice], ...datos };
  guardarRutas(rutas);
  return true;
}

export function eliminarRuta(id: string): boolean {
  const rutas = leerRutas();
  const filtradas = rutas.filter((r) => r.id !== id);
  if (filtradas.length === rutas.length) return false;

  guardarRutas(filtradas);
  return true;
}
