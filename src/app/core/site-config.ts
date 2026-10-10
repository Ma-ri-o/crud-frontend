export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption: string;
}

export interface VideoItem {
  youtubeId: string;
  title: string;
}

export interface Testimonial {
  name: string;
  event: string;
  comment: string;
}

const qrTarget = 'https://wa.me/525515333499';
const facebookUrl = 'https://www.facebook.com/search/top/?q=Mariachi%20Mexican%C3%ADsimo';
const youtubeUrl = 'https://www.youtube.com/results?search_query=Mariachi+Mexican%C3%ADsimo+Estado+de+M%C3%A9xico';

export const SITE_CONFIG = {
  name: 'Mariachi Mexicanísimo',
  slogan: 'La voz de tus mejores momentos',
  description: 'Serenatas, bodas, cumpleaños, XV años, bautizos, aniversarios y eventos empresariales con mariachi profesional en Chalco, Cocotitlán, Valle de Chalco, Ixtapaluca, Los Reyes y la Zona Oriente del Estado de México. Solicita tu cotización por WhatsApp.',
  keywords: [
    'mariachi en Chalco',
    'mariachi en Cocotitlán',
    'mariachi en Valle de Chalco',
    'mariachi en Ixtapaluca',
    'mariachi en Los Reyes La Paz',
    'mariachi Zona Oriente Estado de México',
    'serenata, mariachi para bodas y XV años',
  ],
  phone: '5515333499',
  whatsappNumber: '525515333499',
  attendant: 'Sr. Ray S.',
  serviceArea: 'Zona Oriente del Estado de México',
  serviceAreas: ['Chalco', 'Cocotitlán', 'Valle de Chalco', 'Ixtapaluca', 'Los Reyes', 'Zona Oriente del Estado de México'],
  facebookUrl,
  youtubeUrl,
  qrTarget,
  qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(qrTarget)}`,
  eventTypes: ['Serenata', 'Boda', 'XV años', 'Cumpleaños', 'Bautizo', 'Aniversario', 'Pedida de mano', 'Evento empresarial', 'Otro'],
  municipalities: [
    'Chalco',
    'Cocotitlán',
    'Valle de Chalco',
    'Ixtapaluca',
    'Los Reyes La Paz',
    'Nezahualcóyotl',
    'Chimalhuacán',
    'Texcoco',
    'Otro municipio',
  ],
  benefits: [
    'Atención personalizada',
    'Cotización sin compromiso',
    'Puntualidad para tu evento',
    'Repertorio amplio',
    'Eventos sociales y empresariales',
  ],
  services: [
    { title: 'Serenatas', icon: '♫', description: 'Una sorpresa musical para dedicar con el corazón.' },
    { title: 'Bodas', icon: '♡', description: 'Celebren su historia con música mexicana en vivo.' },
    { title: 'XV años', icon: '✦', description: 'Un momento especial para una noche inolvidable.' },
    { title: 'Cumpleaños', icon: '✧', description: 'Festejen en familia con canciones para cantar juntos.' },
    { title: 'Bautizos', icon: '❀', description: 'Un acompañamiento cálido para compartir en familia.' },
    { title: 'Aniversarios', icon: '∞', description: 'Celebren los recuerdos y el camino que comparten.' },
    { title: 'Pedidas de mano', icon: '♥', description: 'Una serenata especial para hacer la gran pregunta.' },
    { title: 'Eventos empresariales', icon: '♬', description: 'Un toque mexicano para recibir a tus invitados.' },
  ] satisfies ServiceItem[],
  galleryPhotos: [
    { src: '/images/mariachi/serenata-escenario.jpeg', alt: 'Cantante de mariachi durante una serenata en un escenario decorado.', caption: 'Serenatas que emocionan' },
    { src: '/images/mariachi/mariachi-formacion.jpeg', alt: 'Mariachi Mexicanísimo en formación con sus instrumentos.', caption: 'Tradición en cada evento' },
    { src: '/images/mariachi/evento-salon.jpeg', alt: 'El mariachi ameniza una celebración en un salón con invitados.', caption: 'Música para celebrar' },
    { src: '/images/mariachi/evento-exterior.jpeg', alt: 'Mariachi tocando en un evento al aire libre.', caption: 'Momentos para recordar' },
    { src: '/images/mariachi/grupo-mariachi.jpeg', alt: 'Integrantes de Mariachi Mexicanísimo reunidos después de una presentación.', caption: 'Conoce a los músicos' },
    { src: '/images/mariachi/mariachi-presentacion.jpeg', alt: 'Mariachi con traje de charro ameniza una celebración familiar.', caption: 'Música en vivo para tu evento' },
  ] satisfies GalleryPhoto[],
  videos: [] as VideoItem[],
  testimonials: [] as Testimonial[],
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
