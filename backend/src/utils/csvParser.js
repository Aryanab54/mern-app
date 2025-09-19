'use strict';

const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const XLSX = require('xlsx');

class CSVParser {
  async parseFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.csv') {
      return this.parseCSV(filePath);
    } else if (ext === '.xlsx' || ext === '.xls') {
      return this.parseExcel(filePath);
    } else {
      throw new Error('Unsupported file format');
    }
  }

  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true, trim: true }))
        .on('data', (row) => {
          // Validate required fields
          if (row.FirstName && row.Phone) {
            results.push({
              firstName: row.FirstName.trim(),
              phone: row.Phone.trim(),
              notes: row.Notes ? row.Notes.trim() : ''
            });
          }
        })
        .on('end', () => {
          if (results.length === 0) {
            reject(new Error('No valid data found in CSV file'));
          } else {
            resolve(results);
          }
        })
        .on('error', (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        });
    });
  }

  async parseExcel(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const results = jsonData
        .filter(row => row.FirstName && row.Phone)
        .map(row => ({
          firstName: String(row.FirstName).trim(),
          phone: String(row.Phone).trim(),
          notes: row.Notes ? String(row.Notes).trim() : ''
        }));

      if (results.length === 0) {
        throw new Error('No valid data found in Excel file');
      }

      return results;
    } catch (error) {
      throw new Error(`Excel parsing error: ${error.message}`);
    }
  }

  distributeLeads(leads, agentCount = 5) {
    const distribution = Array.from({ length: agentCount }, () => []);
    
    leads.forEach((lead, index) => {
      const agentIndex = index % agentCount;
      distribution[agentIndex].push(lead);
    });

    return distribution;
  }
}

module.exports = new CSVParser();