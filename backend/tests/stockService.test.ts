import { listStock } from '../src/services/stockService';
import { prisma } from '../src/utils/prisma';

jest.mock('../src/utils/prisma', () => {
  const stockItem = {
    findMany: jest.fn(),
  };
  return {
    prisma: {
      stockItem,
    },
  };
});

describe('stockService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filtra items bajo stock', async () => {
    (prisma.stockItem.findMany as jest.Mock).mockResolvedValue([
      { nombre: 'A', cantidadActual: 5, stockMinimo: 10 },
      { nombre: 'B', cantidadActual: 50, stockMinimo: 20 },
    ]);

    const result = await listStock({ bajoStock: true });
    expect(result).toHaveLength(1);
    expect(result[0].nombre).toBe('A');
  });
});
