import { useParams } from 'react-router-dom';
import { AdUnit } from '../../ads/AdUnit';
import { getReferenceTable } from '../../data/reference';
import { EN, localizedPath } from '../../i18n/languages';

const ENGLISH_HOME = localizedPath(EN);
import { PrintButton } from './PrintButton';
import { ReferenceLayout } from './ReferenceLayout';

/** `/en/reference/:slug` — a single printable reference chart. */
export function ReferencePage() {
  const { slug } = useParams<{ slug: string }>();
  const table = slug ? getReferenceTable(slug) : undefined;

  if (!table) {
    return (
      <ReferenceLayout>
        <h1 className="text-2xl font-bold text-[#1F2329]">Chart not found</h1>
        <a href={ENGLISH_HOME} className="mt-4 inline-block text-[#3370FF] hover:underline">
          ← All reference charts
        </a>
      </ReferenceLayout>
    );
  }

  return (
    <ReferenceLayout>
      <a href={ENGLISH_HOME} className="text-sm text-[#646A73] hover:text-[#1F2329] transition-colors">
        ← All reference charts
      </a>

      <div className="mt-4 bg-white rounded-2xl border border-[#F0F1F2] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F0F1F2] bg-gradient-to-r from-blue-50 to-white flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2329]">{table.title}</h1>
            <p className="mt-1 text-sm text-[#646A73]">{table.description}</p>
          </div>
          <span className="shrink-0 px-3 py-1 bg-blue-100 text-[#3370FF] text-xs font-medium rounded-full">
            {table.category}
          </span>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              {table.headers && (
                <thead>
                  <tr className="bg-[#F5F6F7]">
                    {table.headers.map((header, index) => (
                      <th
                        key={index}
                        className="border border-[#E5E6EB] px-3 py-2 text-left font-semibold text-[#1F2329]"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {table.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-[#E1EAFF]/30 transition-colors">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-[#E5E6EB] px-3 py-2 text-[#1F2329]">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <PrintButton />
          </div>
        </div>
      </div>

      <AdUnit placement="referenceBottom" />
    </ReferenceLayout>
  );
}
