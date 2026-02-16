import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import FuelTypeCellRenderer from './FuelTypeCellRenderer';
import PriceCellRenderer from './PriceCellRenderer';
import ColumnVisibilityPanel from './ColumnVisibilityPanel';
import { generateSampleData } from '../data/sampleData';
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
  const [isGridDataRendered, setIsGridDataRendered] = useState(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  const onFirstDataRendered = useCallback(() => {
    // Small delay to ensure grid is fully rendered before sizing columns
    setTimeout(() => {
      setIsGridDataRendered(true);
    }, 50);
  }, []);

  const [rowData] = useState(() => generateSampleData(100));

  const colDefs: ColDef[] = useMemo(
    () => [
      { headerName: '', checkboxSelection: true, headerCheckboxSelection: true, width: 50 },
      { field: 'UnitName', sortable: true, filter: true, cellClass: 'unit-name-cell' },
      {
        field: 'FPN',
        headerName: 'PN',
        sortable: true,
        filter: true,
        cellClass: 'ag-right-aligned-cell',
      },
      {
        field: 'MEL',
        headerName: 'MEL',
        sortable: true,
        filter: true,
        cellClass: 'ag-right-aligned-cell',
      },
      {
        field: 'SEL',
        headerName: 'SEL',
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
      {
        field: 'Price',
        headerName: 'Price',
        sortable: true,
        filter: true,
        cellRenderer: PriceCellRenderer,
      },
      {
        field: 'Zone',
        headerName: 'Zone',
        sortable: true,
        filter: true,
      },
      {
        field: 'FuelType',
        sortable: true,
        filter: true,
        cellRenderer: FuelTypeCellRenderer,
      },
    ],
    []
  );

  // Panel state
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Styling state
  const [activeFont, setActiveFont] = useState<FontOption>('Inter');
  const [fontSize, setFontSize] = useState(12);
  const [fontWeight, setFontWeight] = useState<FontWeight>(400);
  const [verticalSpacing, setVerticalSpacing] = useState<VerticalSpacing>('Medium');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [showGridLines, setShowGridLines] = useState(true);
  const [columnWidthOption, setColumnWidthOption] = useState<ColumnWidth>('Narrow');
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

  // Font size effect - apply to grid container
  useEffect(() => {
    const gridDiv = gridContainerRef.current;
    if (!gridDiv) return;
    gridDiv.style.setProperty('--ag-font-size', `${fontSize}px`);
  }, [fontSize]);

  // Font family and weight effect
  useEffect(() => {
    const fontConfig = FONTS[activeFont];
    document.documentElement.style.setProperty('--operator-font', fontConfig.family);
    document.documentElement.style.setProperty('--ag-font-weight', String(fontWeight));
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
    gridDiv.classList.remove('text-theme-amber', 'text-theme-green', 'text-theme-yellow');

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

  // Column width effect (simplified) - skip first column (checkbox)
  // Wait for first data render before applying column widths
  useEffect(() => {
    if (!gridApi || !isGridDataRendered) return;

    const allColumns = gridApi.getAllGridColumns() ?? [];
    if (allColumns.length === 0) return;

    // Skip the first column (checkbox column)
    const dataColumns = allColumns.slice(1);
    const dataColumnIds = dataColumns.map((col) => col.getColId());

    const buffer = COLUMN_WIDTH_BUFFERS[columnWidthOption];

    gridApi.autoSizeColumns(dataColumnIds, true);

    dataColumns.forEach((col) => {
      const currentWidth = col.getActualWidth();
      gridApi.setColumnWidths([{ key: col.getColId(), newWidth: currentWidth + buffer }]);
    });

    gridApi.refreshHeader();
  }, [columnWidthOption, gridApi, isGridDataRendered]);

  const rowHeight = ROW_HEIGHTS[verticalSpacing];

  return (
    <div
      ref={appContainerRef}
      className="dashboard-container"
    >
      <div className="toolbar">
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="toolbar-button"
          title={isPanelOpen ? 'Hide Panel' : 'Show Panel'}
        >
          ☰
        </button>
      </div>
      <div className="main-content">
        <div className={`panel-container ${isPanelOpen ? 'panel-open' : 'panel-closed'}`}>
          {gridApi && (
            <ColumnVisibilityPanel gridApi={gridApi} styling={styling} actions={actions} />
          )}
        </div>
        <div ref={gridContainerRef} className="ag-theme-quartz-dark">
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
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
