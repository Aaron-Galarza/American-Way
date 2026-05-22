import { Store, AlertOctagon } from 'lucide-react';

interface StoreClosedProps {
  message?: string;
}

export const StoreClosed = ({ message }: StoreClosedProps) => {
  return (
    <section className="mb-6 flex animate-in flex-col gap-4 rounded-2xl border border-secondary/28 bg-primary/70 p-4 shadow-lg fade-in duration-300 sm:flex-row sm:items-start">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-secondary/45 bg-secondary/15 text-secondary">
        <AlertOctagon className="h-6 w-6" />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-heading text-xl font-bold text-secondary">El local se encuentra cerrado</h3>
        <p className="mt-1 text-sm text-white/85">
          {message || 'En este momento no estamos tomando pedidos. Podes mirar el menu y preparar tu orden.'}
        </p>
      </div>

      <div className="hidden shrink-0 text-secondary/35 sm:block">
        <Store className="h-10 w-10" />
      </div>
    </section>
  );
};
