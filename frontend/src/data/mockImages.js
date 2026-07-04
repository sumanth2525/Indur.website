/** Free stock photos (Pexels) — Indian-style flats & homes for MVP mock listings. */
const pexels = (id, w = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&dpr=2`

export const MOCK_IMAGES = {
  /** Compact 1BHK — single bedroom flats */
  bhk1: [
    pexels(271816),
    pexels(1873921),
    pexels(5824527),
  ],
  /** 2BHK — living + 2 bedrooms, Indian apartment feel */
  bhk2: [
    pexels(1571460),
    pexels(1643383),
    pexels(4307963),
    pexels(186077),
  ],
  /** 3BHK — spacious flats & gated community */
  bhk3: [
    pexels(1457842),
    pexels(276724),
    pexels(262405),
    pexels(323705),
  ],
  land: [
    pexels(1118448),
    pexels(713833),
  ],
  agriculture: [
    pexels(956491),
    pexels(1108099),
    pexels(265216),
    pexels(288621),
  ],
  villa: [
    pexels(106399),
    pexels(1396122),
  ],
}

export const DEFAULT_PROPERTY_IMAGE = MOCK_IMAGES.bhk2[0]

export function imagesForBedrooms(bedrooms, type = 'apartment') {
  if (type === 'agriculture') return MOCK_IMAGES.agriculture
  if (type === 'land') return MOCK_IMAGES.land
  if (bedrooms >= 3) return MOCK_IMAGES.bhk3
  if (bedrooms === 2) return MOCK_IMAGES.bhk2
  if (bedrooms === 1) return MOCK_IMAGES.bhk1
  return MOCK_IMAGES.bhk2
}

/** Cycle through mock photos when user uploads in Post Ad demo flow */
export const POST_AD_PLACEHOLDERS = [
  ...MOCK_IMAGES.bhk2.slice(0, 2),
  ...MOCK_IMAGES.bhk3.slice(0, 2),
]
