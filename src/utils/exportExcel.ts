import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = ({ data, fileName }: { data: any; fileName: string }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Rapport financier des activités');

  // Ajouter un titre avec styles
  worksheet.mergeCells('A1:E1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'Rapport financier des activités';
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { horizontal: 'center' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '646cff' },
  };
  titleCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  // Ajouter les en-têtes
  worksheet.addRow([
    'Type',
    'Catégorie',
    'Activité',
    'Montant',
    'Date & heure'
  ]);

  // Appliquer des styles aux en-têtes
  const headerCell = worksheet.getRow(2);
  headerCell.font = {
    bold: true,
    // color: { argb: '9ca3af' },
    size: 14,
    // italic: true,
  };
  headerCell.alignment = {
    vertical: 'middle',
    horizontal: 'left',
  };
  // worksheet.getRow(2).font = { bold: true };

  // Ajouter les données
  data.forEach((item: any) => {
    worksheet.addRow([
      item.type,
      item.category,
      item.activity,
      `${item.amount} FCFA`,
      new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
        timeZone: "Europe/Paris",
      }).format(new Date(item.createdAt)),
    ]);
  });

  // Ajuster les largeurs de colonne
  worksheet.columns.forEach((column) => {
    column.width = 25;
  });

  // Exporter le fichier Excel
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  });
};
