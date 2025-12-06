'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';

// -------------------------
// TIPOS
// -------------------------
type MockOffer = {
  id: number;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  status: 'active' | 'inactive';
  images: string[];
  promotion?: string;
  contact: {
    whatsapp?: string;
  };
};

// -------------------------
// PROMOCIONES MOCK (MISMAS DEL CARRUSEL)
// -------------------------
const MOCK_PROMOTIONS = [
  { id: 1, title: '50% de Descuento en Trabajo de Electricista', offerId: 1 },
  { id: 2, title: 'Cotización en obras grandes en Trabajos de Albañileria', offerId: 2 },
  { id: 3, title: '2x1 en Mantenimiento de Jardines', offerId: 3 },
  { id: 4, title: 'Revisión gratuita de fugas de agua', offerId: 4 },
];

// -------------------------
// OFFERS MOCK
// -------------------------
const MOCK_OFFERS: MockOffer[] = [
  {
    id: 1,
    title: 'Trabajo de Electricista',
    description: 'Trabajo profesional de electricista...',
    category: 'Electricidad',
    createdAt: '2025-01-01',
    status: 'active',
    images: ['/electricista.jpg'],
    promotion: MOCK_PROMOTIONS.find(p => p.offerId === 1)?.title,
    contact: { whatsapp: '71456120' },
  },
  {
    id: 2,
    title: 'Trabajo de Albañilería',
    description: 'Obras grandes / ampliaciones...',
    category: 'Albañilería',
    createdAt: '2025-01-02',
    status: 'active',
    images: ['/albañil.jpg'],
    promotion: MOCK_PROMOTIONS.find(p => p.offerId === 2)?.title,
    contact: { whatsapp: '75412345' },
  },
  {
    id: 3,
    title: 'Mantenimiento de Jardines',
    description: 'Servicio completo 2x1...',
    category: 'Jardinería',
    createdAt: '2025-01-03',
    status: 'active',
    images: ['/jardineria.jpg'],
    promotion: MOCK_PROMOTIONS.find(p => p.offerId === 3)?.title,
    contact: { whatsapp: '78945612' },
  },
  {
    id: 4,
    title: 'Revisión fugas de agua',
    description: 'Revisión gratuita de fugas...',
    category: 'Plomería',
    createdAt: '2025-01-04',
    status: 'active',
    images: ['/fugas.JPG'],
    promotion: MOCK_PROMOTIONS.find(p => p.offerId === 4)?.title,
    contact: { whatsapp: '77788899' },
  },
];

// -------------------------
// ESTILOS
// -------------------------
const shellStyles: React.CSSProperties = {
  maxWidth: 960,
  margin: '0 auto',
  padding: '32px 16px 64px',
  display: 'grid',
  gap: 32,
};

const sectionCard: React.CSSProperties = {
  borderRadius: 24,
  border: '1px solid #E5E7EB',
  background: '#FFFFFF',
  padding: 24,
  boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)',
  display: 'grid',
  gap: 28,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 14,
  color: '#6B7280',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

const valueStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  color: '#111827',
  fontWeight: 500,
};

