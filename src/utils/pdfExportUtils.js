import jsPDF from 'jspdf';

/**
 * PDF Export Utility for Table Reports
 * Handles generation of professional PDF reports with proper table formatting
 */

// PDF configuration constants
const PDF_CONFIG = {
  pageSize: 'a4',
  orientation: 'landscape', // Better for wide tables
  margins: {
    top: 20,
    right: 15,
    bottom: 20,
    left: 15
  },
  headerHeight: 40,
  footerHeight: 20,
  tableRowHeight: 12,
  maxRowsPerPage: 25, // Adjust based on content
  fontSize: {
    title: 18,
    subtitle: 14,
    header: 10,
    body: 9
  }
};

/**
 * Generate PDF report with proper table formatting
 * @param {string} reportType - Type of report (job-seekers, employer-requests, etc.)
 * @param {Array} tableData - Formatted table data
 * @param {Array} columns - Table column definitions
 * @param {Object} options - Additional options (title, subtitle, date range)
 */
export const generateTablePDF = (reportType, tableData, columns, options = {}) => {
  try {
    // Initialize PDF document
    const doc = new jsPDF(PDF_CONFIG.orientation, 'mm', PDF_CONFIG.pageSize);
    
    // Set document properties
    doc.setProperties({
      title: `${options.title || 'Table Report'} - ${reportType}`,
      subject: `Data export for ${reportType}`,
      author: 'Braziconnect Portal System',
      creator: 'Braziconnect Portal System'
    });

    // Calculate available space for table using jsPDF v3 API
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const availableWidth = pageWidth - PDF_CONFIG.margins.left - PDF_CONFIG.margins.right;
    const availableHeight = pageHeight - PDF_CONFIG.margins.top - PDF_CONFIG.margins.bottom - PDF_CONFIG.headerHeight - PDF_CONFIG.footerHeight;

    // Generate header
    generateHeader(doc, options.title || getReportTitle(reportType), options.subtitle, options.dateRange);

    // Prepare table data for PDF
    const pdfTableData = prepareTableDataForPDF(tableData, columns);
    
    // Generate table with auto-pagination
    generateTable(doc, pdfTableData, columns, availableWidth, availableHeight);

    // Generate footer
    generateFooter(doc, pageWidth, pageHeight);

    // Return the PDF document
    return doc;
  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Error details:', {
      reportType,
      tableDataLength: tableData?.length,
      columnsLength: columns?.length,
      errorMessage: error.message,
      errorStack: error.stack
    });
    throw new Error(`Failed to generate PDF report: ${error.message}`);
  }
};

/**
 * Generate PDF header with title, subtitle, and date range
 */
const generateHeader = (doc, title, subtitle, dateRange) => {
  const { margins, headerHeight, fontSize } = PDF_CONFIG;
  
  try {
    // Company logo/name (you can customize this)
    doc.setFontSize(fontSize.title);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text('Braziconnect Portal System', margins.left, margins.top + 10);
    
    // Report title
    doc.setFontSize(fontSize.subtitle);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39); // Dark gray
    doc.text(title, margins.left, margins.top + 25);
    
    // Subtitle
    if (subtitle) {
      doc.setFontSize(fontSize.body);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128); // Medium gray
      doc.text(subtitle, margins.left, margins.top + 35);
    }
    
    // Date range
    if (dateRange) {
      doc.setFontSize(fontSize.body);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(`Export Date: ${dateRange}`, margins.left, margins.top + 35);
    }
    
    // Add a line separator
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    
    // Get page dimensions using jsPDF v3 API
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.line(margins.left, margins.top + headerHeight - 5, pageWidth - margins.right, margins.top + headerHeight - 5);
  } catch (error) {
    console.error('Error in generateHeader:', error);
    // Fallback: just add basic text
    doc.setFontSize(16);
    doc.text(title || 'Report', margins.left, margins.top + 20);
  }
};

/**
 * Generate table with proper formatting and pagination
 */
const generateTable = (doc, tableData, columns, availableWidth, availableHeight) => {
  try {
    const { margins, headerHeight, fontSize } = PDF_CONFIG;
    
    // Generate table manually (jsPDF v3 compatible)
    generateManualTable(doc, tableData, columns, margins, headerHeight, fontSize);
  } catch (error) {
    console.error('Error in generateTable:', error);
    throw error;
  }
};

/**
 * Generate table manually when autoTable is not available
 */
