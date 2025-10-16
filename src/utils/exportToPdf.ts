import { IMouvementCheckout } from '@/interface/activity';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import logo from '../assets/logo_icon.png';

interface IExportToPdf {
  fileName: string;
  data: Partial<IMouvementCheckout>[];
  watermark?: string | { text: string; image?: string };
}

const layoutRows = (item: any, column: string) => {
  switch (column) {
    case 'Catégorie':
      return item.category;
    case 'Activité':
      return item.activity;  
    case 'Montant':
      return item.amount;
    case 'Date & heure':
      return Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
        timeZone: "Europe/Paris",
      }).format(new Date(item.createdAt));
    default:
      return item[column];
  }
};

const columns = [
  'type',
  'Catégorie',
  'Activité',
  'Montant',
  'Date & heure',
];

// Fonction pour ajouter un filigrane texte
const addTextWatermark = (doc: jsPDF, text: string) => {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Sauvegarder l'état graphique
    doc.saveGraphicsState();
    
    // Configurer l'opacité et la rotation
    doc.setGState(doc.GState({ opacity: 0.1 }));
    doc.setFontSize(60);
    doc.setTextColor(150, 150, 150);
    
    // Calculer le centre de la page
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;
    
    // Appliquer la rotation (45 degrés)
    const angle = 45;
    doc.text(text, centerX, centerY, {
      align: 'center',
      angle: angle,
    });
    
    // Restaurer l'état graphique
    doc.restoreGraphicsState();
  }
};

// Fonction pour ajouter un filigrane image
const addImageWatermark = (doc: jsPDF, imageBase64: string) => {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  const watermarkWidth = 100;
  const watermarkHeight = 100;
  const x = (pageWidth - watermarkWidth) / 2;
  const y = (pageHeight - watermarkHeight) / 2;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.saveGraphicsState();
    doc.setGState(doc.GState({ opacity: 0.1 }));
    doc.addImage(imageBase64, 'PNG', x, y, watermarkWidth, watermarkHeight);
    doc.restoreGraphicsState();
  }
};

export const exportToPDF = ({ data, fileName, watermark }: IExportToPdf) => {
  const doc = new jsPDF();
  
  // Ajouter le logo si fourni (en haut à droite)
  if (logo) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 20;
    const logoHeight = 25;
    const margin = 14;
    
    doc.addImage(logo, 'PNG', pageWidth - logoWidth - margin, 10, logoWidth, logoHeight);
  }
  
  // Ajouter un titre au document
  doc.setFontSize(14);
  // doc.setFont('Helvetica', 'bold');
  doc.text('Rapport des finances', 14, 20);

  // Ajouter un sous-titre ou la date
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Généré le: ${new Date().toLocaleDateString()}`, 14, 30);

  const tableColumn = Object.keys(data[0]);
  const tableRows: any[] = [];

  data.forEach((item: any) => {
    const rowData = tableColumn.map((key) => layoutRows(item, key));
    tableRows.push(rowData);
  });

  autoTable(doc, {
    head: [columns],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    headStyles: {
      fillColor: '#646cff',
      textColor: [255, 255, 255],
      fontSize: 8,
      cellPadding: 2,
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontSize: 8,
      cellPadding: 2,
    },
    margin: { top: 50 },
    styles: {
      overflow: 'linebreak',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 'auto' },
      5: { cellWidth: 'auto' },
      6: { cellWidth: 'auto' },
      7: { cellWidth: 'auto' },
    },
    tableWidth: 'auto',
  });

  // Ajouter le filigrane après le tableau
  if (watermark) {
    if (typeof watermark === 'string') {
      // Filigrane texte
      addTextWatermark(doc, watermark);
    } else if (watermark.text) {
      // Filigrane texte depuis objet
      addTextWatermark(doc, watermark.text);
    } else if (watermark.image) {
      // Filigrane image
      addImageWatermark(doc, watermark.image);
    }
  }

  doc.save(`${fileName}.pdf`);
};