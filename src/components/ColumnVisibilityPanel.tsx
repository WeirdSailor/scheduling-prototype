import { useState, useEffect } from 'react';
import type { GridApi } from 'ag-grid-community';
import type { StylingConfig, StylingActions } from '../types';
import {
  FONTS,
  BACKGROUNDS,
  TEXT_THEMES,
  ROW_HEIGHTS,
  FONT_SIZES,
  FONT_WEIGHTS,
  ZOOM_LEVELS,
  COLUMN_WIDTH_BUFFERS,
} from '../config/themes';
import styles from './ColumnVisibilityPanel.module.css';

interface ColumnVisibilityPanelProps {
  gridApi: GridApi;
  styling: StylingConfig;
  actions: StylingActions;
}

interface ColumnState {
  id: string;
  headerName: string;
  visible: boolean;
}

type DropdownKey =
  | 'columns'
  | 'font'
  | 'fontSize'
  | 'verticalSpacing'
  | 'fontWeight'
  | 'zoomLevel'
  | 'columnWidth'
  | 'textTheme'
  | 'background';

const ColumnVisibilityPanel: React.FC<ColumnVisibilityPanelProps> = ({
  gridApi,
  styling,
  actions,
}) => {
  const [columns, setColumns] = useState<ColumnState[]>([]);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);

  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  useEffect(() => {
    if (!gridApi) return;

    const updateColumnStates = () => {
      const allGridColumns = gridApi.getAllGridColumns();
      if (!allGridColumns) return;

      const columnStates = allGridColumns.map((column) => {
        const colId = column.getColId();
        let headerName = gridApi.getDisplayNameForColumn(column, null) || colId;
        if (colId === '0' || headerName === '') {
          headerName = 'Tick box';
        }
        return {
          id: colId,
          headerName,
          visible: column.isVisible(),
        };
      });
      setColumns(columnStates);
    };

    updateColumnStates();

    const events = [
      'columnVisible',
      'columnMoved',
      'columnPinned',
      'columnGroupOpened',
      'displayedColumnsChanged',
    ] as const;

    events.forEach((event) => gridApi.addEventListener(event, updateColumnStates));

    return () => {
      events.forEach((event) => gridApi.removeEventListener(event, updateColumnStates));
    };
  }, [gridApi]);

  if (!gridApi) {
    return (
      <div className={styles.panelLoading}>
        <h3>Column Visibility</h3>
        <div>Awaiting gridApi...</div>
      </div>
    );
  }

  const fontOptions = Object.keys(FONTS) as (keyof typeof FONTS)[];
  const backgroundOptions = Object.keys(BACKGROUNDS) as (keyof typeof BACKGROUNDS)[];
  const textThemeOptions = Object.keys(TEXT_THEMES) as (keyof typeof TEXT_THEMES)[];
  const verticalSpacingOptions: ('Small' | 'Medium' | 'Large')[] = ['Small', 'Medium', 'Large'];
  const columnWidthOptions: ('Narrow' | 'Medium' | 'Wide')[] = ['Narrow', 'Medium', 'Wide'];

  const visibleCount = columns.filter((col) => col.visible).length;

  const onColumnToggle = (columnId: string, checked: boolean) => {
    gridApi.setColumnsVisible([columnId], checked);
  };

  return (
    <div className={styles.panel}>
      {/* Column Selection - Multi Select */}
      <h3 className={styles.sectionTitle}>Column Selection</h3>
      <div className={styles.dropdownContainer}>
        <button
          type="button"
          className={styles.dropdownButton}
          onClick={() => toggleDropdown('columns')}
        >
          <span>{visibleCount} of {columns.length} columns</span>
          <span className={styles.dropdownArrow}>{openDropdown === 'columns' ? '▲' : '▼'}</span>
        </button>
        {openDropdown === 'columns' && (
          <div className={styles.dropdownMenu}>
            {columns.map((column) => (
              <label key={column.id} className={styles.dropdownItem}>
                <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={(e) => onColumnToggle(column.id, e.target.checked)}
                  className={styles.checkbox}
                />
                {column.headerName}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Font Selection - Single Select */}
      <h3 className={styles.sectionTitle}>Font Selection</h3>
      <div className={styles.dropdownContainer}>
        <button
          type="button"
          className={styles.dropdownButton}
          onClick={() => toggleDropdown('font')}
        >
          <span>{styling.activeFont} ({FONTS[styling.activeFont].category})</span>
          <span className={styles.dropdownArrow}>{openDropdown === 'font' ? '▲' : '▼'}</span>
        </button>
        {openDropdown === 'font' && (
          <div className={styles.dropdownMenu}>
            {fontOptions.map((font) => (
              <div
                key={font}
                className={`${styles.dropdownItemSingle} ${styling.activeFont === font ? styles.dropdownItemSelected : ''}`}
                onClick={() => {
                  actions.setActiveFont(font);
                  closeDropdown();
                }}
              >
                {font} ({FONTS[font].category})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Font Size - Single Select */}
      <h3 className={styles.sectionTitle}>Font Size</h3>
      <div className={styles.dropdownContainer}>
        <button
          type="button"
          className={styles.dropdownButton}
          onClick={() => toggleDropdown('fontSize')}
        >
          <span>{styling.fontSize}px</span>
          <span className={styles.dropdownArrow}>{openDropdown === 'fontSize' ? '▲' : '▼'}</span>
        </button>
        {openDropdown === 'fontSize' && (
          <div className={styles.dropdownMenu}>
            {FONT_SIZES.map((size) => (
              <div
                key={size}
                className={`${styles.dropdownItemSingle} ${styling.fontSize === size ? styles.dropdownItemSelected : ''}`}
                onClick={() => {
                  actions.setFontSize(size);
                  closeDropdown();
                }}
              >
                {size}px
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vertical Spacing - Single Select */}
      <h3 className={styles.sectionTitle}>Vertical Spacing</h3>
      <div className={styles.dropdownContainer}>
        <button
          type="button"
          className={styles.dropdownButton}
          onClick={() => toggleDropdown('verticalSpacing')}
        >
          <span>{styling.verticalSpacing} ({ROW_HEIGHTS[styling.verticalSpacing]}px)</span>
          <span className={styles.dropdownArrow}>{openDropdown === 'verticalSpacing' ? '▲' : '▼'}</span>
        </button>
        {openDropdown === 'verticalSpacing' && (
          <div className={styles.dropdownMenu}>
            {verticalSpacingOptions.map((option) => (
              <div
                key={option}
                className={`${styles.dropdownItemSingle} ${styling.verticalSpacing === option ? styles.dropdownItemSelected : ''}`}
                onClick={() => {
                  actions.setVerticalSpacing(option);
                  closeDropdown();
                }}
              >
                {option} ({ROW_HEIGHTS[option]}px)
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Font Weight - Dropdown */}
      <h3 className={styles.sectionTitle}>Font Weight</h3>
      <div className={styles.dropdownContainer}>
        <button
          type="button"
          className={styles.dropdownButton}
          onClick={() => toggleDropdown('fontWeight')}
        >
          <span>{FONT_WEIGHTS.find(w => w.value === styling.fontWeight)?.label || styling.fontWeight}</span>
          <span className={styles.dropdownArrow}>{openDropdown === 'fontWeight' ? '▲' : '▼'}</span>
        </button>
        {openDropdown === 'fontWeight' && (
          <div className={styles.dropdownMenu}>
            {FONT_WEIGHTS.map(({ value, label }) => (
              <div
                key={value}
                className={`${styles.dropdownItemSingle} ${styling.fontWeight === value ? styles.dropdownItemSelected : ''}`}
                onClick={() => {
                  actions.setFontWeight(value);
                  closeDropdown();
                }}
              >
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Level - Single Select */}
      <h3 className={styles.sectionTitle}>Zoom Level</h3>
      <div className={styles.dropdownContainer}>
        <button
          type="button"
          className={styles.dropdownButton}
          onClick={() => toggleDropdown('zoomLevel')}
        >
          <span>{ZOOM_LEVELS.find(z => z.value === styling.zoomLevel)?.label || `${Math.round(styling.zoomLevel * 100)}%`}</span>
          <span className={styles.dropdownArrow}>{openDropdown === 'zoomLevel' ? '▲' : '▼'}</span>
        </button>
        {openDropdown === 'zoomLevel' && (
          <div className={styles.dropdownMenu}>
            {ZOOM_LEVELS.map(({ value, label }) => (
              <div
                key={value}
                className={`${styles.dropdownItemSingle} ${styling.zoomLevel === value ? styles.dropdownItemSelected : ''}`}
                onClick={() => {
                  actions.setZoomLevel(value);
                  closeDropdown();
                }}
              >
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid Lines - Checkbox (keeping as is) */}
      <h3 className={styles.sectionTitle}>Grid Lines</h3>
      <div className={styles.radioGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={styling.showGridLines}
            onChange={(e) => actions.setShowGridLines(e.target.checked)}
            className={styles.checkbox}
          />
          Show Grid Lines
        </label>
      </div>

      {/* Column Width - Single Select */}
      <h3 className={styles.sectionTitle}>Column Width</h3>
      <div className={styles.dropdownContainer}>
        <button
          type="button"
          className={styles.dropdownButton}
          onClick={() => toggleDropdown('columnWidth')}
        >
          <span>{styling.columnWidthOption}</span>
          <span className={styles.dropdownArrow}>{openDropdown === 'columnWidth' ? '▲' : '▼'}</span>
        </button>
        {openDropdown === 'columnWidth' && (
          <div className={styles.dropdownMenu}>
            {columnWidthOptions.map((option) => (
              <div
                key={option}
                className={`${styles.dropdownItemSingle} ${styling.columnWidthOption === option ? styles.dropdownItemSelected : ''}`}
                onClick={() => {
                  actions.setColumnWidthOption(option);
                  closeDropdown();
                }}
              >
                {option} (Auto-fit + {COLUMN_WIDTH_BUFFERS[option]}px)
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Text Theme - Single Select with color swatch */}
      <h3 className={styles.sectionTitle}>Text Theme</h3>
      <div className={styles.dropdownContainer}>
        <button
          type="button"
          className={styles.dropdownButton}
          onClick={() => toggleDropdown('textTheme')}
        >
          <span className={styles.dropdownButtonContent}>
            <span>{styling.textTheme}</span>
            <span
              className={styles.colorSwatchSmall}
              style={{ backgroundColor: TEXT_THEMES[styling.textTheme].hex }}
            />
          </span>
          <span className={styles.dropdownArrow}>{openDropdown === 'textTheme' ? '▲' : '▼'}</span>
        </button>
        {openDropdown === 'textTheme' && (
          <div className={styles.dropdownMenu}>
            {textThemeOptions.map((theme) => (
              <div
                key={theme}
                className={`${styles.dropdownItemSingle} ${styling.textTheme === theme ? styles.dropdownItemSelected : ''}`}
                onClick={() => {
                  actions.setTextTheme(theme);
                  closeDropdown();
                }}
              >
                <span className={styles.dropdownItemWithSwatch}>
                  <span>{theme}</span>
                  <span
                    className={styles.colorSwatchSmall}
                    style={{ backgroundColor: TEXT_THEMES[theme].hex }}
                  />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Background Colour - Single Select with color swatch */}
      <h3 className={styles.sectionTitle}>Background Colour</h3>
      <div className={styles.dropdownContainer}>
        <button
          type="button"
          className={styles.dropdownButton}
          onClick={() => toggleDropdown('background')}
        >
          <span className={styles.dropdownButtonContent}>
            <span>{styling.backgroundTheme}</span>
            <span
              className={styles.colorSwatchSmall}
              style={{ backgroundColor: BACKGROUNDS[styling.backgroundTheme].body }}
            />
          </span>
          <span className={styles.dropdownArrow}>{openDropdown === 'background' ? '▲' : '▼'}</span>
        </button>
        {openDropdown === 'background' && (
          <div className={styles.dropdownMenu}>
            {backgroundOptions.map((theme) => (
              <div
                key={theme}
                className={`${styles.dropdownItemSingle} ${styling.backgroundTheme === theme ? styles.dropdownItemSelected : ''}`}
                onClick={() => {
                  actions.setBackgroundTheme(theme);
                  closeDropdown();
                }}
              >
                <span className={styles.dropdownItemWithSwatch}>
                  <span>{theme}</span>
                  <span
                    className={styles.colorSwatchSmall}
                    style={{ backgroundColor: BACKGROUNDS[theme].body }}
                  />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 className={styles.sectionTitle}>Current Settings</h3>
      <div className={styles.settingsBox}>
        <p className={styles.settingLine}>
          <strong>Font:</strong> {styling.activeFont} ({FONTS[styling.activeFont].category})
        </p>
        <p className={styles.settingLine}>
          <strong>Font Size:</strong> {styling.fontSize}px
        </p>
        <p className={styles.settingLine}>
          <strong>Vertical Spacing:</strong> {styling.verticalSpacing} (
          {ROW_HEIGHTS[styling.verticalSpacing]}px)
        </p>
        <p className={styles.settingLine}>
          <strong>Font Weight:</strong> {styling.fontWeight}
        </p>
        <p className={styles.settingLine}>
          <strong>Zoom Level:</strong> {Math.round(styling.zoomLevel * 100)}%
        </p>
        <p className={styles.settingLine}>
          <strong>Grid Lines:</strong> {styling.showGridLines ? 'Visible' : 'Hidden'}
        </p>
        <p className={styles.settingLine}>
          <strong>Column Width:</strong> {styling.columnWidthOption} (Auto-fit + {COLUMN_WIDTH_BUFFERS[styling.columnWidthOption]}px)
        </p>
        <p className={styles.settingLine}>
          <strong>Background:</strong> {styling.backgroundTheme} (
          {BACKGROUNDS[styling.backgroundTheme].body})
        </p>
        <p className={styles.settingLine}>
          <strong>Text Theme:</strong> {styling.textTheme} ({TEXT_THEMES[styling.textTheme].hex})
        </p>
      </div>
    </div>
  );
};

export default ColumnVisibilityPanel;
