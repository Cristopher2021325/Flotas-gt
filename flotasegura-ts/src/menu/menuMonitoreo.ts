import { preguntar } from "../utils/readline";
import * as monitoreoService from "../services/monitoreoService";
import { monitoreo } from "../models/monitoreo";

function mostrarOpciones(): void {
  console.log("\n----- monitoreo en tiempo real -----");
  console.log("1. ver monitoreos de un viaje");
  console.log("2. registrar nuevo monitoreo");
  console.log("0. volver al menu principal");
}

function mostrarMonitoreo(m: monitoreo): void {
  console.log(`${m.registradoEn} | velocidad: ${m.velocidadKmh} km/h | horas continuas: ${m.horasConduccionContinua} | estado: ${m.estadoConductor}`);
}

export async function menuMonitoreo(): Promise<void> {
  let continuar = true;

  while (continuar) {
    mostrarOpciones();
    const opcion = await preguntar("elige una opcion: ");

    try {
      switch (opcion) {
        case "1": {
          const viajeId = await preguntar("id del viaje: ");
          const registros = await monitoreoService.obtenerMonitoreosDeViaje(viajeId);
          console.log(`\nse encontraron ${registros.length} registro(s):`);
          registros.forEach(mostrarMonitoreo);
          break;
        }

        case "2": {
          const viajeId = await preguntar("id del viaje: ");
          const latitud = Number(await preguntar("latitud: "));
          const longitud = Number(await preguntar("longitud: "));
          const velocidadKmh = Number(await preguntar("velocidad (km/h): "));
          const horasConduccionContinua = Number(await preguntar("horas de conduccion continua: "));
          const estadoConductor = await preguntar("estado del conductor (activo, alerta_fatiga, detenido, descanso): ");

          await monitoreoService.registrarMonitoreo({
            viajeId, latitud, longitud, velocidadKmh, horasConduccionContinua,
            estadoConductor: estadoConductor as monitoreo["estadoConductor"],
          });
          console.log("\nmonitoreo registrado correctamente.");
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
