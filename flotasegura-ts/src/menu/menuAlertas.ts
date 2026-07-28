import { preguntar } from "../utils/readline";
import * as alertaService from "../services/alertaService";
import { alertaFatiga } from "../models/alertaFatiga";

function mostrarOpciones(): void {
  console.log("\n----- alertas de fatiga -----");
  console.log("1. listar todas las alertas");
  console.log("2. listar alertas pendientes");
  console.log("3. generar nueva alerta");
  console.log("4. marcar alerta como atendida");
  console.log("0. volver al menu principal");
}

function mostrarAlerta(a: alertaFatiga): void {
  console.log(`id: ${a.id} | ${a.tipoAlerta} | conductor: ${a.conductorId} | atendida: ${a.atendida ? "si" : "no"}`);
  console.log(`   ${a.mensaje} (horas sin descanso: ${a.horasSinDescanso})`);
}

export async function menuAlertas(): Promise<void> {
  let continuar = true;

  while (continuar) {
    mostrarOpciones();
    const opcion = await preguntar("elige una opcion: ");

    try {
      switch (opcion) {
        case "1": {
          const alertas = await alertaService.obtenerAlertas();
          console.log(`\nse encontraron ${alertas.length} alerta(s):`);
          alertas.forEach(mostrarAlerta);
          break;
        }

        case "2": {
          const pendientes = await alertaService.obtenerAlertasPendientes();
          console.log(`\nalertas pendientes (${pendientes.length}):`);
          pendientes.forEach(mostrarAlerta);
          break;
        }

        case "3": {
          const viajeId = await preguntar("id del viaje: ");
          const conductorId = await preguntar("id del conductor: ");
          const tipoAlerta = await preguntar(
            "tipo de alerta (pre_fatiga, fatiga, descanso_obligatorio, velocidad_excesiva, ruta_peligrosa): "
          );
          const mensaje = await preguntar("mensaje de la alerta: ");
          const horasSinDescanso = Number(await preguntar("horas sin descanso: "));

          const nueva = await alertaService.generarAlerta({
            viajeId, conductorId, tipoAlerta: tipoAlerta as alertaFatiga["tipoAlerta"], mensaje, horasSinDescanso,
          });
          console.log("\nalerta generada correctamente:");
          mostrarAlerta(nueva);
          break;
        }

        case "4": {
          const id = await preguntar("id de la alerta a atender: ");
          await alertaService.atenderAlerta(id);
          console.log("\nalerta marcada como atendida.");
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
