import { iniciarMenu } from "../menu/menuPrincipal";
import { cerrarLectura } from "../utils/readline";

export async function iniciarCliente(): Promise<void> {
  console.log("bienvenido a flotasegura gt");
  console.log("sistema de gestion de empresas transportistas\n");

  await iniciarMenu();
  cerrarLectura();
}
