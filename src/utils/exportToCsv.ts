const convertToCSV = (objArray: any) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;

  // Formater les données pour inclure le type et le statut lisible
  const data = array.map((item: any) => ({
    ...item
  }));
  // Récupérer les en-têtes du CSV à partir du premier objet
  const headers = Object.keys(data[0]).join(',');

  // Construire les lignes du CSV
  const csvRows = data.map((row) => {
    return Object.values(row)
      .map((value) =>
        typeof value === 'string' && value.includes(',')
          ? `"${value}"` // Encadrer les valeurs avec des virgules par des guillemets
          : value
      )
      .join(',');
  });

  // Retourner l'ensemble du CSV avec les en-têtes
  return `${headers}\r\n${csvRows.join('\r\n')}`;
};

export const exportToCsv = (fileName: string, data: any) => {
  const csvData = convertToCSV(data);
  const bom = '\uFEFF'; // Byte Order Mark pour UTF-8
  const csvBlob = new Blob([bom + csvData], {
    type: 'text/csv;charset=utf-8;',
  });

  const csvURL = URL.createObjectURL(csvBlob);
  const link = document.createElement('a');
  link.href = csvURL;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
