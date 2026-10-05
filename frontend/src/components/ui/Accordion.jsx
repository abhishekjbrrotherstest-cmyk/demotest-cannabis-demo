import { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';

function AccordionItem({ item, isOpen, onToggle, index }) {
  const headingId = `acc-h-${item.id ?? index}`;
  const panelId = `acc-p-${item.id ?? index}`;
  return (
    <div className="border-b border-brand-100 last:border-b-0">
      <h3>
        <button
          type="button"
          id={headingId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-brand-50/60 sm:px-7"
        >
          <span className={`text-base font-semibold sm:text-lg ${isOpen ? 'text-brand-700' : 'text-brand-800'}`}>
            {item.question || item.title}
          </span>
          <span
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
              isOpen
                ? 'rotate-180 border-brand-700 bg-brand-700 text-cream'
                : 'border-brand-200 text-brand-700'
            }`}
            aria-hidden="true"
          >
            <ChevronDown className="h-4 w-4" />
          </span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={headingId} hidden={!isOpen} className="px-5 pb-6 sm:px-7">
        <p className="max-w-3xl text-sm leading-relaxed text-brand-700/80">{item.answer || item.content}</p>
      </div>
    </div>
  );
}

export default function Accordion({ items = [], allowMultiple = true }) {
  const [open, setOpen] = useState([]);
  const uid = useId().replace(/:/g, '');

  const toggle = (id) => {
    setOpen((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div className="card-base divide-y divide-brand-100">
      {items.map((item, i) => {
        const id = item.id ?? `${uid}-${i}`;
        return <AccordionItem key={id} item={item} index={i} isOpen={open.includes(id)} onToggle={() => toggle(id)} />;
      })}
    </div>
  );
}