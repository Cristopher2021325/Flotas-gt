import { preguntar } from "../utils/readline";
import * as empresaService from "../services/empresaService";
import { empresa } from "../models/empresa";

function mostrarOpciones(): void {
  console.log("\n----- empresas transportistas -----");
  console.log("1. listar todas las empresas");
  console.log("2. listar solo empresas activas");
  console.log("3. buscar empresa por id");
  console.log("4. registrar nueva empresa");
  console.log("5. actualizar telefono o email de una empresa");
  console.log("6. desactivar empresa");
  console.log("7. eliminar empresa");
  console.log("0. volver al menu principal");
}

function mostrarEmpresa(e: empresa): void {
  console.log(`id: ${e.id} | nombre: ${e.nombre} | nit: ${e.nit} | estado: ${e.estado}`);
  console.log(`   licencia: ${e.licenciaOperacion} | telefono: ${e.telefono} | email: ${e.email}`);
}

export async function menuEmpresas(): Promise<void> {
  let continuar = true;

  while (continuar) {
    mostrarOpciones();
    const opcion = await preguntar("elige una opcion: ");

    try {
      switch (opcion) {
        case "1": {
          const empresas = empresaService.obtenerEmpresas();
          console.log(`\nse encontraron ${empresas.length} empresa(s):`);
          empresas.forEach(mostrarEmpresa);
          break;
        }

        case "2": {
          const activas = empresaService.obtenerEmpresasActivas();
          console.log(`\nempresas activas (${activas.length}):`);
          activas.forEach(mostrarEmpresa);
          break;
        }

        case "3": {
          const id = await preguntar("ingresa el id de la empresa: ");
          const encontrada = empresaService.obtenerEmpresaPorId(id);
          console.log("\nempresa encontrada:");
          mostrarEmpresa(encontrada);
          break;
        }

        case "4": {
          const nombre = await preguntar("nombre de la empresa: ");
          const nit = await preguntar("nit: ");
          const licenciaOperacion = await preguntar("licencia de operacion: ");
          const telefono = await preguntar("telefono: ");
          const email = await preguntar("email: ");

          const nueva = empresaService.crearEmpresa({ nombre, nit, licenciaOperacion, telefono, email });
          console.log("\nempresa registrada con exito:");
          mostrarEmpresa(nueva);
          break;
        }

        case "5": {
          const id = await preguntar("id de la empresa a actualizar: ");
          const telefono = await preguntar("nuevo telefono (dejar vacio para no cambiar): ");
          const email = await preguntar("nuevo email (dejar vacio para no cambiar): ");

          const datos: { telefono?: string; email?: string } = {};
          if (telefono) datos.telefono = telefono;
          if (email) datos.email = email;

          empresaService.actualizarDatosEmpresa(id, datos);
          console.log("\nempresa actualizada correctamente.");
          break;
        }

        case "6": {
          const id = await preguntar("id de la empresa a desactivar: ");
          empresaService.desactivarEmpresa(id);
          console.log("\nempresa desactivada correctamente.");
          break;
        }

        case "7": {
          const id = await preguntar("id de la empresa a eliminar: ");
          empresaService.eliminarEmpresaDefinitivo(id);
          console.log("\nempresa eliminada correctamente.");
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
