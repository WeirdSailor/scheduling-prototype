// Unit data types
export type FuelType = 'Gas' | 'Coal' | 'Wind' | 'Solar' | 'Nuclear' | 'Hydro';

export interface UnitData {
  UnitName: string;
  FuelType: FuelType;
  FPN: number;
  MEL: number;
  SEL: number;
  NDZ: number;
  MNZT: number;
  MZT: number;
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
export type FontWeight = 'normal' | 'bold';
export type ColumnWidth = 'Narrow' | 'Medium' | 'Wide';
export type BackgroundTheme = 'Midnight Slate' | 'Tactical Black' | 'Deep Blue';
export type TextTheme = 'Pure White' | 'Modern White' | 'Dual-Tone Amber' | 'Digital Green';

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
