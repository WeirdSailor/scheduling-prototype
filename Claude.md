# Scheduling Prototype - Styling Control System

## Overview

A React + TypeScript prototype for exploring different styling combinations for a power generation dispatch dashboard. Users can preview various typography, color themes, and layout options via a control panel and select the best combination.

## Tech Stack

- **React 19.2.0** with TypeScript
- **Vite 7.3.1** - Build tool and dev server
- **AG Grid 35.1.0** - Data grid component
- **Lucide React** - Icons for fuel type indicators

## Project Structure

```
src/
├── main.tsx                          # Application entry point
├── App.tsx                           # Root component, renders Dashboard
├── App.css                           # Root layout styles
├── index.css                         # Global styles, CSS variables, AG Grid customizations
├── types/
│   └── index.ts                      # TypeScript interfaces (UnitData, StylingConfig, etc.)
├── config/
│   └── themes.ts                     # Font, background, text theme configurations
├── data/
│   └── sampleData.ts                 # Sample data generation (celestial unit names)
└── components/
    ├── Dashboard.tsx                 # Main grid + state management + styling effects
    ├── ColumnVisibilityPanel.tsx     # Side panel with all styling controls
    ├── ColumnVisibilityPanel.module.css  # CSS module for panel styles
    └── FuelTypeCellRenderer.tsx      # Custom cell renderer for fuel type icons
```

## Key Files

### `src/types/index.ts`
TypeScript interfaces for:
- `UnitData` - Row data structure
- `FuelType` - Union type for fuel types
- `StylingConfig` - All styling options grouped
- `StylingActions` - Setter functions for styling

### `src/config/themes.ts`
Configuration constants:
- `FONTS` - Font family, letter-spacing, category for each font option
- `BACKGROUNDS` - Body and header colors for each background theme
- `TEXT_THEMES` - Hex color, foreground color, optional CSS class
- `ROW_HEIGHTS` - Pixel heights for vertical spacing options
- `COLUMN_WIDTH_BUFFERS` - Padding values for column width options
- `FONT_SIZES`, `ZOOM_LEVELS` - Available options

### `src/components/Dashboard.tsx`
Main component containing:
- AG Grid configuration with 9 columns and 100 sample rows
- Styling state and grouped `StylingConfig`/`StylingActions` for panel
- `useEffect` hooks that apply styling changes via CSS custom properties and refs
- Uses `transform: scale()` for cross-browser zoom support

### `src/components/ColumnVisibilityPanel.tsx`
Control panel receiving `styling` and `actions` props:
- Column visibility toggles
- Font selection, size, weight
- Vertical spacing, zoom level
- Grid lines toggle, column width
- Text theme and background colors
- Current settings summary

### `src/index.css`
Global styles including:
- CSS custom properties (`--operator-font`, `--ag-font-weight`, etc.)
- Google Fonts imports
- AG Grid theme overrides
- Text theme classes (`.text-theme-amber`, `.text-theme-green`)
- Grid line hiding styles

## Running the Project

```bash
npm install
npm run dev
```

## Common Tasks

### Adding a new font option
1. Import font in `index.css` via Google Fonts
2. Add entry to `FONTS` object in `src/config/themes.ts`
3. Add to `FontOption` type in `src/types/index.ts`

### Adding a new color theme
1. Add entry to `TEXT_THEMES` or `BACKGROUNDS` in `src/config/themes.ts`
2. Add to corresponding type in `src/types/index.ts`
3. Add CSS class in `index.css` if theme needs special styling

### Modifying grid columns
- Column definitions are in `Dashboard.tsx` in the `colDefs` useMemo
- Custom renderers go in `src/components/` and are passed directly to `cellRenderer`

### Adding new styling options
1. Add type to `src/types/index.ts`
2. Add config to `src/config/themes.ts`
3. Add state and setter in `Dashboard.tsx`
4. Add to `StylingConfig` and `StylingActions` objects
5. Add UI control in `ColumnVisibilityPanel.tsx`
