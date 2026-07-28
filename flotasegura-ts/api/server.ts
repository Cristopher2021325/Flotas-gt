import express from "express";

const app = express();
const puerto = 3000;
const router = express.Router();

app.use(express.json());
app.use("/api", router);


export function iniciarServidor(): void {
  app.listen(puerto, () => {
    console.log(`servidor api escuchando en http://localhost:${puerto}/api`);
  });
}
