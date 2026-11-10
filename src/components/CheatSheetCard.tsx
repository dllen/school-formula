import React from 'react';
import type { CheatSheet } from '../data/cheatsheets';

interface CheatSheetCardProps {
    cheatsheet: CheatSheet;
}

/**
 * 速查表详情：标题块 + 一张真正的数据表，打印是这里唯一的主动作。
 * 页面没有外层卡片，表格本身就是唯一的容器。
 */
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
              font-variant-numeric: tabular-nums;
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
              th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
        <article className="pt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <h1 className="text-display font-semibold leading-tight tracking-tight text-ink">
                            {cheatsheet.title}
                        </h1>
                        <span className="tag">{cheatsheet.category}</span>
                    </div>
                    <p className="mt-2 max-w-2xl text-body-s text-ink-2">{cheatsheet.description}</p>
                </div>
                <button type="button" onClick={handlePrint} className="btn btn-primary">
                    打印
                </button>
            </div>

            <div className="mt-8 overflow-x-auto">
                <table className="table-basic [&_td]:px-2 [&_th]:px-2 sm:[&_td]:px-3 sm:[&_th]:px-3">
                    {cheatsheet.table.headers && (
                        <thead>
                            <tr>
                                {cheatsheet.table.headers.map((header, idx) => (
                                    <th key={idx} scope="col">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody>
                        {cheatsheet.table.rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                {row.map((cell, cellIdx) => (
                                    <td key={cellIdx} className={cellIdx === 0 ? 'whitespace-nowrap' : undefined}>
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </article>
    );
};
