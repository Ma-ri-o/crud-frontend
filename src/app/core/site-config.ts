/** Datos públicos de negocio. Actualiza este objeto al cambiar canales de contacto. */
const qrTarget = 'https://wa.me/525515333499';

export const SITE_CONFIG = {
  name: 'Mariachi Mexicanísimo',
  slogan: 'La voz de tus mejores momentos',
  phone: '5515333499',
  whatsappNumber: '525515333499',
  attendant: 'Sr. Ray S.',
  serviceArea: 'Zona Oriente del Estado de México',
  facebookUrl: 'https://www.facebook.com/search/top/?q=Mariachi%20Mexican%C3%ADsimo',
  youtubeUrl: 'https://www.youtube.com/results?search_query=Mariachi+Mexican%C3%ADsimo',
  // Sustituye el valor por el QR de marca (en public/images/qr-whatsapp.png).
  qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(qrTarget)}`,
  qrTarget,
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
