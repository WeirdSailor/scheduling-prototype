import React, { useState, useEffect } from 'react';

interface ColumnVisibilityPanelProps {
  gridApi: any;
  activeFont: 'Inter' | 'Roboto' | 'Hind' | 'Open Sans' | 'Roboto Condensed' | 'IBM Plex Sans' | 'JetBrains Mono';
  setActiveFont: React.Dispatch<React.SetStateAction<'Inter' | 'Roboto' | 'Hind' | 'Open Sans' | 'Roboto Condensed' | 'IBM Plex Sans' | 'JetBrains Mono'>>;
  verticalSpacing: 'Small' | 'Medium' | 'Large';
  setVerticalSpacing: React.Dispatch<React.SetStateAction<'Small' | 'Medium' | 'Large'>>;
  actualRowHeight: number;
  fontWeight: 'normal' | 'bold';
  setFontWeight: React.Dispatch<React.SetStateAction<'normal' | 'bold'>>;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  showGridLines: boolean;
  setShowGridLines: React.Dispatch<React.SetStateAction<boolean>>;
  columnWidthOption: 'Narrow' | 'Medium' | 'Wide';
  setColumnWidthOption: React.Dispatch<React.SetStateAction<'Narrow' | 'Medium' | 'Wide'>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  backgroundTheme: 'Midnight Slate' | 'Tactical Black' | 'Deep Blue';
  setBackgroundTheme: React.Dispatch<React.SetStateAction<'Midnight Slate' | 'Tactical Black' | 'Deep Blue'>>;
  textTheme: 'Pure White' | 'Modern White' | 'Dual-Tone Amber' | 'Digital Green';
  setTextTheme: React.Dispatch<React.SetStateAction<'Pure White' | 'Modern White' | 'Dual-Tone Amber' | 'Digital Green'>>;
}

