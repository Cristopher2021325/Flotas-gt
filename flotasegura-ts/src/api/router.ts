import express, { Request, Response } from "express";
import * as empresaService from "../services/empresaService";
import * as rutaService from "../services/rutaService";
import * as vehiculoService from "../services/vehiculoService";
import * as conductorService from "../services/conductorService";
import * as cargaService from "../services/cargaService";
import * as viajeService from "../services/viajeService";

export const router = express.Router();


router.get("/empresas", async (_req: Request, res: Response) => {
  try {
    const empresas = await empresaService.obtenerEmpresas();
    res.json(empresas);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(500).json({ error: mensaje });
  }
});


router.get("/empresas/:id", async (req: Request, res: Response) => {
  try {
    const encontrada = await empresaService.obtenerEmpresaPorId(req.params.id);
    res.json(encontrada);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(404).json({ error: mensaje });
  }
});


router.post("/empresas", async (req: Request, res: Response) => {
  try {
    const { nombre, nit, licenciaOperacion, telefono, email } = req.body;
    const nueva = await empresaService.crearEmpresa({ nombre, nit, licenciaOperacion, telefono, email });
    res.status(201).json(nueva);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(400).json({ error: mensaje });
  }
});


router.put("/empresas/:id", async (req: Request, res: Response) => {
  try {
    await empresaService.actualizarDatosEmpresa(req.params.id, req.body);
    const actualizada = await empresaService.obtenerEmpresaPorId(req.params.id);
    res.json(actualizada);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(400).json({ error: mensaje });
  }
});


router.delete("/empresas/:id", async (req: Request, res: Response) => {
  try {
    await empresaService.eliminarEmpresaDefinitivo(req.params.id);
    res.status(204).send();
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(404).json({ error: mensaje });
  }
});


router.get("/rutas", async (_req: Request, res: Response) => {
  try {
    const rutas = await rutaService.obtenerRutas();
    res.json(rutas);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(500).json({ error: mensaje });
  }
});


router.get("/rutas/:id", async (req: Request, res: Response) => {
  try {
    const encontrada = await rutaService.obtenerRutaPorId(req.params.id);
    res.json(encontrada);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(404).json({ error: mensaje });
  }
});


router.get("/vehiculos", async (_req: Request, res: Response) => {
  try {
    const vehiculos = await vehiculoService.obtenerVehiculos();
    res.json(vehiculos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(500).json({ error: mensaje });
  }
});


router.get("/vehiculos/:id", async (req: Request, res: Response) => {
  try {
    const encontrado = await vehiculoService.obtenerVehiculoPorId(req.params.id);
    res.json(encontrado);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(404).json({ error: mensaje });
  }
});


router.get("/conductores", async (_req: Request, res: Response) => {
  try {
    const conductores = await conductorService.obtenerConductores();
    res.json(conductores);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(500).json({ error: mensaje });
  }
});


router.get("/cargas", async (_req: Request, res: Response) => {
  try {
    const cargas = await cargaService.obtenerCargas();
    res.json(cargas);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(500).json({ error: mensaje });
  }
});


router.get("/viajes", async (_req: Request, res: Response) => {
  try {
    const viajes = await viajeService.obtenerViajes();
    res.json(viajes);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "error inesperado";
    res.status(500).json({ error: mensaje });
  }
});