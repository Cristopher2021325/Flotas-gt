import { preguntar } from "../utils/readline";
import * as rutaService from "../services/rutaService";
import * as paradaService from "../services/paradaService";
import { ruta } from "../models/ruta";
import { puntoParada } from "../models/puntoParada";

function mostrarOpciones(): void {
  console.log("\n----- rutas -----");
  console.log("1. listar rutas");
  console.log("2. buscar ruta por id");
  console.log("3. registrar nueva ruta");
  console.log("4. ver paradas de una ruta");
  console.log("5. agregar parada a una ruta");
  console.log("6. eliminar ruta");
  console.log("0. volver al menu principal");
}

function mostrarRuta(r: ruta): void {
  console.log(`id: ${r.id} | ${r.nombre} | riesgo: ${r.nivelRiesgo} | activa: ${r.activa ? "si" : "no"}`);
  console.log(`   ${r.origenDescripcion} -> ${r.destinoDescripcion} | ${r.distanciaKm} km | ${r.tiempoEstimadoMin} min`);
}

export async function menuRutas(): Promise<void> {
  let continuar = true;

  while (continuar) {
    mostrarOpciones();
    const opcion = await preguntar("elige una opcion: ");

    try {
      switch (opcion) {
        case "1": {
          const rutas = await rutaService.obtenerRutas();
          console.log(`\nse encontraron ${rutas.length} ruta(s):`);
          rutas.forEach(mostrarRuta);
          break;
        }

        case "2": {
          const id = await preguntar("id de la ruta: ");
          const encontrada = await rutaService.obtenerRutaPorId(id);
          console.log("\nruta encontrada:");
          mostrarRuta(encontrada);
          break;
        }

        case "3": {
          const nombre = await preguntar("nombre de la ruta: ");
          const origenDescripcion = await preguntar("descripcion del origen: ");
          const destinoDescripcion = await preguntar("descripcion del destino: ");
          const distanciaKm = Number(await preguntar("distancia en km: "));
          const tiempoEstimadoMin = Number(await preguntar("tiempo estimado en minutos: "));
          const nivelRiesgo = await preguntar("nivel de riesgo (bajo, medio, alto, critico): ");

          const nueva = await rutaService.crearRuta({
            nombre, origenDescripcion, destinoDescripcion, distanciaKm, tiempoEstimadoMin,
            nivelRiesgo: nivelRiesgo as ruta["nivelRiesgo"],
          });
          console.log("\nruta registrada con exito:");
          mostrarRuta(nueva);
          break;
        }

        case "4": {
          const rutaId = await preguntar("id de la ruta: ");
          const paradas = await paradaService.obtenerParadasDeRuta(rutaId);
          console.log(`\nla ruta tiene ${paradas.length} parada(s):`);
          paradas.forEach((p) => {
            console.log(`orden ${p.orden} | ${p.nombre} (${p.tipo}) | obligatoria: ${p.obligatorio ? "si" : "no"}`);
          });
          break;
        }

        case "5": {
          const rutaId = await preguntar("id de la ruta: ");
          const nombre = await preguntar("nombre de la parada: ");
          const tipo = await preguntar("tipo (descanso, gasolinera, puerto_carga, revision, emergencia, comida): ");
          const tiempoDescansoMin = Number(await preguntar("tiempo de descanso en minutos: "));
          const orden = Number(await preguntar("orden dentro de la ruta: "));
          const obligatorioTexto = await preguntar("es obligatoria? (si/no): ");

          await paradaService.crearParada({
            rutaId, nombre, tipo: tipo as puntoParada["tipo"], tiempoDescansoMin, orden,
            obligatorio: obligatorioTexto.toLowerCase() === "si",
          });
          console.log("\nparada agregada correctamente.");
          break;
        }

        case "6": {
          const id = await preguntar("id de la ruta a eliminar: ");
          await rutaService.eliminarRuta(id);
          console.log("\nruta eliminada correctamente.");
          break;
        }

        case "0": {
          continuar = false;
          break;
        }

        default: {
          console.log("\nopcion invalida, intenta de nuevo.");
        }
      }
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "ocurrio un error inesperado";
      console.log(`\nerror: ${mensaje}`);
    }
  }
}
