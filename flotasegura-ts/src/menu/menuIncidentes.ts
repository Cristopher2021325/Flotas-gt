import { preguntar } from "../utils/readline";
import * as incidenteService from "../services/incidenteService";
import { incidente } from "../models/incidente";

function mostrarOpciones(): void {
  console.log("\n----- incidentes -----");
  console.log("1. listar incidentes");
  console.log("2. buscar incidente por id");
  console.log("3. reportar nuevo incidente");
  console.log("0. volver al menu principal");
}

function mostrarIncidente(i: incidente): void {
  console.log(`id: ${i.id} | tipo: ${i.tipo} | severidad: ${i.severidad} | viaje: ${i.viajeId}`);
  console.log(`   ${i.descripcion} | reportado a autoridades: ${i.reportadoAutoridades ? "si" : "no"} | ${i.ocurridoEn}`);
}

export async function menuIncidentes(): Promise<void> {
  let continuar = true;

  while (continuar) {
    mostrarOpciones();
    const opcion = await preguntar("elige una opcion: ");

    try {
      switch (opcion) {
        case "1": {
          const incidentes = await incidenteService.obtenerIncidentes();
          console.log(`\nse encontraron ${incidentes.length} incidente(s):`);
          incidentes.forEach(mostrarIncidente);
          break;
        }

        case "2": {
          const id = await preguntar("id del incidente: ");
          const encontrado = await incidenteService.obtenerIncidentePorId(id);
          console.log("\nincidente encontrado:");
          mostrarIncidente(encontrado);
          break;
        }

        case "3": {
          const viajeId = await preguntar("id del viaje: ");
          const conductorId = await preguntar("id del conductor: ");
          const vehiculoId = await preguntar("id del vehiculo: ");
          const tipo = await preguntar("tipo (accidente, falla_mecanica, robo, clima, cierre_vial, otro): ");
          const descripcion = await preguntar("descripcion del incidente: ");
          const severidad = await preguntar("severidad (leve, moderado, grave, fatal): ");
          const reportadoTexto = await preguntar("se reporto a las autoridades? (si/no): ");

          const nuevo = await incidenteService.reportarIncidente({
            viajeId, conductorId, vehiculoId,
            tipo: tipo as incidente["tipo"],
            descripcion,
            severidad: severidad as incidente["severidad"],
            reportadoAutoridades: reportadoTexto.toLowerCase() === "si",
          });
          console.log("\nincidente reportado correctamente:");
          mostrarIncidente(nuevo);
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
