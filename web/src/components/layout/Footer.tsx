export function Footer() {
  return (
    // bg-primary coincide exactamente con el Header
    <footer className="w-full py-8 mt-12 border-t border-secondary/20 bg-primary/95">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
        {/* Nombre del local */}
        <h2 className="font-heading text-lg font-bold text-secondary uppercase tracking-widest opacity-90">
          American Way
        </h2>
        
        {/* Copyright - un poquito más claro para que resalte en el fondo primary */}
        <p className="text-white/70 text-xs font-sans text-center">
          © {new Date().getFullYear()} American Way. Todos los derechos reservados.
        </p>
        
        {/* Créditos */}
        <p className="text-secondary/50 text-[10px] uppercase tracking-tighter">
          Powered by AFdevelopers
        </p>
      </div>
    </footer>
  );
}