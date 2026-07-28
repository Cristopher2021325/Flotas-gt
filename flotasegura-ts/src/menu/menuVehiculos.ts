import { preguntar } from "../utils/readline";
import * as vehiculoService from "../services/vehiculoService";
import { vehiculo } from "../models/vehiculo";

function mostrarOpciones(): void {
  console.log("\n----- vehiculos -----");
  console.log("1. listar vehiculos");
  console.log("2. buscar vehiculo por id");
  console.log("3. registrar nuevo vehiculo");
  console.log("4. cambiar estado del vehiculo");
  console.log("5. registrar mantenimiento");
  console.log("6. eliminar vehiculo");
  console.log("0. volver al menu principal");
}

function mostrarVehiculo(v: vehiculo): void {
  console.log(`id: ${v.id} | placa: ${v.placa} | ${v.marca} ${v.modelo} (${v.anio}) | estado: ${v.estado}`);
  console.log(`   empresa: ${v.empresaId} | tipo: ${v.tipo} | tonelaje max: ${v.tonelajeMaximo} | carga actual: ${v.pesoActualCarga}`);
}

export async function menuVehiculos(): Promise<void> {
  let continuar = true;

  while (continuar) {
    mostrarOpciones();
    const opcion = await preguntar("elige una opcion: ");

    try {
      switch (opcion) {
        case "1": {
          const vehiculos = vehiculoService.obtenerVehiculos();
          console.log(`\nse encontraron ${vehiculos.length} vehiculo(s):`);
          vehiculos.forEach(mostrarVehiculo);
          break;
        }

        case "2": {
          const id = await preguntar("id del vehiculo: ");
          const encontrado = vehiculoService.obtenerVehiculoPorId(id);
          console.log("\nvehiculo encontrado:");
          mostrarVehiculo(encontrado);
          break;
        }

        case "3": {
          const empresaId = await preguntar("id de la empresa a la que pertenece: ");
          const placa = await preguntar("placa: ");
          const tipo = await preguntar("tipo (trailer, furgon, cisterna...): ");
          const marca = await preguntar("marca: ");
          const modelo = await preguntar("modelo: ");
          const anio = Number(await preguntar("anio: "));
          const tonelajeMaximo = Number(await preguntar("tonelaje maximo: "));

          const nuevo = vehiculoService.crearVehiculo({
            empresaId, placa, tipo, marca, modelo, anio, tonelajeMaximo, ultimoMantenimiento: null,
          });
          console.log("\nvehiculo registrado con exito:");
          mostrarVehiculo(nuevo);
          break;
        }

        case "4": {
          const id = await preguntar("id del vehiculo: ");
          const nuevoEstado = await preguntar("nuevo estado (disponible, en_ruta, mantenimiento, inactivo): ");
          vehiculoService.actualizarVehiculo(id, { estado: nuevoEstado as vehiculo["estado"] });
          console.log("\nestado actualizado correctamente.");
          break;
        }

        case "5": {
          const id = await preguntar("id del vehiculo: ");
          vehiculoService.actualizarVehiculo(id, { ultimoMantenimiento: new Date().toISOString() });
          console.log("\nmantenimiento registrado correctamente.");
          break;
        }

        case "6": {
          const id = await preguntar("id del vehiculo a eliminar: ");
          vehiculoService.eliminarVehiculo(id);
          console.log("\nvehiculo eliminado correctamente.");
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