const generateManualTable = (doc, tableData, columns, margins, headerHeight, fontSize) => {
  try {
    const startY = margins.top + headerHeight;
    const rowHeight = 12;
    const colWidth = 40; // Fixed column width for simplicity
    
    // Draw table headers
    doc.setFontSize(fontSize.header);
    doc.setFont('helvetica', 'bold');
    
    // Try to set fill color (jsPDF v3 compatible)
    try {
      doc.setFillColor(59, 130, 246); // Blue header background
    } catch (e) {
      // console.log('setFillColor not available, using default'); // Removed
    }
    
    columns.forEach((col, colIndex) => {
      const x = margins.left + (colIndex * colWidth);
      try {
        doc.rect(x, startY, colWidth, rowHeight, 'F');
      } catch (e) {
        doc.rect(x, startY, colWidth, rowHeight);
      }
      
      try {
        doc.setTextColor(255, 255, 255); // White text
      } catch (e) {
        // console.log('setTextColor not available, using default'); // Removed
      }
      doc.text(col.label, x + 5, startY + 8);
    });
    
    // Draw table data
    doc.setFontSize(fontSize.body);
    doc.setFont('helvetica', 'normal');
    
    try {
      doc.setTextColor(17, 24, 39); // Dark text
    } catch (e) {
      // console.log('setTextColor not available, using default'); // Removed
    }
    
    tableData.forEach((row, rowIndex) => {
      const y = startY + ((rowIndex + 1) * rowHeight);
      
      // Alternate row colors
      if (rowIndex % 2 === 1) {
        try {
          doc.setFillColor(249, 250, 251); // Light gray
        } catch (e) {
          // console.log('setFillColor not available, using default'); // Removed
        }
      } else {
        try {
          doc.setFillColor(255, 255, 255); // White
        } catch (e) {
          // console.log('setFillColor not available, using default'); // Removed
        }
      }
      
      columns.forEach((col, colIndex) => {
        const x = margins.left + (colIndex * colWidth);
        try {
          doc.rect(x, y, colWidth, rowHeight, 'F');
        } catch (e) {
          doc.rect(x, y, colWidth, rowHeight);
        }
        doc.rect(x, y, colWidth, rowHeight); // Border
        
        const value = row[colIndex] || '';
        // Truncate long text
        const displayValue = typeof value === 'string' && value.length > 15 
          ? value.substring(0, 12) + '...' 
          : value;
        
        doc.text(displayValue, x + 5, y + 8);
      });
    });
  } catch (error) {
    console.error('Error in manual table generation:', error);
    throw error;
  }
};

/**
 * Generate PDF footer
 */
const generateFooter = (doc, pageWidth, pageHeight) => {
  const { margins, footerHeight } = PDF_CONFIG;
  
  try {
    // Add footer line
    try {
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
    } catch (e) {
      // console.log('setDrawColor/setLineWidth not available, using default'); // Removed
    }
    
    doc.line(margins.left, pageHeight - margins.bottom - footerHeight, pageWidth - margins.right, pageHeight - margins.bottom - footerHeight);
    
    // Footer text
    doc.setFontSize(8);
    try {
      doc.setTextColor(107, 114, 128);
    } catch (e) {
      // console.log('setTextColor not available, using default'); // Removed
    }
    
    doc.text('Generated by Braziconnect Portal System', margins.left, pageHeight - margins.bottom - 10);
    doc.text(`Total records: ${getTotalRecords()}`, pageWidth - margins.right - 50, pageHeight - margins.bottom - 10);
  } catch (error) {
    console.error('Error in generateFooter:', error);
    // Fallback: just add basic footer text
    doc.setFontSize(8);
    doc.text('Generated by Braziconnect Portal System', margins.left, pageHeight - margins.bottom - 10);
  }
};

/**
 * Prepare table data for PDF export
 * Handles special formatting for different data types
 */
const prepareTableDataForPDF = (tableData, columns) => {
  try {
    const result = tableData.map((row, rowIndex) => {
      return columns.map((col, colIndex) => {
        try {
          const value = row[col.key];
          
          // Handle special formatting
          if (col.key === 'status' || col.key === 'priority' || col.key === 'demand') {
            return formatStatusValue(value);
          }
          
          if (col.key === 'percentage') {
            return `${value}%`;
          }
          
          if (col.key === 'monthlyRate' && value !== 'Not specified') {
            return value; // Already formatted in the data preparation
          }
          
          // Handle long text by truncating
          if (typeof value === 'string' && value.length > 50) {
            return value.substring(0, 47) + '...';
          }
          
          return value || 'N/A';
        } catch (colError) {
          console.error(`Error processing column ${col.key} at row ${rowIndex}, col ${colIndex}:`, colError);
          return 'Error';
        }
      });
    });
    
    return result;
  } catch (error) {
    console.error('Error in prepareTableDataForPDF:', error);
    throw error;
  }
};



/**
 * Format status values for better readability
 */
