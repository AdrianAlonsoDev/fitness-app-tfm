import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Extend jsPDF types for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ExportData {
  headers: string[];
  data: any[][];
  filename: string;
  title?: string;
}

export const useExport = () => {
  const exportToPDF = ({ headers, data, filename, title = 'Reporte' }: ExportData) => {
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.text(title, 14, 22);
      
      // Fecha
      doc.setFontSize(11);
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 32);
      
      // Verificar si autoTable está disponible
      if (typeof (doc as any).autoTable === 'function') {
        // Tabla
        (doc as any).autoTable({
          head: [headers],
          body: data,
          startY: 40,
          styles: {
            fontSize: 10,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [63, 81, 181],
            textColor: 255,
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
        });
      } else {
        // Fallback: crear tabla manualmente con mejor formato
        let yPosition = 50;
        doc.setFontSize(10);
        
        // Calcular anchos de columna dinámicamente
        const pageWidth = doc.internal.pageSize.width;
        const margins = 28; // 14 de cada lado
        const availableWidth = pageWidth - margins;
        const columnWidth = availableWidth / headers.length;
        
        // Headers
        doc.setFont('helvetica', 'bold');
        let xPosition = 14;
        headers.forEach((header) => {
          // Truncar headers largos
          const displayHeader = header.length > 15 ? header.substring(0, 12) + '...' : header;
          doc.text(displayHeader, xPosition, yPosition);
          xPosition += columnWidth;
        });
        
        yPosition += 12;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        
        // Data rows
        data.forEach((row) => {
          xPosition = 14;
          row.forEach((cell, index) => {
            let displayText = String(cell);
            
            // Truncar texto largo según el tipo de columna
            const maxLength = index === 0 ? 8 : 20; // ID más corto, otros campos más largos
            if (displayText.length > maxLength) {
              displayText = displayText.substring(0, maxLength - 3) + '...';
            }
            
            doc.text(displayText, xPosition, yPosition);
            xPosition += columnWidth;
          });
          yPosition += 10;
          
          // Nueva página si es necesario
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 30;
          }
        });
      }
      
      // Guardar con nombre específico
      doc.save(`${filename}.pdf`);
      console.log('PDF generado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  };

  const exportToExcel = ({ headers, data, filename, title = 'Reporte' }: ExportData) => {
    // Crear workbook
    const wb = XLSX.utils.book_new();
    
    // Crear worksheet con título y fecha
    const wsData = [
      [title],
      [`Fecha: ${new Date().toLocaleDateString('es-ES')}`],
      [], // Fila vacía
      headers,
      ...data
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Merge cells para el título
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }
    ];
    
    // Ajustar ancho de columnas
    const colWidths = headers.map(header => ({
      wch: Math.max(header.length, 15)
    }));
    ws['!cols'] = colWidths;
    
    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    
    // Generar buffer y descargar
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, `${filename}.xlsx`);
  };

  const exportToCSV = ({ headers, data, filename }: ExportData) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') 
          ? `"${cell}"` 
          : cell
      ).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  };

  return {
    exportToPDF,
    exportToExcel,
    exportToCSV,
  };
};