// -------------------------
// COMPONENTE PRINCIPAL
// -------------------------
export default function MockOfferDetail() {
  const { offerId } = useParams<{ offerId: string }>();
  const router = useRouter();

  const [index, setIndex] = React.useState(0);

  const offer = MOCK_OFFERS.find((o) => o.id === Number(offerId));

  if (!offer) {
    return (
      <section style={shellStyles}>
        <p style={{ textAlign: 'center', color: '#B91C1C' }}>
          No se encontró el trabajo solicitado.
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            border: '1px solid #D1D5DB',
            background: '#FFFFFF',
            color: '#2563EB',
            fontWeight: 600,
            padding: '10px 16px',
            borderRadius: 12,
            cursor: 'pointer',
            margin: '0 auto',
          }}
        >
          Volver
        </button>
      </section>
    );
  }

  const hasImages = offer.images.length > 0;
  const isInactive = offer.status === 'inactive';

  const goPrev = () =>
    setIndex((value) => (value - 1 + offer.images.length) % offer.images.length);

  const goNext = () =>
    setIndex((value) => (value + 1) % offer.images.length);

  const paragraphs = offer.description.split(/\n+/).filter(Boolean);

  return (
    <section style={shellStyles}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: '#111827' }} />
            <span style={{ fontSize: 18, fontWeight: 500, color: '#111827' }}>Servineo</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 28, color: '#111827', fontWeight: 600 }}>
            Detalles de la oferta
          </h1>
          <p style={{ margin: '8px 0 0', color: '#6B7280', fontSize: 14 }}>
            Revisa la información completa de la publicación de ejemplo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          style={{
            border: '1px solid #D1D5DB',
            background: '#FFFFFF',
            color: '#1F2937',
            fontWeight: 600,
            padding: '8px 14px',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          Cerrar
        </button>
      </header>

      <div style={sectionCard}>
        {/* ------------------------- */}
        {/* IMAGENES */}
        {/* ------------------------- */}
        <figure style={{ display: 'grid', gap: 16, margin: 0 }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 20,
              overflow: 'hidden',
              background: '#F3F4F6',
              aspectRatio: '16 / 9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {hasImages ? (
              <>
                <img
                  src={offer.images[index]}
                  alt={`Imagen ${index + 1} de ${offer.images.length}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    background: '#111827',
                  }}
                />

                {offer.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Imagen anterior"
                      style={sliderButton({ left: 12 })}
                    >
                      {'<'}
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Imagen siguiente"
                      style={sliderButton({ right: 12 })}
                    >
                      {'>'}
                    </button>

                    <div style={dotWrapper}>
                      {offer.images.map((_, dotIndex) => (
                        <span
                          key={String(dotIndex)}
                          style={{
                            width: dotIndex === index ? 10 : 8,
                            height: dotIndex === index ? 10 : 8,
                            borderRadius: '50%',
                            background: dotIndex === index ? '#2563EB' : '#CBD5F5',
                            transition: 'all .2s ease',
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#6B7280', fontSize: 15 }}>
                Esta oferta no tiene imágenes
              </div>
            )}
          </div>
        </figure>

        {/* ------------------------- */}
        {/* TEXTO GENERAL */}
        {/* ------------------------- */}
        <article style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: 22, color: '#111827', fontWeight: 600 }}>
              {offer.title}
            </h2>
            {isInactive && (
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: '#FDE68A',
                  color: '#92400E',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Caducada
              </span>
            )}
          </div>

          {/* Descripción */}
          <div style={{ display: 'grid', gap: 12, color: '#374151', lineHeight: 1.6 }}>
            {paragraphs.map((paragraph, idx) => (
              <p key={String(idx)} style={{ margin: 0 }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Datos */}
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <span style={labelStyle}>Categoria de servicio</span>
              <p style={valueStyle}>{offer.category}</p>
            </div>

            <div>
              <span style={labelStyle}>Fecha de publicación</span>
              <p style={valueStyle}>
                {new Date(offer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Contacto */}
          <div style={{ display: 'grid', gap: 10 }}>
            <span style={labelStyle}>Información de contacto</span>

            {offer.contact.whatsapp && (
              <span style={{ fontSize: 15 }}>
                <strong style={{ color: '#2563EB' }}>WhatsApp:</strong> {offer.contact.whatsapp}
              </span>
            )}
          </div>

        {/* ------------------------- */}
        {/* PROMOCIÓN (MISMA QUE OFFERS REAL) */}
        {/* ------------------------- */}
        {offer.promotion && (
        <section style={{ display: 'grid', gap: 8, marginTop: 16 }}>

            <span
            style={{
                fontWeight: 700,
                color: '#2563EB',   // azul del sistema original
                fontSize: 24,       // ≈ text-2xl (igual que el real)
                //marginBottom: 4,
                display: 'inline-block',
                //borderBottom: '2px solid #000',  // igual que el original
                paddingBottom: 2,                 // separación igual
            }}
            >
            Promociones:
            </span>

            <div
            style={{
                border: '2px solid #000',
                background: '#FFF',
                padding: '16px',        // p-4
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)', // shadow-sm
            }}
            >
            <p
                style={{
                fontWeight: 700,      // font-bold
                color: '#000',
                fontSize: 18,         // text-lg
                margin: 0,
                }}
            >
                {offer.promotion}
            </p>
            </div>
        </section>
        )}
        </article>

        {/* ------------------------- */}
        {/* BOTONES */}
        {/* ------------------------- */}
        <footer
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              border: '1px solid #D1D5DB',
              background: '#FFFFFF',
              color: '#2563EB',
              fontWeight: 600,
              padding: '10px 16px',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            Volver
          </button>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              style={{
                border: '1px solid #2563EB',
                background: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 600,
                padding: '10px 18px',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              Editar oferta
            </button>

            <button
              type="button"
              style={{
                border: '1px solid #F87171',
                background: '#F87171',
                color: '#FFFFFF',
                fontWeight: 600,
                padding: '10px 18px',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              Eliminar oferta
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}

// -------------------------
// ESTILOS SLIDER
// -------------------------
function sliderButton(position: { left?: number; right?: number }): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.6)',
    background: 'rgba(17,24,39,0.55)',
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 500,
    lineHeight: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    ...position,
  };
}

const dotWrapper: React.CSSProperties = {
  position: 'absolute',
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: 8,
};
