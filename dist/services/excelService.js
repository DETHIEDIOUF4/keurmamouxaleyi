"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderItemsExcelBuffer = exports.generateOrderItemsExcel = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const buildOrderItemsWorkbook = (order) => {
    var _a;
    const workbook = new exceljs_1.default.Workbook();
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
    const lastRowNumber = ((_a = itemsSheet.lastRow) === null || _a === void 0 ? void 0 : _a.number) || totalRow.number;
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
const generateOrderItemsExcel = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadsDir = path_1.default.resolve(process.cwd(), 'uploads', 'orders');
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
    const workbook = buildOrderItemsWorkbook(order);
    const filename = `order_${String(order._id)}_items.xlsx`;
    const filePath = path_1.default.join(uploadsDir, filename);
    yield workbook.xlsx.writeFile(filePath);
    return filePath;
});
exports.generateOrderItemsExcel = generateOrderItemsExcel;
const generateOrderItemsExcelBuffer = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = buildOrderItemsWorkbook(order);
    const buffer = yield workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
});
exports.generateOrderItemsExcelBuffer = generateOrderItemsExcelBuffer;
