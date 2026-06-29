'use client';

import React, { useState } from 'react';
import Papa, { ParseResult } from 'papaparse';

export default function CsvConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleConversion = () => {
    if (!file) return;
    setIsProcessing(true);

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (results: ParseResult<string[]>) => {
        const rows = results.data;

        // Join columns with a pipe (|) and rows with a newline (\n)
        const datContent = rows
          .map((row) => row.join('|'))
          .join('\n');

        triggerDownload(datContent);
      },
      error: (err: Error) => {
        console.error('Parsing error:', err);
        alert('Error parsing CSV file.');
        setIsProcessing(false);
      }
    });
  };

  const triggerDownload = (content: string) => {
    if (!file) return;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    
    const newFileName = file.name.replace('.csv', '.dat');
    link.setAttribute('download', newFileName);
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsProcessing(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">CSV to .DAT Converter</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-600 mb-2">Choose CSV File</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 
            file:mr-4 file:py-2.5 file:px-4 
            file:rounded-xl file:border-0 
            file:text-sm file:font-semibold 
            file:bg-indigo-50 file:text-indigo-700 
            hover:file:bg-indigo-100 transition-all cursor-pointer"
        />
      </div>

      <button
        onClick={handleConversion}
        disabled={!file || isProcessing}
        className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all shadow-md ${
          !file || isProcessing
            ? 'bg-gray-300 shadow-none cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
        }`}
      >
        {isProcessing ? 'Converting...' : 'Convert & Download .DAT'}
      </button>
    </div>
  );
}