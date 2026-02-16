import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import FuelTypeCellRenderer from './FuelTypeCellRenderer';
import ColumnVisibilityPanel from './ColumnVisibilityPanel';
import { generateSampleData, DEMAND_FORECAST } from '../data/sampleData';
import type {
  StylingConfig,
  StylingActions,
  FontOption,
  VerticalSpacing,
  FontWeight,
  ColumnWidth,
  BackgroundTheme,
  TextTheme,
} from '../types';
import {
  FONTS,
  BACKGROUNDS,
  TEXT_THEMES,
  ROW_HEIGHTS,
  COLUMN_WIDTH_BUFFERS,
} from '../config/themes';

function Dashboard() {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  const [rowData] = useState(() => generateSampleData(100));

  const colDefs: ColDef[] = useMemo(
    () => [
      { headerName: '', checkboxSelection: true, headerCheckboxSelection: true, width: 50 },
      { field: 'UnitName', sortable: true, filter: true, cellClass: 'unit-name-cell' },
      {
        field: 'FuelType',
        sortable: true,
        filter: true,
        cellRenderer: FuelTypeCellRenderer,
      },
      {
        field: 'FPN',
        headerName: 'PN (MW)',
        sortable: true,
        filter: true,
        cellClass: 'ag-right-aligned-cell',
      },
      {
        field: 'MEL',
        headerName: 'MEL (MW)',
        sortable: true,
        filter: true,
        cellClass: 'ag-right-aligned-cell',
      },
      {
        field: 'SEL',
        headerName: 'SEL (MW)',
        sortable: true,
        filter: true,
        cellClass: 'ag-right-aligned-cell',
      },
      {
        field: 'NDZ',
        headerName: 'NDZ',
        sortable: true,
        filter: true,
        cellClass: 'ag-right-aligned-cell',
      },
      {
        field: 'MNZT',
        headerName: 'MNZT',
        sortable: true,
        filter: true,
        cellClass: 'ag-right-aligned-cell',
      },
      {
        field: 'MZT',
        headerName: 'MZT',
        sortable: true,
        filter: true,
        cellClass: 'ag-right-aligned-cell',
      },
    ],
    []
  );

  const totalScheduled = useMemo(
    () => rowData.reduce((sum, unit) => sum + unit.FPN, 0),
    [rowData]
  );
  const margin = totalScheduled - DEMAND_FORECAST;

  // Panel state
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Styling state
  const [activeFont, setActiveFont] = useState<FontOption>('Inter');
  const [fontSize, setFontSize] = useState(12);
  const [fontWeight, setFontWeight] = useState<FontWeight>('normal');
  const [verticalSpacing, setVerticalSpacing] = useState<VerticalSpacing>('Medium');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [showGridLines, setShowGridLines] = useState(true);
  const [columnWidthOption, setColumnWidthOption] = useState<ColumnWidth>('Wide');
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('Midnight Slate');
  const [textTheme, setTextTheme] = useState<TextTheme>('Pure White');

  // Grouped styling config for panel
  const styling: StylingConfig = {
    activeFont,
    fontSize,
    fontWeight,
    verticalSpacing,
    zoomLevel,
    showGridLines,
    columnWidthOption,
    backgroundTheme,
    textTheme,
  };

  const actions: StylingActions = {
    setActiveFont,
    setFontSize,
    setFontWeight,
    setVerticalSpacing,
    setZoomLevel,
    setShowGridLines,
    setColumnWidthOption,
    setBackgroundTheme,
    setTextTheme,
  };

  // Font size effect
  useEffect(() => {
    document.documentElement.style.setProperty('--ag-font-size', `${fontSize}px`);
  }, [fontSize]);

  // Font family and weight effect
  useEffect(() => {
    const fontConfig = FONTS[activeFont];
    document.documentElement.style.setProperty('--operator-font', fontConfig.family);
    document.documentElement.style.setProperty('--ag-font-weight', fontWeight);
    document.body.style.letterSpacing = fontConfig.letterSpacing;
  }, [activeFont, fontWeight]);

  // Background theme effect
  useEffect(() => {
    const gridDiv = gridContainerRef.current;
    if (!gridDiv) return;

    const bgConfig = BACKGROUNDS[backgroundTheme];
    document.body.style.backgroundColor = bgConfig.body;
    gridDiv.style.setProperty('--ag-background-color', bgConfig.body);
    gridDiv.style.setProperty('--ag-header-background-color', bgConfig.header);
  }, [backgroundTheme]);

  // Text theme effect
  useEffect(() => {
    const gridDiv = gridContainerRef.current;
    if (!gridDiv) return;

    // Remove existing theme classes
    gridDiv.classList.remove('text-theme-amber', 'text-theme-green');

    const themeConfig = TEXT_THEMES[textTheme];
    gridDiv.style.setProperty('--ag-foreground-color', themeConfig.foregroundColor);

    if (themeConfig.cssClass) {
      gridDiv.classList.add(themeConfig.cssClass);
    }
  }, [textTheme]);

  // Row height reset effect
  useEffect(() => {
    if (gridApi) {
      gridApi.resetRowHeights();
    }
  }, [verticalSpacing, gridApi]);

  // Zoom effect using transform (cross-browser compatible)
  useEffect(() => {
    const container = appContainerRef.current;
    if (!container) return;

    if (zoomLevel === 1.0) {
      container.style.transform = '';
      container.style.transformOrigin = '';
      container.style.width = '';
      container.style.height = '';
    } else {
      container.style.transform = `scale(${zoomLevel})`;
      container.style.transformOrigin = 'top left';
      container.style.width = `${100 / zoomLevel}%`;
      container.style.height = `${100 / zoomLevel}%`;
    }
  }, [zoomLevel]);

  // Grid lines effect
  useEffect(() => {
    const gridDiv = gridContainerRef.current;
    if (!gridDiv) return;

    if (showGridLines) {
      gridDiv.classList.remove('hide-ag-grid-lines');
    } else {
      gridDiv.classList.add('hide-ag-grid-lines');
    }
  }, [showGridLines]);

  // Column width effect (simplified)
  useEffect(() => {
    if (!gridApi) return;

    const allColumnIds = gridApi.getAllGridColumns()?.map((col) => col.getColId()) ?? [];
    if (allColumnIds.length === 0) return;

    const buffer = COLUMN_WIDTH_BUFFERS[columnWidthOption];

    gridApi.autoSizeColumns(allColumnIds, true);

    gridApi.getAllGridColumns()?.forEach((col) => {
      const currentWidth = col.getActualWidth();
      gridApi.setColumnWidths([{ key: col.getColId(), newWidth: currentWidth + buffer }]);
    });

    gridApi.refreshHeader();
  }, [columnWidthOption, gridApi]);

  const rowHeight = ROW_HEIGHTS[verticalSpacing];

  return (
    <div
      ref={appContainerRef}
      style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div className="system-summary">
        <h2>ESO Generation Dispatch Dashboard</h2>
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 100,
            padding: '5px 10px',
            backgroundColor: '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isPanelOpen ? 'Close Panel' : 'Open Panel'}
        </button>
        <p>Demand Forecast: {DEMAND_FORECAST} MW</p>
        <p>Total Scheduled: {totalScheduled} MW</p>
        <p style={{ color: margin < 0 ? 'red' : 'inherit' }}>Margin: {margin} MW</p>
      </div>
      <div style={{ flexGrow: 1, display: 'flex' }}>
        {gridApi && isPanelOpen && (
          <ColumnVisibilityPanel gridApi={gridApi} styling={styling} actions={actions} />
        )}
        <div ref={gridContainerRef} className="ag-theme-quartz-dark" style={{ flexGrow: 1 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            onGridReady={onGridReady}
            rowSelection="multiple"
            theme="legacy"
            rowHeight={rowHeight}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
