import { preguntar } from "../utils/readline";
import * as cargaService from "../services/cargaService";
import { carga } from "../models/carga";

function mostrarOpciones(): void {
  console.log("\n----- cargas -----");
  console.log("1. listar cargas");
  console.log("2. buscar carga por id");
  console.log("3. registrar nueva carga");
  console.log("4. cambiar estado de la carga");
  console.log("5. eliminar carga");
  console.log("0. volver al menu principal");
}

function mostrarCarga(c: carga): void {
  console.log(`id: ${c.id} | ${c.descripcion} | peso: ${c.pesoKg} kg | tipo: ${c.tipoCarga} | estado: ${c.estado}`);
  console.log(`   origen: ${c.origenDireccion} -> destino: ${c.destinoDireccion} | refrigeracion: ${c.requiereRefrigeracion ? "si" : "no"}`);
}

export async function menuCargas(): Promise<void> {
  let continuar = true;

  while (continuar) {
    mostrarOpciones();
    const opcion = await preguntar("elige una opcion: ");

    try {
      switch (opcion) {
        case "1": {
          const cargas = await cargaService.obtenerCargas();
          console.log(`\nse encontraron ${cargas.length} carga(s):`);
          cargas.forEach(mostrarCarga);
          break;
        }

        case "2": {
          const id = await preguntar("id de la carga: ");
          const encontrada = await cargaService.obtenerCargaPorId(id);
          console.log("\ncarga encontrada:");
          mostrarCarga(encontrada);
          break;
        }

        case "3": {
          const empresaId = await preguntar("id de la empresa duena de la carga: ");
          const descripcion = await preguntar("descripcion de la carga: ");
          const pesoKg = Number(await preguntar("peso en kg: "));
          const tipoCarga = await preguntar("tipo de carga (general, peligrosa, refrigerada...): ");
          const requiereRefrigeracionTexto = await preguntar("requiere refrigeracion? (si/no): ");
          const origenDireccion = await preguntar("direccion de origen: ");
          const destinoDireccion = await preguntar("direccion de destino: ");

          const nueva = await cargaService.crearCarga({
            empresaId, descripcion, pesoKg, tipoCarga,
            requiereRefrigeracion: requiereRefrigeracionTexto.toLowerCase() === "si",
            origenDireccion, destinoDireccion,
          });
          console.log("\ncarga registrada con exito:");
          mostrarCarga(nueva);
          break;
        }

        case "4": {
          const id = await preguntar("id de la carga: ");
          const nuevoEstado = await preguntar("nuevo estado (pendiente, asignada, en_transito, entregada, cancelada): ");
          await cargaService.actualizarCarga(id, { estado: nuevoEstado as carga["estado"] });
          console.log("\nestado actualizado correctamente.");
          break;
        }

        case "5": {
          const id = await preguntar("id de la carga a eliminar: ");
          await cargaService.eliminarCarga(id);
          console.log("\ncarga eliminada correctamente.");
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
