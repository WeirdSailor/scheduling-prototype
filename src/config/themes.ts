import type { FontOption, BackgroundTheme, TextTheme, VerticalSpacing, ColumnWidth } from '../types';

export interface FontConfig {
  family: string;
  letterSpacing: string;
  category: string;
}

export const FONTS: Record<FontOption, FontConfig> = {
  'Inter': {
    family: 'Inter, sans-serif',
    letterSpacing: '0.01em',
    category: 'Humanist',
  },
  'Roboto': {
    family: 'Roboto, sans-serif',
    letterSpacing: '-0.01em',
    category: 'Industrial',
  },
  'Hind': {
    family: 'Hind, sans-serif',
    letterSpacing: 'normal',
    category: 'Humanist',
  },
  'Open Sans': {
    family: 'Open Sans, sans-serif',
    letterSpacing: 'normal',
    category: 'Humanist',
  },
  'Roboto Condensed': {
    family: 'Roboto Condensed, sans-serif',
    letterSpacing: '-0.02em',
    category: 'Industrial',
  },
  'IBM Plex Sans': {
    family: 'IBM Plex Sans, sans-serif',
    letterSpacing: 'normal',
    category: 'Technical',
  },
  'JetBrains Mono': {
    family: 'JetBrains Mono, monospace',
    letterSpacing: 'normal',
    category: 'Precision',
  },
};

export interface BackgroundConfig {
  body: string;
  header: string;
}

export const BACKGROUNDS: Record<BackgroundTheme, BackgroundConfig> = {
  'Midnight Slate': {
    body: '#182230',
    header: '#2A3B4E',
  },
  'Tactical Black': {
    body: '#080808',
    header: '#181818',
  },
  'Deep Blue': {
    body: '#0B1420',
    header: '#1A2634',
  },
};

export interface TextThemeConfig {
  hex: string;
  foregroundColor: string;
  cssClass?: string;
}

export const TEXT_THEMES: Record<TextTheme, TextThemeConfig> = {
  'Pure White': {
    hex: '#FFFFFF',
    foregroundColor: '#FFFFFF',
  },
  'Modern White': {
    hex: '#E6EDF3',
    foregroundColor: '#E6EDF3',
  },
  'Dual-Tone Amber': {
    hex: '#FFB000',
    foregroundColor: '#E6EDF3',
    cssClass: 'text-theme-amber',
  },
  'Digital Green': {
    hex: '#4AF626',
    foregroundColor: '#4AF626',
    cssClass: 'text-theme-green',
  },
};

export const ROW_HEIGHTS: Record<VerticalSpacing, number> = {
  'Small': 20,
  'Medium': 24,
  'Large': 30,
};

export const COLUMN_WIDTH_BUFFERS: Record<ColumnWidth, number> = {
  'Narrow': 40,  // 5 * 8px average char width
  'Medium': 64,  // 8 * 8px
  'Wide': 80,    // 10 * 8px
};

export const FONT_SIZES = [8, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22] as const;

export const ZOOM_LEVELS = [
  { value: 0.70, label: 'Zoom Out (70%)' },
  { value: 0.85, label: 'Zoom Out (85%)' },
  { value: 1.0, label: 'Normal (100%)' },
  { value: 1.15, label: 'Zoom In (115%)' },
  { value: 1.30, label: 'Zoom In (130%)' },
  { value: 1.45, label: 'Zoom In (145%)' },
  { value: 1.60, label: 'Zoom In (160%)' },
] as const;