const formatStatusValue = (value) => {
  if (!value) return 'N/A';
  
  const statusMap = {
    'Active': 'Active',
    'Inactive': 'Inactive',
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'urgent': 'Urgent',
    'high': 'High',
    'normal': 'Normal',
    'low': 'Low',
    'High': 'High',
    'Medium': 'Medium',
    'Low': 'Low'
  };
  
  return statusMap[value] || value;
};

/**
 * Get report title for display
 */
const getReportTitle = (reportType) => {
  const titles = {
    'job-seekers': 'Job Seekers Report',
    'employer-requests': 'Employer Requests Report',
    'categories': 'Job Categories Report',
    'locations': 'Location Distribution Report',
    'skills': 'Skills Analysis Report'
  };
  
  return titles[reportType] || 'Table Report';
};

/**
 * Get total records count (placeholder - will be updated)
 */
let totalRecordsCount = 0;
export const setTotalRecords = (count) => {
  totalRecordsCount = count;
};

const getTotalRecords = () => {
  return totalRecordsCount;
};

/**
 * Export PDF to file
 */
export const exportPDFToFile = (doc, filename) => {
  try {
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error saving PDF:', error);
    return false;
  }
};

/**
 * Test function to create a simple PDF for debugging
 */
export const createTestPDF = () => {
  try {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Add simple text using jsPDF v3 API
    doc.setFontSize(16);
    doc.text('Test PDF Generation', 20, 20);
    
    // Create a simple manual table using jsPDF v3 API
    const startY = 40;
    const rowHeight = 10;
    const colWidths = [50, 80, 60];
    
    // Draw table headers
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    // Draw header rectangles
    doc.rect(20, startY, colWidths[0], rowHeight);
    doc.rect(20 + colWidths[0], startY, colWidths[1], rowHeight);
    doc.rect(20 + colWidths[0] + colWidths[1], startY, colWidths[2], rowHeight);
    
    // Add header text
    doc.text('Name', 25, startY + 7);
    doc.text('Email', 25 + colWidths[0], startY + 7);
    doc.text('Phone', 25 + colWidths[0] + colWidths[1], startY + 7);
    
    // Draw table data
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    // Use actual data if provided, otherwise show message
    if (tableData && tableData.length > 0) {
      tableData.forEach((row, index) => {
        const y = startY + (index + 1) * rowHeight;
        
        // Draw cell rectangles
        doc.rect(20, y, colWidths[0], rowHeight);
        doc.rect(20 + colWidths[0], y, colWidths[1], rowHeight);
        doc.rect(20 + colWidths[0] + colWidths[1], y, colWidths[2], rowHeight);
        
        // Add cell text - ensure data exists
        const name = row.name || row.firstName || row.title || 'N/A';
        const email = row.email || 'N/A';
        const phone = row.phone || row.contactNumber || 'N/A';
        
        doc.text(name, 25, y + 7);
        doc.text(email, 25 + colWidths[0], y + 7);
        doc.text(phone, 25 + colWidths[0] + colWidths[1], y + 7);
      });
    } else {
      // Show no data message
      const y = startY + rowHeight;
      doc.rect(20, y, colWidths[0] + colWidths[1] + colWidths[2], rowHeight);
      doc.text('No data available', 25, y + 7);
    }
    
    return doc;
  } catch (error) {
    console.error('Error creating test PDF:', error);
    throw error;
  }
};

/**
 * Export data as CSV file
 */
export const exportToCSV = (tableData, columns, filename) => {
  try {
    // Create CSV header
    const headers = columns.map(col => col.label).join(',');
    
    // Create CSV rows
    const rows = tableData.map(row => {
      return columns.map(col => {
        const value = row[col.key];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',');
    });
    
    // Combine header and rows
    const csvContent = [headers, ...rows].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return false;
  }
};

/**
 * Export data as Excel file (XLSX format)
 * Note: This creates a simple HTML table that Excel can open
 */
export const exportToExcel = (tableData, columns, filename) => {
  try {
    // Create HTML table
    let html = '<table border="1">';
    
    // Add header row
    html += '<tr>';
    columns.forEach(col => {
      html += `<th style="background-color: #3b82f6; color: white; padding: 8px; text-align: center; font-weight: bold;">${col.label}</th>`;
    });
    html += '</tr>';
    
    // Add data rows
    tableData.forEach(row => {
      html += '<tr>';
      columns.forEach(col => {
        const value = row[col.key] || '';
        html += `<td style="padding: 6px; border: 1px solid #e5e7eb;">${value}</td>`;
      });
      html += '</tr>';
    });
    
    html += '</table>';
    
    // Create and download file
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.replace('.xlsx', '.html'));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting Excel:', error);
    return false;
  }
};
