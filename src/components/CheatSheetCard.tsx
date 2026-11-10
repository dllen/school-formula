import React from 'react';
import type { CheatSheet } from '../data/cheatsheets';

interface CheatSheetCardProps {
    cheatsheet: CheatSheet;
}

export const CheatSheetCard: React.FC<CheatSheetCardProps> = ({ cheatsheet }) => {
    const handlePrint = () => {
        // Create a new window with only this cheatsheet
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const tableHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${cheatsheet.title} - 拾艺院</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            :root {
              --print-ink: oklch(0.24 0.012 258);
              --print-ink-2: oklch(0.44 0.014 258);
              --print-rule: oklch(0.85 0.010 258);
              --print-well: oklch(0.955 0.008 258);
            }
            body {
              font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
              color: var(--print-ink);
            }
            h1 {
              font-size: 24px;
              margin-bottom: 8px;
              color: var(--print-ink);
            }
            .description {
              color: var(--print-ink-2);
              margin-bottom: 20px;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid var(--print-rule);
              padding: 8px 12px;
              text-align: left;
            }
            th {
              background-color: var(--print-well);
              font-weight: 600;
              color: var(--print-ink);
            }
            td {
              color: var(--print-ink);
            }
            @media print {
              body { padding: 10px; }
              @page { margin: 15mm; }
            }
          </style>
        </head>
        <body>
          <h1>${cheatsheet.title}</h1>
          <p class="description">${cheatsheet.description}</p>
          <table>
            ${cheatsheet.table.headers ? `
              <thead>
                <tr>
                  ${cheatsheet.table.headers.map(h => `<th>${h}</th>`).join('')}
                </tr>
              </thead>
            ` : ''}
            <tbody>
              ${cheatsheet.table.rows.map(row => `
                <tr>
                  ${row.map(cell => `<td>${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = () => {
              window.print();
              // Close window after print dialog is closed (optional)
              // window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `;

        printWindow.document.write(tableHTML);
        printWindow.document.close();
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[divider] overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-[divider] bg-accent-soft">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[ink]">{cheatsheet.title}</h3>
                    <span className="px-3 py-1 bg-accent-soft text-[accent] text-xs font-medium rounded-full">
                        {cheatsheet.category}
                    </span>
                </div>
                <p className="text-sm text-[ink-2]">{cheatsheet.description}</p>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        {cheatsheet.table.headers && (
                            <thead>
                                <tr className="bg-[paper-2]">
                                    {cheatsheet.table.headers.map((header, idx) => (
                                        <th
                                            key={idx}
                                            className="border border-[rule] px-3 py-2 text-left font-semibold text-[ink]"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {cheatsheet.table.rows.map((row, rowIdx) => (
                                <tr key={rowIdx} className="hover:bg-[accent-soft]/30 transition-colors">
                                    {row.map((cell, cellIdx) => (
                                        <td
                                            key={cellIdx}
                                            className="border border-[rule] px-3 py-2 text-[ink]"
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-[accent] text-white rounded-lg hover:bg-[accent-hover] transition-colors font-medium text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        打印
                    </button>
                </div>
            </div>
        </div>
    );
};
