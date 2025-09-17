import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { IOrder } from '../models/order.model';

const buildOrderItemsWorkbook = (order: IOrder): ExcelJS.Workbook => {
  const workbook = new ExcelJS.Workbook();
  const itemsSheet = workbook.addWorksheet('Articles');

  // Colonnes avec formats
  itemsSheet.columns = [
    { header: 'Produit', key: 'name', width: 40 },
    { header: 'Quantité', key: 'quantity', width: 12, style: { alignment: { horizontal: 'center' } } },
    { header: 'Prix unitaire', key: 'price', width: 18, style: { numFmt: '#,##0 "FCFA"', alignment: { horizontal: 'right' } } },
    { header: 'Total', key: 'lineTotal', width: 18, style: { numFmt: '#,##0 "FCFA"', alignment: { horizontal: 'right' } } },
  ];

  // En-tête: gras + fond léger
  const headerRow = itemsSheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: 'middle' };

  // Lignes d'articles
  (order.orderItems || []).forEach((item) => {
    const lineTotal = (item.quantity || 0) * (item.price || 0);
    itemsSheet.addRow({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      lineTotal,
    });
  });

  // Ligne Total à payer
  const totalRow = itemsSheet.addRow({ name: 'Total à payer', quantity: '', price: '', lineTotal: order.totalPrice });
  // Fusionner A:C pour le libellé
  itemsSheet.mergeCells(`A${totalRow.number}:C${totalRow.number}`);
  const labelCell = itemsSheet.getCell(`A${totalRow.number}`);
  labelCell.alignment = { horizontal: 'right' };
  labelCell.font = { bold: true };
  const totalCell = itemsSheet.getCell(`D${totalRow.number}`);
  totalCell.font = { bold: true };
  totalCell.numFmt = '#,##0 "FCFA"';

  // Bordures fines pour lisibilité
  const lastRowNumber = itemsSheet.lastRow?.number || totalRow.number;
  for (let r = 1; r <= lastRowNumber; r++) {
    for (const c of ['A', 'B', 'C', 'D']) {
      const cell = itemsSheet.getCell(`${c}${r}`);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  }

  // Figer l'en-tête et ajouter un filtre
  itemsSheet.views = [{ state: 'frozen', ySplit: 1 }];
  itemsSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 4 },
  };

  return workbook;
};

export const generateOrderItemsExcel = async (order: IOrder): Promise<string> => {
  const uploadsDir = path.resolve(process.cwd(), 'uploads', 'orders');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const workbook = buildOrderItemsWorkbook(order);
  const filename = `order_${String(order._id)}_items.xlsx`;
  const filePath = path.join(uploadsDir, filename);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
};

export const generateOrderItemsExcelBuffer = async (order: IOrder): Promise<Buffer> => {
  const workbook = buildOrderItemsWorkbook(order);
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};
