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
└── components/
    ├── Dashboard.tsx                 # Main grid + state management + styling effects
    ├── ColumnVisibilityPanel.tsx     # Side panel with all styling controls
    └── FuelTypeCellRenderer.tsx      # Custom cell renderer for fuel type icons
```

## Key Files

### `src/components/Dashboard.tsx`
Main component containing:
- AG Grid configuration with 9 columns and 100 sample rows
- All styling state (font, size, weight, spacing, colors, zoom, grid lines)
- `useEffect` hooks that apply styling changes via CSS custom properties
- System summary header with KPI values

### `src/components/ColumnVisibilityPanel.tsx`
Control panel with:
- Column visibility toggles
- Font selection (7 options)
- Font size (8px-22px)
- Vertical spacing (Small/Medium/Large)
- Font weight (Normal/Bold)
- Zoom level (70%-160%)
- Grid lines toggle
- Column width (Narrow/Medium/Wide)
- Text theme colors (4 options)
- Background colors (3 options)

### `src/index.css`
Global styles including:
- CSS custom properties (`--operator-font`, `--ag-font-weight`, etc.)
- Google Fonts imports
- AG Grid theme overrides
- Text theme classes (`.text-theme-amber`, `.text-theme-green`)
- Grid line hiding styles

## How Styling Is Applied

1. **CSS Custom Properties** - Font, colors, and sizes set via `document.documentElement.style.setProperty()`
2. **AG Grid API** - Column visibility, width adjustments via `gridApi`
3. **CSS Classes** - Theme variations toggled on grid container
4. **Direct Styles** - Background color, zoom applied to body/container

## Running the Project

```bash
npm install
npm run dev
```

## Common Tasks

### Adding a new font option
1. Import font in `index.css` via Google Fonts
2. Add option to `fonts` array in `ColumnVisibilityPanel.tsx`
3. Update letter-spacing logic in `Dashboard.tsx` useEffect if needed

### Adding a new color theme
1. Add option to `textThemes` array in `ColumnVisibilityPanel.tsx`
2. Add corresponding CSS class in `index.css` if needed
3. Update the text theme useEffect in `Dashboard.tsx`

### Modifying grid columns
- Column definitions are in `Dashboard.tsx` in the `columnDefs` state
- Custom renderers go in `src/components/` and register via `frameworkComponents`
