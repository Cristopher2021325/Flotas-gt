import express, { Request, Response } from "express";
import * as empresaService from "../services/empresaService";

export const router = express.Router();


router.get("/empresas", (_req: Request, res: Response) => {
  const empresas = empresaService.obtenerEmpresas();
  res.json(empresas);
});


router.get("/empresas/:id", (req: Request, res: Response) => {
  try {
    const encontrada = empresaService.obtenerEmpresaPorId(req.params.id);
    res.json(encontrada);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(404).json({ error: mensaje });
  }
});


router.post("/empresas", (req: Request, res: Response) => {
  try {
    const { nombre, nit, licenciaOperacion, telefono, email } = req.body;
    const nueva = empresaService.crearEmpresa({ nombre, nit, licenciaOperacion, telefono, email });
    res.status(201).json(nueva);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(400).json({ error: mensaje });
  }
});
