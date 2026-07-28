import { preguntar } from "../utils/readline";
import { menuEmpresas } from "./menuEmpresas";
import { menuConductores } from "./menuConductores";
import { menuVehiculos } from "./menuVehiculos";
import { menuCargas } from "./menuCargas";
import { menuRutas } from "./menuRutas";
import { menuViajes } from "./menuViajes";
import { menuMonitoreo } from "./menuMonitoreo";
import { menuAlertas } from "./menuAlertas";
import { menuIncidentes } from "./menuIncidentes";

function mostrarOpciones(): void {
  console.log("\n===== flotasegura gt - menu principal =====");
  console.log("1. empresas transportistas");
  console.log("2. conductores");
  console.log("3. vehiculos");
  console.log("4. cargas");
  console.log("5. rutas y paradas");
  console.log("6. viajes");
  console.log("7. monitoreo en tiempo real");
  console.log("8. alertas de fatiga");
  console.log("9. incidentes");
  console.log("0. salir del programa");
}

export async function iniciarMenu(): Promise<void> {
  let continuar = true;

  while (continuar) {
    mostrarOpciones();
    const opcion = await preguntar("elige una opcion: ");

    try {
      switch (opcion) {
        case "1": await menuEmpresas(); break;
        case "2": await menuConductores(); break;
        case "3": await menuVehiculos(); break;
        case "4": await menuCargas(); break;
        case "5": await menuRutas(); break;
        case "6": await menuViajes(); break;
        case "7": await menuMonitoreo(); break;
        case "8": await menuAlertas(); break;
        case "9": await menuIncidentes(); break;

        case "0": {
          console.log("\ngracias por usar flotasegura gt. hasta pronto!");
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
