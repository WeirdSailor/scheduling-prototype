import { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Quartz theme

import FuelTypeCellRenderer from './FuelTypeCellRenderer';
import ColumnVisibilityPanel from './ColumnVisibilityPanel';

function Dashboard() {
  const [gridApi, setGridApi] = useState<any>(null);
  const [columnApi, setColumnApi] = useState<any>(null);

  const onGridReady = (params: any) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };

  const [rowData] = useState(() => {
    const celestialNames = [
      "ALPHA", "BETEL", "CASSI", "CYGNU", "DENEB", "ERIDN", "FOMAL", "GACRU", "HADAR", "JUPIT",
      "KRAUS", "LUPUS", "MAIAS", "NEBOS", "ORION", "PHOEN", "QUASA", "RIGEL", "SIRIU", "TAURI",
      "URSAJ", "VEGAX", "WASPJ", "XENON", "YAVIN", "ZENIT", "ANDRO", "AURIG", "BOOTE", "CENTA",
      "DRACO", "GEMIN", "HYDRA", "LEOXI", "LYRAE", "MONOC", "NORMA", "OPHIU", "PISCS", "SAGIT",
      "SCORP", "TAURU", "VIRGO", "VOLAN", "AQUIL", "CAPRI", "CRUXA", "DELPH", "FORNA", "INDUS",
      "PISCS", "SAGIT", "SCORP", "TAURU", "VIRGO", "VOLAN", "AQUIL", "CAPRI", "CRUXA", "DELPH",
      "FORNA", "INDUS", "JUNO1", "VESTA", "CERES", "PALLA", "HYGIA", "ASTRA", "HEBEA", "IRISU",
      "FLORA", "METIS", "EUNOM", "PSYCH", "THETI", "LEDAA", "NIOBE", "EUGEN", "POMON", "THEMI",
      "PHOCN", "DAPHN", "ISONE", "EUTER", "BELLN", "AMPHI", "URANJ", "NEPTN", "PLUTO", "TITAN"
    ];

    const generateUnitName = (baseName: string, index: number) => {
      // Ensure baseName is long enough for the 7-letter variant before slicing
      const longBaseName = baseName.padEnd(7, 'X'); 
      const numSuffix = (index % 3 === 0) ? '' : `-${(index % 2) + 1}`;
      // Use slice to get up to 5 letters for the base, then append up to 2 more if no suffix and long enough
      const primaryPart = longBaseName.substring(0, 5).toUpperCase();
      const secondaryPart = (numSuffix.length === 0 && longBaseName.length >= 7) ? longBaseName.substring(5, 7).toUpperCase() : '';
      return `${primaryPart}${secondaryPart}${numSuffix}`;
    };

    const generateRandomValue = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const data = Array.from({ length: 100 }).map((_, i) => {
      const baseName = celestialNames[i % celestialNames.length];
      const unitName = generateUnitName(baseName, i);
      const fpn = generateRandomValue(100, 2000);
      const mel = fpn + generateRandomValue(50, 300);
      const sel = fpn + generateRandomValue(20, 150);
      const ndz = generateRandomValue(10, 120);
      const mnzt = generateRandomValue(5, 60);
      const mzt = generateRandomValue(1, Math.min(mnzt - 1, ndz - 1)); // MZT < MNZT and MZT < NDZ

      return {
        UnitName: unitName,
        FuelType: ["Gas", "Coal", "Wind", "Solar", "Nuclear", "Hydro"][i % 6],
        FPN: fpn,
        MEL: mel,
        SEL: sel,
        NDZ: ndz,
        MNZT: mnzt,
        MZT: mzt,
      };
    });
    return data;
  });

  const colDefs: ColDef[] = useMemo(() => [
    { headerName: '', checkboxSelection: true, headerCheckboxSelection: true, width: 50 },
    { field: 'UnitName', sortable: true, filter: true, cellClass: 'unit-name-cell' },
    { field: 'FuelType', sortable: true, filter: true, cellRenderer: 'fuelTypeCellRenderer' },
    { field: 'FPN', headerName: 'PN (MW)', sortable: true, filter: true, cellClass: 'ag-right-aligned-cell' },
    { field: 'MEL', headerName: 'MEL (MW)', sortable: true, filter: true, cellClass: 'ag-right-aligned-cell' },
    { field: 'SEL', headerName: 'SEL (MW)', sortable: true, filter: true, cellClass: 'ag-right-aligned-cell' },
    { field: 'NDZ', headerName: 'NDZ', sortable: true, filter: true, cellClass: 'ag-right-aligned-cell' },
    { field: 'MNZT', headerName: 'MNZT', sortable: true, filter: true, cellClass: 'ag-right-aligned-cell' },
    { field: 'MZT', headerName: 'MZT', sortable: true, filter: true, cellClass: 'ag-right-aligned-cell' },
  ], []);

  const demandForecast = 35000;
  const totalScheduled = rowData.reduce((sum, unit) => sum + unit.FPN, 0);
  const margin = totalScheduled - demandForecast;

  const frameworkComponents = useMemo(() => ({
    fuelTypeCellRenderer: FuelTypeCellRenderer,
  }), []);

  const [isPanelOpen, setIsPanelOpen] = useState(true); // State to manage panel visibility
  const [activeFont, setActiveFont] = useState<'Inter' | 'Roboto' | 'Hind' | 'Open Sans' | 'Roboto Condensed' | 'IBM Plex Sans' | 'JetBrains Mono'>('Inter'); // State to manage active font
  const [verticalSpacing, setVerticalSpacing] = useState<'Small' | 'Medium' | 'Large'>('Medium'); // State to manage vertical spacing
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal'); // State to manage font weight
  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // State to manage zoom level (1.0 = 100%)
  const [showGridLines, setShowGridLines] = useState<boolean>(true); // State to manage grid lines visibility
  const [columnWidthOption, setColumnWidthOption] = useState<'Narrow' | 'Medium' | 'Wide'>('Wide'); // State to manage column width
  const [fontSize, setFontSize] = useState<number>(12); // State to manage font size
  const [backgroundTheme, setBackgroundTheme] = useState<'Midnight Slate' | 'Tactical Black' | 'Deep Blue'>('Midnight Slate');
  const [textTheme, setTextTheme] = useState<'Pure White' | 'Modern White' | 'Dual-Tone Amber' | 'Digital Green'>('Pure White');

  useEffect(() => {
    document.documentElement.style.setProperty('--ag-font-size', `${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    let fontFamily = '';
    let letterSpacing = 'normal'; // Default to normal

    switch (activeFont) {
      case 'Inter':
        fontFamily = 'Inter, sans-serif';
        letterSpacing = '0.01em'; // Slightly more open for Inter
        break;
      case 'Roboto':
        fontFamily = 'Roboto, sans-serif';
        letterSpacing = '-0.01em'; // Slightly denser for Roboto
        break;
      case 'Hind':
        fontFamily = 'Hind, sans-serif';
        letterSpacing = 'normal';
        break;
      case 'Open Sans':
        fontFamily = 'Open Sans, sans-serif';
        letterSpacing = 'normal';
        break;
      case 'Roboto Condensed':
        fontFamily = 'Roboto Condensed, sans-serif';
        letterSpacing = '-0.02em'; // Denser for industrial feel
        break;
      case 'IBM Plex Sans':
        fontFamily = 'IBM Plex Sans, sans-serif';
        letterSpacing = 'normal';
        break;
      case 'JetBrains Mono':
        fontFamily = 'JetBrains Mono, monospace';
        letterSpacing = 'normal';
        break;
      default:
        fontFamily = 'Inter, sans-serif';
        letterSpacing = 'normal';
    }

    document.documentElement.style.setProperty('--operator-font', fontFamily);
    document.documentElement.style.setProperty('--ag-font-weight', fontWeight);
    document.body.style.letterSpacing = letterSpacing;
  }, [activeFont, fontWeight]);



  useEffect(() => {
    const gridDiv = document.querySelector('.ag-theme-quartz-dark') as HTMLElement;
    if (gridDiv) {
      // Set background and header colors based on theme
      switch (backgroundTheme) {
        case 'Tactical Black':
          document.body.style.backgroundColor = '#080808';
          gridDiv.style.setProperty('--ag-background-color', '#080808');
          gridDiv.style.setProperty('--ag-header-background-color', '#181818');
          break;
        case 'Deep Blue':
          document.body.style.backgroundColor = '#0B1420';
          gridDiv.style.setProperty('--ag-background-color', '#0B1420');
          gridDiv.style.setProperty('--ag-header-background-color', '#1A2634');
          break;
        case 'Midnight Slate':
        default:
          document.body.style.backgroundColor = '#182230';
          gridDiv.style.setProperty('--ag-background-color', '#182230');
          gridDiv.style.setProperty('--ag-header-background-color', '#2A3B4E');
          break;
      }
    }
  }, [backgroundTheme]);




  useEffect(() => {
    const gridDiv = document.querySelector('.ag-theme-quartz-dark') as HTMLElement;
    if (gridDiv) {
      gridDiv.classList.remove('text-theme-amber', 'text-theme-green');

      switch (textTheme) {
        case 'Modern White':
          gridDiv.style.setProperty('--ag-foreground-color', '#E6EDF3');
          break;
        case 'Dual-Tone Amber':
          gridDiv.classList.add('text-theme-amber');
          gridDiv.style.setProperty('--ag-foreground-color', '#E6EDF3');
          break;
        case 'Digital Green':
          gridDiv.classList.add('text-theme-green');
          break;
        case 'Pure White':
        default:
          gridDiv.style.setProperty('--ag-foreground-color', '#FFFFFF'); // Revert to actual pure white
          break;
      }
    }
  }, [textTheme]);

  useEffect(() => {
    if (gridApi) {
      gridApi.resetRowHeights();
    }
  }, [verticalSpacing, gridApi]);

  useEffect(() => {
    // Apply zoom to the entire body or root element
    document.body.style.zoom = `${zoomLevel * 100}%`;
  }, [zoomLevel]);

  // Effect for grid lines
  useEffect(() => {
    if (gridApi) {
      const gridDiv = document.querySelector('.ag-theme-quartz-dark');
      if (gridDiv) {
        if (!showGridLines) {
          gridDiv.classList.add('hide-ag-grid-lines');
        } else {
          gridDiv.classList.remove('hide-ag-grid-lines');
        }
      }
    }
  }, [showGridLines, gridApi]);

  // Effect for column width
  useEffect(() => {
    if (gridApi && columnApi) {
      const allColumnIds = gridApi.getAllGridColumns().map((col: any) => col.getColId());
      const averageCharWidth = 8; // A reasonable approximation for character width in pixels

      switch (columnWidthOption) {
        case 'Narrow':
          const narrowBuffer = 5 * averageCharWidth;
          gridApi.autoSizeColumns(allColumnIds, true);
          gridApi.getAllGridColumns().forEach((col: any) => {
            const currentWidth = col.getActualWidth();
            columnApi.setColumnWidth(col.getColId(), currentWidth + narrowBuffer);
          });
          break;
        case 'Medium':
          const mediumBuffer = 8 * averageCharWidth;
          gridApi.autoSizeColumns(allColumnIds, true);
          gridApi.getAllGridColumns().forEach((col: any) => {
            const currentWidth = col.getActualWidth();
            columnApi.setColumnWidth(col.getColId(), currentWidth + mediumBuffer);
          });
          break;
        case 'Wide':
          const wideBuffer = 10 * averageCharWidth;
          gridApi.autoSizeColumns(allColumnIds, true);
          gridApi.getAllGridColumns().forEach((col: any) => {
            const currentWidth = col.getActualWidth();
            columnApi.setColumnWidth(col.getColId(), currentWidth + wideBuffer);
          });
          break;
      }
      gridApi.refreshHeader();
      gridApi.redrawRows();
    }
  }, [columnWidthOption, gridApi, columnApi]);

  const getRowHeight = useMemo(() => {
    switch (verticalSpacing) {
      case 'Small':
        return 20;
      case 'Medium':
        return 24;
      case 'Large':
        return 30;
      default:
        return 24;
    }
  }, [verticalSpacing]);

  return (
    <div className={`${textTheme.toLowerCase().replace(' ', '-')}`} style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="system-summary">
        <h2>ESO Generation Dispatch Dashboard</h2>
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 100, padding: '5px 10px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isPanelOpen ? 'Close Panel' : 'Open Panel'}
        </button>
        <p>Demand Forecast: {demandForecast} MW</p>
        <p>Total Scheduled: {totalScheduled} MW</p>
        <p style={{ color: margin < 0 ? 'red' : 'inherit' }}>Margin: {margin} MW</p>
      </div>
      <div style={{ flexGrow: 1, display: 'flex' }}>
        {gridApi && isPanelOpen && (
          <ColumnVisibilityPanel
            gridApi={gridApi}
            activeFont={activeFont}
            setActiveFont={setActiveFont}
            verticalSpacing={verticalSpacing}
            setVerticalSpacing={setVerticalSpacing}
            actualRowHeight={getRowHeight}
            fontWeight={fontWeight}
            setFontWeight={setFontWeight}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            showGridLines={showGridLines}
            setShowGridLines={setShowGridLines}
            columnWidthOption={columnWidthOption}
            setColumnWidthOption={setColumnWidthOption}
            fontSize={fontSize}
            setFontSize={setFontSize}
            backgroundTheme={backgroundTheme}
            setBackgroundTheme={setBackgroundTheme}
            textTheme={textTheme}
            setTextTheme={setTextTheme}
          />
        )}
        <div className="ag-theme-quartz-dark" style={{ flexGrow: 1 }}>
          <AgGridReact
                        rowData={rowData}
                        columnDefs={colDefs}
                        onGridReady={onGridReady}
                        components={frameworkComponents}
                        rowSelection='multiple'
                        theme="legacy"
                        rowHeight={getRowHeight}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;