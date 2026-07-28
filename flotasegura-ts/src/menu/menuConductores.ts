import { preguntar } from "../utils/readline";
import * as conductorService from "../services/conductorService";
import { conductor } from "../models/conductor";

function mostrarOpciones(): void {
  console.log("\n----- conductores -----");
  console.log("1. listar conductores");
  console.log("2. buscar conductor por id");
  console.log("3. registrar nuevo conductor");
  console.log("4. actualizar horas de manejo / descanso");
  console.log("5. cambiar estado del conductor");
  console.log("6. eliminar conductor");
  console.log("0. volver al menu principal");
}

function mostrarConductor(c: conductor): void {
  console.log(`id: ${c.id} | ${c.nombreCompleto} | licencia: ${c.licenciaNumero} (${c.licenciaTipo}) | estado: ${c.estado}`);
  console.log(`   empresa: ${c.empresaId} | horas manejo hoy: ${c.horasManejoHoy} | horas descanso: ${c.horasDescansoAcumuladas}`);
}

export async function menuConductores(): Promise<void> {
  let continuar = true;

  while (continuar) {
    mostrarOpciones();
    const opcion = await preguntar("elige una opcion: ");

    try {
      switch (opcion) {
        case "1": {
          const conductores = await conductorService.obtenerConductores();
          console.log(`\nse encontraron ${conductores.length} conductor(es):`);
          conductores.forEach(mostrarConductor);
          break;
        }

        case "2": {
          const id = await preguntar("id del conductor: ");
          const encontrado = await conductorService.obtenerConductorPorId(id);
          console.log("\nconductor encontrado:");
          mostrarConductor(encontrado);
          break;
        }

        case "3": {
          const empresaId = await preguntar("id de la empresa a la que pertenece: ");
          const nombreCompleto = await preguntar("nombre completo: ");
          const licenciaTipo = await preguntar("tipo de licencia (a, b, c, e): ");
          const licenciaNumero = await preguntar("numero de licencia: ");
          const licenciaVencimiento = await preguntar("vencimiento de licencia (aaaa-mm-dd): ");
          const telefono = await preguntar("telefono: ");

          const nuevo = await conductorService.crearConductor({
            empresaId, nombreCompleto, licenciaTipo, licenciaNumero, licenciaVencimiento, telefono,
          });
          console.log("\nconductor registrado con exito:");
          mostrarConductor(nuevo);
          break;
        }

        case "4": {
          const id = await preguntar("id del conductor: ");
          const horasManejoHoy = await preguntar("horas de manejo hoy (dejar vacio para no cambiar): ");
          const horasDescansoAcumuladas = await preguntar("horas de descanso acumuladas (dejar vacio para no cambiar): ");

          const datos: Partial<conductor> = {};
          if (horasManejoHoy) datos.horasManejoHoy = Number(horasManejoHoy);
          if (horasDescansoAcumuladas) datos.horasDescansoAcumuladas = Number(horasDescansoAcumuladas);

          await conductorService.actualizarConductor(id, datos);
          console.log("\nconductor actualizado correctamente.");
          break;
        }

        case "5": {
          const id = await preguntar("id del conductor: ");
          const nuevoEstado = await preguntar("nuevo estado (disponible, en_ruta, descansando, inactivo): ");
          await conductorService.actualizarConductor(id, { estado: nuevoEstado as conductor["estado"] });
          console.log("\nestado actualizado correctamente.");
          break;
        }

        case "6": {
          const id = await preguntar("id del conductor a eliminar: ");
          await conductorService.eliminarConductor(id);
          console.log("\nconductor eliminado correctamente.");
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
