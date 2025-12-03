import PromocionPageClient from './PromocionPage.client';

export default function PromocionPage() {
  // aquí podrías sacar fixerId de un contexto/global si hiciera falta
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <PromocionPageClient />
    </main>
  );
}