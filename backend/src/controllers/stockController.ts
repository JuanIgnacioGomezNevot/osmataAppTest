import { Request, Response } from 'express';
import type { StockCategory } from '../types/domain';
import { adjustStockQuantity, createStockItem, deleteStockItem, listStock, updateStockItem } from '../services/stockService';

export async function getStock(req: Request, res: Response) {
  const stock = await listStock({
    categoria: req.query.categoria as StockCategory | undefined,
    search: req.query.q as string | undefined,
    bajoStock: req.query.bajoStock === 'true',
  });
  res.json(stock);
}

export async function createStock(req: Request, res: Response) {
  const item = await createStockItem({
    ...req.body,
    cantidadActual: Number(req.body.cantidadActual),
    stockMinimo: Number(req.body.stockMinimo),
  });
  res.status(201).json(item);
}

export async function updateStock(req: Request, res: Response) {
  const item = await updateStockItem(Number(req.params.id), {
    ...req.body,
    ...(req.body.cantidadActual ? { cantidadActual: Number(req.body.cantidadActual) } : {}),
    ...(req.body.stockMinimo ? { stockMinimo: Number(req.body.stockMinimo) } : {}),
  });
  res.json(item);
}

export async function deleteStock(req: Request, res: Response) {
  await deleteStockItem(Number(req.params.id));
  res.status(204).send();
}

export async function adjustStock(req: Request, res: Response) {
  const delta = Number(req.body.delta);
  if (Number.isNaN(delta) || delta === 0) {
    return res.status(400).json({ message: 'La variación debe ser un número distinto de 0.' });
  }
  const item = await adjustStockQuantity(Number(req.params.id), delta);
  res.json(item);
}
