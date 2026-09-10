export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-6 bg-studio px-6 py-24 text-center">
      <span className="font-display text-lg font-semibold text-white">911 Carrera</span>
      <p className="max-w-md text-sm text-steel-500">
        Specifications shown are illustrative of the Carrera range and vary by market and configuration.
      </p>
      <div className="chapter-eyebrow flex gap-8 text-steel-500">
        <span>Models</span>
        <span>Configurator</span>
        <span>Heritage</span>
        <span>Press</span>
      </div>
    </footer>
  );
}
