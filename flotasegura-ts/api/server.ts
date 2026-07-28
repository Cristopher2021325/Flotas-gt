import express from "express";
import { router } from "./router";

const app = express();
const puerto = 3000;

app.use(express.json());
app.use("/api", router);


export function iniciarServidor(): void {
  app.listen(puerto, () => {
    console.log(`servidor api escuchando en http://localhost:${puerto}/api`);
  });
}
