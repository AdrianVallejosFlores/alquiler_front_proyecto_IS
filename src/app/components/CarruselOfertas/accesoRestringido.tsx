import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AccesoRestringidoProps {
  servicioNombre?: string | null;
  servicioId?: string | null;
  onClose?: () => void;
  isModal?: boolean;
}

export default function AccesoRestringido({ 
}: AccesoRestringidoProps) {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a /fixers inmediatamente
    router.push('/fixers');
  }, [router]);

  // Mostrar solo un loader breve
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-t from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700">Redirigiendo...</p>
      </div>
    </div>
  );
}