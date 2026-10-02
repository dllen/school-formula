import { REFERENCE_TABLES } from '../../data/reference';
import { EN, localizedPath } from '../../i18n/languages';
import { ReferenceLayout } from './ReferenceLayout';

/** `/en/` — the English landing page listing every printable reference chart. */
export function ReferenceIndex() {
  return (
    <ReferenceLayout>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2329]">Printable Study Reference</h1>
        <p className="mt-2 max-w-2xl text-[#646A73]">
          Free, printable reference charts for students, parents and teachers — multiplication
          tables, roots, trigonometric identities, physics constants, metric conversions and
          irregular verbs. Open a chart and print it in one click.
        </p>
      </section>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REFERENCE_TABLES.map((table) => (
          <li key={table.slug}>
            <a
              href={localizedPath(EN, `/reference/${table.slug}`)}
              className="flex h-full flex-col bg-white rounded-2xl border border-[#F0F1F2] shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <span className="inline-block self-start px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-3">
                {table.category}
              </span>
              <h2 className="text-lg font-bold text-[#1F2329]">{table.title}</h2>
              <p className="mt-2 text-sm text-[#646A73]">{table.summary}</p>
            </a>
          </li>
        ))}
      </ul>
    </ReferenceLayout>
  );
}
