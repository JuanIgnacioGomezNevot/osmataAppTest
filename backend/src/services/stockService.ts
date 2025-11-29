import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import type { StockCategory } from '../types/domain';

export async function listStock(params?: { categoria?: StockCategory; search?: string; bajoStock?: boolean }) {
  const where: Prisma.StockItemWhereInput = {};
  if (params?.categoria) where.categoria = params.categoria;
  if (params?.search) where.nombre = { contains: params.search };
  const items = await prisma.stockItem.findMany({ where, orderBy: { nombre: 'asc' } });
  if (params?.bajoStock) {
    return items.filter((item) => item.cantidadActual < item.stockMinimo);
  }
  return items;
}

export async function createStockItem(data: Prisma.StockItemCreateInput) {
  return prisma.stockItem.create({ data });
}

export async function updateStockItem(id: number, data: Prisma.StockItemUpdateInput) {
  return prisma.stockItem.update({ where: { id }, data });
}

export async function deleteStockItem(id: number) {
  return prisma.stockItem.delete({ where: { id } });
}

export async function adjustStockQuantity(id: number, delta: number) {
  return prisma.$transaction(async (tx) => {
    const item = await tx.stockItem.findUnique({ where: { id } });
    if (!item) {
      throw new Error('El insumo no existe');
    }
    const nextQuantity = item.cantidadActual + delta;
    if (nextQuantity < 0) {
      throw new Error('La cantidad resultante no puede ser negativa');
    }
    return tx.stockItem.update({ where: { id }, data: { cantidadActual: nextQuantity } });
  });
}