const ColumnVisibilityPanel: React.FC<ColumnVisibilityPanelProps> = ({ gridApi, activeFont, setActiveFont, verticalSpacing, setVerticalSpacing, actualRowHeight, fontWeight, setFontWeight, zoomLevel, setZoomLevel, showGridLines, setShowGridLines, columnWidthOption, setColumnWidthOption, fontSize, setFontSize, backgroundTheme, setBackgroundTheme, textTheme, setTextTheme }) => {
  const [columns, setColumns] = useState<{ id: string; headerName: string; visible: boolean }[]>([]);

  useEffect(() => {
    if (gridApi) {
      const updateColumnStates = () => {
        const allGridColumns = gridApi.getAllGridColumns();
        if (!allGridColumns) return; // Add this check
        const columnStates = allGridColumns.map((column: any) => ({
          id: column.getColId(),
          headerName: gridApi.getDisplayNameForColumn(column) || column.getColId(),
          visible: column.isVisible(),
        }));
        setColumns(columnStates);
      };

      // Initial update
      updateColumnStates();

      // Listen for column changes
      gridApi.addEventListener('columnVisible', updateColumnStates);
      gridApi.addEventListener('columnMoved', updateColumnStates);
      gridApi.addEventListener('columnPinned', updateColumnStates);
      gridApi.addEventListener('columnGroupOpened', updateColumnStates);
      gridApi.addEventListener('displayedColumnsChanged', updateColumnStates);

      return () => {
        gridApi.removeEventListener('columnVisible', updateColumnStates);
        gridApi.removeEventListener('columnMoved', updateColumnStates);
        gridApi.removeEventListener('columnPinned', updateColumnStates);
        gridApi.removeEventListener('columnGroupOpened', updateColumnStates);
        gridApi.removeEventListener('displayedColumnsChanged', updateColumnStates);
      };
    }
  }, [gridApi]);

  const onCheckboxChange = (columnId: string, checked: boolean) => {
    if (gridApi) {
      gridApi.setColumnsVisible([columnId], checked);
    }
  };

  const backgroundThemeHex = {
    'Midnight Slate': '#182230',
    'Tactical Black': '#080808',
    'Deep Blue': '#0B1420',
  };

  const textThemeHex = {
    'Pure White': '#FFFFFF',
    'Modern White': '#E6EDF3',
    'Dual-Tone Amber': '#FFB000',
    'Digital Green': '#4AF626',
  };

  if (!gridApi) {
    return (
      <div style={{ padding: '10px', border: '1px solid #555', backgroundColor: '#333', color: 'white', minWidth: '200px', maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
        <h3>Column Visibility</h3>
        <div>Awaiting gridApi...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px', border: '1px solid #555', backgroundColor: '#333', color: '#eee', minWidth: '200px', maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
      <h3>Column Visibility</h3>
      {columns.map((column: { id: string; headerName: string; visible: boolean }) => (
        <div key={column.id} style={{ marginBottom: '5px' }}>
          <label>
            <input
              type="checkbox"
              checked={column.visible}
              onChange={(e) => onCheckboxChange(column.id, e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            {column.headerName}
          </label>
        </div>
      ))}

      <h3 style={{ marginTop: '20px' }}>Font Selection</h3>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <select
          value={activeFont}
          onChange={(e) => setActiveFont(e.target.value as 'Inter' | 'Roboto' | 'Hind' | 'Open Sans' | 'Roboto Condensed' | 'IBM Plex Sans' | 'JetBrains Mono')}
          style={{ width: 'calc(100% - 100px)', padding: '5px', backgroundColor: '#555', color: 'white', border: '1px solid #777', borderRadius: '4px' }}
        >
          <option value="Inter">Inter (Humanist)</option>
          <option value="Roboto">Roboto (Industrial)</option>
          <option value="Hind">Hind (Frutiger Alt.)</option>
          <option value="Open Sans">Open Sans (Frutiger Alt.)</option>
          <option value="Roboto Condensed">Roboto Condensed (DIN 1451 Alt.)</option>
          <option value="IBM Plex Sans">IBM Plex Sans (Technical)</option>
          <option value="JetBrains Mono">JetBrains Mono (Precision)</option>
        </select>
        <span style={{ fontSize: '0.8em', marginLeft: '10px' }}>{activeFont}</span>
      </div>

      <h3 style={{ marginTop: '20px' }}>Font Size</h3>
      <div style={{ marginBottom: '10px' }}>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          style={{ width: '100%', padding: '5px', backgroundColor: '#555', color: 'white', border: '1px solid #777', borderRadius: '4px' }}
        >
          {[8, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22].map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
      </div>

      <h3 style={{ marginTop: '20px' }}>Vertical Spacing</h3>
      <div style={{ marginBottom: '10px' }}>
        <select
          value={verticalSpacing}
          onChange={(e) => setVerticalSpacing(e.target.value as 'Small' | 'Medium' | 'Large')}
          style={{ width: '100%', padding: '5px', backgroundColor: '#555', color: 'white', border: '1px solid #777', borderRadius: '4px' }}
        >
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
      </div>
      <h3 style={{ marginTop: '20px' }}>Font Weight</h3>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            name="font-weight"
            value="normal"
            checked={fontWeight === 'normal'}
            onChange={() => setFontWeight('normal')}
            style={{ marginRight: '5px' }}
          />
          Normal
        </label>
        <label>
          <input
            type="radio"
            name="font-weight"
            value="bold"
            checked={fontWeight === 'bold'}
            onChange={() => setFontWeight('bold')}
            style={{ marginRight: '5px' }}
          />
          Bold
        </label>
      </div>

      <h3 style={{ marginTop: '20px' }}>Zoom Level</h3>
      <div style={{ marginBottom: '10px' }}>
        <select
          value={zoomLevel}
          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
          style={{ width: '100%', padding: '5px', backgroundColor: '#555', color: 'white', border: '1px solid #777', borderRadius: '4px' }}
        >
          <option value={0.70}>Zoom Out (70%)</option>
          <option value={0.85}>Zoom Out (85%)</option>
          <option value={1.0}>Normal (100%)</option>
          <option value={1.15}>Zoom In (115%)</option>
          <option value={1.30}>Zoom In (130%)</option>
          <option value={1.45}>Zoom In (145%)</option>
          <option value={1.60}>Zoom In (160%)</option>
        </select>
      </div>

      <h3 style={{ marginTop: '20px' }}>Grid Lines</h3>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={showGridLines}
            onChange={(e) => setShowGridLines(e.target.checked)}
            style={{ marginRight: '5px' }}
          />
          Show Grid Lines
        </label>
      </div>

      <h3 style={{ marginTop: '20px' }}>Column Width</h3>
      <div style={{ marginBottom: '10px' }}>
        <select
          value={columnWidthOption}
          onChange={(e) => setColumnWidthOption(e.target.value as 'Narrow' | 'Medium' | 'Wide')}
          style={{ width: '100%', padding: '5px', backgroundColor: '#555', color: 'white', border: '1px solid #777', borderRadius: '4px' }}
        >
          <option value="Narrow">Narrow</option>
          <option value="Medium">Medium</option>
          <option value="Wide">Wide</option>
        </select>
      </div>

      <h3 style={{ marginTop: '20px' }}>Text Theme</h3>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <select
          value={textTheme}
          onChange={(e) => setTextTheme(e.target.value as 'Pure White' | 'Modern White' | 'Dual-Tone Amber' | 'Digital Green')}
          style={{ width: 'calc(100% - 30px)', padding: '5px', backgroundColor: '#555', color: 'white', border: '1px solid #777', borderRadius: '4px' }}
        >
          <option value="Pure White">Pure White</option>
          <option value="Modern White">Modern White</option>
          <option value="Dual-Tone Amber">Dual-Tone Amber</option>
          <option value="Digital Green">Digital Green</option>
        </select>
        <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: textTheme === 'Pure White' ? '#FFFFFF' : textTheme === 'Modern White' ? '#E6EDF3' : textTheme === 'Dual-Tone Amber' ? '#FFB000' : '#4AF626',
          border: '1px solid white',
          marginLeft: '8px'
        }}></div>
      </div>

      <h3 style={{ marginTop: '20px' }}>Background Colour</h3>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <select
          value={backgroundTheme}
          onChange={(e) => setBackgroundTheme(e.target.value as 'Midnight Slate' | 'Tactical Black' | 'Deep Blue')}
          style={{ width: 'calc(100% - 30px)', padding: '5px', backgroundColor: '#555', color: 'white', border: '1px solid #777', borderRadius: '4px' }}
        >
          <option value="Midnight Slate">Midnight Slate</option>
          <option value="Tactical Black">Tactical Black</option>
          <option value="Deep Blue">Deep Blue</option>
        </select>
        <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: backgroundTheme === 'Midnight Slate' ? '#182230' : backgroundTheme === 'Tactical Black' ? '#080808' : '#0B1420',
          border: '1px solid white',
          marginLeft: '8px'
        }}></div>
      </div>

      <h3 style={{ marginTop: '20px' }}>Current Settings</h3>
      <div style={{ backgroundColor: '#444', padding: '10px', borderRadius: '4px', fontSize: '0.9em' }}>
        <p style={{ margin: '0 0 5px 0' }}><strong>Font Type:</strong> {activeFont} {activeFont === 'Inter' || activeFont === 'Hind' || activeFont === 'Open Sans' ? '(Humanist)' : activeFont === 'Roboto' || activeFont === 'Roboto Condensed' ? '(Industrial)' : activeFont === 'IBM Plex Sans' ? '(Technical)' : activeFont === 'JetBrains Mono' ? '(Precision)' : ''}</p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Font Size:</strong> {fontSize}px</p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Font Size:</strong> {fontSize}px</p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Vertical Spacing:</strong> {verticalSpacing} ({actualRowHeight}px)</p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Font Weight:</strong> {fontWeight} ({fontWeight === 'normal' ? 400 : 700})</p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Zoom Level:</strong> {Math.round(zoomLevel * 100)}%</p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Grid Lines:</strong> {showGridLines ? 'Visible' : 'Hidden'}</p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Column Width:</strong> {columnWidthOption}</p>
        <p style={{ margin: '0' }}><strong>Background:</strong> {backgroundTheme} ({backgroundThemeHex[backgroundTheme as keyof typeof backgroundThemeHex]})</p>
        <p style={{ margin: '0' }}><strong>Text Theme:</strong> {textTheme} ({textThemeHex[textTheme as keyof typeof textThemeHex]})</p>
      </div>
    </div>
  );
};

export default ColumnVisibilityPanel;
