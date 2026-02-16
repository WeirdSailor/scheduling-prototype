import type { UnitData, FuelType, Zone, PriceDirection } from '../types';

const CELESTIAL_NAMES = [
  'ALPHA', 'BETEL', 'CASSI', 'CYGNU', 'DENEB', 'ERIDN', 'FOMAL', 'GACRU', 'HADAR', 'JUPIT',
  'KRAUS', 'LUPUS', 'MAIAS', 'NEBOS', 'ORION', 'PHOEN', 'QUASA', 'RIGEL', 'SIRIU', 'TAURI',
  'URSAJ', 'VEGAX', 'WASPJ', 'XENON', 'YAVIN', 'ZENIT', 'ANDRO', 'AURIG', 'BOOTE', 'CENTA',
  'DRACO', 'GEMIN', 'HYDRA', 'LEOXI', 'LYRAE', 'MONOC', 'NORMA', 'OPHIU', 'PISCS', 'SAGIT',
  'SCORP', 'TAURU', 'VIRGO', 'VOLAN', 'AQUIL', 'CAPRI', 'CRUXA', 'DELPH', 'FORNA', 'INDUS',
  'PISCS', 'SAGIT', 'SCORP', 'TAURU', 'VIRGO', 'VOLAN', 'AQUIL', 'CAPRI', 'CRUXA', 'DELPH',
  'FORNA', 'INDUS', 'JUNO1', 'VESTA', 'CERES', 'PALLA', 'HYGIA', 'ASTRA', 'HEBEA', 'IRISU',
  'FLORA', 'METIS', 'EUNOM', 'PSYCH', 'THETI', 'LEDAA', 'NIOBE', 'EUGEN', 'POMON', 'THEMI',
  'PHOCN', 'DAPHN', 'ISONE', 'EUTER', 'BELLN', 'AMPHI', 'URANJ', 'NEPTN', 'PLUTO', 'TITAN',
];

const FUEL_TYPES: FuelType[] = ['Gas', 'Coal', 'Wind', 'Solar', 'Nuclear', 'Hydro'];
const ZONES: Zone[] = ['NORT', 'NORTH WIND', 'SOUTH', 'SOUTH WIND', 'SMALL BMU', 'BATTERY'];

function generateUnitName(baseName: string, index: number): string {
  const longBaseName = baseName.padEnd(7, 'X');
  const numSuffix = index % 3 === 0 ? '' : `-${(index % 2) + 1}`;
  const primaryPart = longBaseName.substring(0, 5).toUpperCase();
  const secondaryPart =
    numSuffix.length === 0 && longBaseName.length >= 7
      ? longBaseName.substring(5, 7).toUpperCase()
      : '';
  return `${primaryPart}${secondaryPart}${numSuffix}`;
}

function generateRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSampleData(count: number = 100): UnitData[] {
  return Array.from({ length: count }).map((_, i) => {
    const baseName = CELESTIAL_NAMES[i % CELESTIAL_NAMES.length];
    const unitName = generateUnitName(baseName, i);
    const fpn = generateRandomValue(100, 2000);
    const ndz = generateRandomValue(10, 120);
    const mnzt = generateRandomValue(5, 60);

    // About 25% chance of having a price direction arrow
    let priceDirection: PriceDirection = null;
    if (Math.random() < 0.25) {
      priceDirection = Math.random() < 0.5 ? 'up' : 'down';
    }

    return {
      UnitName: unitName,
      FPN: fpn,
      MEL: fpn + generateRandomValue(50, 300),
      SEL: fpn + generateRandomValue(20, 150),
      NDZ: ndz,
      MNZT: mnzt,
      MZT: generateRandomValue(1, Math.min(mnzt - 1, ndz - 1)),
      Price: generateRandomValue(45, 236),
      PriceDirection: priceDirection,
      Zone: ZONES[generateRandomValue(0, ZONES.length - 1)],
      FuelType: FUEL_TYPES[i % FUEL_TYPES.length],
    };
  });
}

export const DEMAND_FORECAST = 35000;
