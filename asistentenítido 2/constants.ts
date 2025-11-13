import type { FormData } from './types';

export const initialFormData: FormData = {
  venueType: 'indoor',
  venueWidth: 10,
  venueLength: 15,
  venueHeight: 3,
  acousticProperties: 'neutral',
  guestCount: 100,
  musicStyle: 'electronic-dance',
  dbRestriction: false,
  dbLevel: '',
  discountCode: '',
};

export const MUSIC_STYLES = [
  { value: 'electronic-dance', label: 'Electrónica' },
  { value: 'pop-rock', label: 'Pop / Rock en vivo' },
  { value: 'hip-hop-urban', label: 'Hip-Hop / Urbano' },
  { value: 'acoustic-folk', label: 'Acústico / Folk' },
  { value: 'jazz-blues', label: 'Jazz / Blues' },
  { value: 'speech-conference', label: 'Discursos / Conferencias' },
];

export const VENUE_TYPES = [
    { value: 'indoor', label: 'Interior' },
    { value: 'outdoor', label: 'Exterior' },
];

export const INDOOR_ACOUSTIC_PROPERTIES = [
    { value: 'neutral', label: 'Neutral (Habitación amueblada)' },
    { value: 'reverberant', label: 'Reverberante (Hormigón, vidrio)' },
    { value: 'dampened', label: 'Absorbente (Cortinas, alfombras)' },
];

export const OUTDOOR_ACOUSTIC_PROPERTIES = [
    { value: 'open-space', label: 'Espacio Abierto (Sin obstáculos)' },
    { value: 'urban', label: 'Urbano (Edificios cercanos)' },
    { value: 'natural-absorption', label: 'Natural (Árboles, césped)' },
];

export const EQUIPMENT_PRICES = {
  mainSpeaker: { ideal: 2500, average: 2000, maxDiscount: 1500 },
  subwoofer: { ideal: 3500, average: 3000, maxDiscount: 2300 },
  mixer: { ideal: 2500, average: 2000, maxDiscount: 1500 },
  vinylDeck: { ideal: 2500, average: 2000, maxDiscount: 1500 },
  monitor: { ideal: 2000, average: 2000, maxDiscount: 2000 },
};

export const SHIPPING_COST = 500;
export const OPERATIONAL_COST = 3000;
export const MIXER_4_CHANNEL_ADDITIONAL_COST = 500;

export const WHATSAPP_NUMBER = '59898753539';
