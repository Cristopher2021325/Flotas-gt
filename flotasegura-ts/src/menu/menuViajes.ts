import { preguntar } from "../utils/readline";
import * as viajeService from "../services/viajeService";
import { viaje } from "../models/viaje";

function mostrarOpciones(): void {
  console.log("\n----- viajes -----");
  console.log("1. listar viajes");
  console.log("2. buscar viaje por id");
  console.log("3. programar nuevo viaje");
  console.log("4. cambiar estado del viaje");
  console.log("5. eliminar viaje");
  console.log("0. volver al menu principal");
}

function mostrarViaje(v: viaje): void {
  console.log(`id: ${v.id} | estado: ${v.estado} | inicio programado: ${v.inicioProgramado}`);
  console.log(`   conductor: ${v.conductorId} | vehiculo: ${v.vehiculoId} | ruta: ${v.rutaId} | carga: ${v.cargaId ?? "sin carga"}`);
}

export async function menuViajes(): Promise<void> {
  let continuar = true;

  while (continuar) {
    mostrarOpciones();
    const opcion = await preguntar("elige una opcion: ");

    try {
      switch (opcion) {
        case "1": {
          const viajes = await viajeService.obtenerViajes();
          console.log(`\nse encontraron ${viajes.length} viaje(s):`);
          viajes.forEach(mostrarViaje);
          break;
        }

        case "2": {
          const id = await preguntar("id del viaje: ");
          const encontrado = await viajeService.obtenerViajePorId(id);
          console.log("\nviaje encontrado:");
          mostrarViaje(encontrado);
          break;
        }

        case "3": {
          const conductorId = await preguntar("id del conductor: ");
          const vehiculoId = await preguntar("id del vehiculo: ");
          const rutaId = await preguntar("id de la ruta: ");
          const cargaIdTexto = await preguntar("id de la carga (dejar vacio si no aplica): ");
          const inicioProgramado = await preguntar("fecha y hora de inicio (aaaa-mm-dd hh:mm): ");

          const nuevo = await viajeService.crearViaje({
            conductorId, vehiculoId, rutaId,
            cargaId: cargaIdTexto || null,
            inicioProgramado,
          });
          console.log("\nviaje programado con exito:");
          mostrarViaje(nuevo);
          break;
        }

        case "4": {
          const id = await preguntar("id del viaje: ");
          const nuevoEstado = await preguntar(
            "nuevo estado (programado, en_curso, pausado, completado, cancelado, accidente): "
          );
          await viajeService.cambiarEstadoViaje(id, nuevoEstado as viaje["estado"]);
          console.log("\nestado del viaje actualizado correctamente.");
          break;
        }

        case "5": {
          const id = await preguntar("id del viaje a eliminar: ");
          await viajeService.eliminarViaje(id);
          console.log("\nviaje eliminado correctamente.");
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
