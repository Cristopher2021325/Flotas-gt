import { iniciarCliente } from "./client/cliente";
import { iniciarServidor } from "./api/server";


process.on("uncaughtException", (error) => {
  console.log(`\nerror inesperado: ${error.message}`);
});

process.on("unhandledRejection", (razon) => {
  const mensaje = razon instanceof Error ? razon.message : String(razon);
  console.log(`\nerror inesperado (promesa): ${mensaje}`);
});

const modo = process.argv[2];

if (modo === "api") {
  iniciarServidor();
} else {
  iniciarCliente().catch((error) => {
    const mensaje = error instanceof Error ? error.message : "ocurrio un error inesperado";
    console.log(`\nno se pudo iniciar el programa: ${mensaje}`);
  });
}
