// Unit data types
export type FuelType = 'Gas' | 'Coal' | 'Wind' | 'Solar' | 'Nuclear' | 'Hydro';
export type Zone = 'NORT' | 'NORTH WIND' | 'SOUTH' | 'SOUTH WIND' | 'SMALL BMU' | 'BATTERY';

export type PriceDirection = 'up' | 'down' | null;

export interface UnitData {
  UnitName: string;
  FPN: number;
  MEL: number;
  SEL: number;
  NDZ: number;
  MNZT: number;
  MZT: number;
  Price: number;
  PriceDirection: PriceDirection;
  Zone: Zone;
  FuelType: FuelType;
}

// Styling configuration types
export type FontOption =
  | 'Inter'
  | 'Roboto'
  | 'Hind'
  | 'Open Sans'
  | 'Roboto Condensed'
  | 'IBM Plex Sans'
  | 'JetBrains Mono';

export type VerticalSpacing = 'Small' | 'Medium' | 'Large';
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type ColumnWidth = 'Narrow' | 'Medium' | 'Wide';
export type BackgroundTheme = 'Midnight Slate' | 'Tactical Black' | 'Deep Blue';
export type TextTheme = 'Pure White' | 'Modern White' | 'Yellow' | 'Dual-Tone Amber' | 'Light Green';

export interface StylingConfig {
  activeFont: FontOption;
  fontSize: number;
  fontWeight: FontWeight;
  verticalSpacing: VerticalSpacing;
  zoomLevel: number;
  showGridLines: boolean;
  columnWidthOption: ColumnWidth;
  backgroundTheme: BackgroundTheme;
  textTheme: TextTheme;
}

export interface StylingActions {
  setActiveFont: (font: FontOption) => void;
  setFontSize: (size: number) => void;
  setFontWeight: (weight: FontWeight) => void;
  setVerticalSpacing: (spacing: VerticalSpacing) => void;
  setZoomLevel: (level: number) => void;
  setShowGridLines: (show: boolean) => void;
  setColumnWidthOption: (width: ColumnWidth) => void;
  setBackgroundTheme: (theme: BackgroundTheme) => void;
  setTextTheme: (theme: TextTheme) => void;
}
