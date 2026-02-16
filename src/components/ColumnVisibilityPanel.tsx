import { useState, useEffect } from 'react';
import type { GridApi } from 'ag-grid-community';
import type { StylingConfig, StylingActions } from '../types';
import {
  FONTS,
  BACKGROUNDS,
  TEXT_THEMES,
  ROW_HEIGHTS,
  FONT_SIZES,
  ZOOM_LEVELS,
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

const ColumnVisibilityPanel: React.FC<ColumnVisibilityPanelProps> = ({
  gridApi,
  styling,
  actions,
}) => {
  const [columns, setColumns] = useState<ColumnState[]>([]);

  useEffect(() => {
    if (!gridApi) return;

    const updateColumnStates = () => {
      const allGridColumns = gridApi.getAllGridColumns();
      if (!allGridColumns) return;

      const columnStates = allGridColumns.map((column) => ({
        id: column.getColId(),
        headerName: gridApi.getDisplayNameForColumn(column, null) || column.getColId(),
        visible: column.isVisible(),
      }));
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

  const onCheckboxChange = (columnId: string, checked: boolean) => {
    gridApi.setColumnsVisible([columnId], checked);
  };

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

  return (
    <div className={styles.panel}>
      <h3 className={styles.sectionTitle}>Column Visibility</h3>
      {columns.map((column) => (
        <div key={column.id} className={styles.checkboxItem}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={column.visible}
              onChange={(e) => onCheckboxChange(column.id, e.target.checked)}
              className={styles.checkbox}
            />
            {column.headerName}
          </label>
        </div>
      ))}

      <h3 className={styles.sectionTitle}>Font Selection</h3>
      <div className={styles.fontSelectRow}>
        <select
          value={styling.activeFont}
          onChange={(e) => actions.setActiveFont(e.target.value as keyof typeof FONTS)}
          className={styles.select}
          style={{ width: 'calc(100% - 100px)' }}
        >
          {fontOptions.map((font) => (
            <option key={font} value={font}>
              {font} ({FONTS[font].category})
            </option>
          ))}
        </select>
        <span className={styles.fontLabel}>{styling.activeFont}</span>
      </div>

      <h3 className={styles.sectionTitle}>Font Size</h3>
      <div className={styles.selectRow}>
        <select
          value={styling.fontSize}
          onChange={(e) => actions.setFontSize(parseInt(e.target.value))}
          className={styles.select}
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>

      <h3 className={styles.sectionTitle}>Vertical Spacing</h3>
      <div className={styles.selectRow}>
        <select
          value={styling.verticalSpacing}
          onChange={(e) =>
            actions.setVerticalSpacing(e.target.value as 'Small' | 'Medium' | 'Large')
          }
          className={styles.select}
        >
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
      </div>

      <h3 className={styles.sectionTitle}>Font Weight</h3>
      <div className={styles.radioGroup}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="font-weight"
            value="normal"
            checked={styling.fontWeight === 'normal'}
            onChange={() => actions.setFontWeight('normal')}
            className={styles.radioInput}
          />
          Normal
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="font-weight"
            value="bold"
            checked={styling.fontWeight === 'bold'}
            onChange={() => actions.setFontWeight('bold')}
            className={styles.radioInput}
          />
          Bold
        </label>
      </div>

      <h3 className={styles.sectionTitle}>Zoom Level</h3>
      <div className={styles.selectRow}>
        <select
          value={styling.zoomLevel}
          onChange={(e) => actions.setZoomLevel(parseFloat(e.target.value))}
          className={styles.select}
        >
          {ZOOM_LEVELS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

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

      <h3 className={styles.sectionTitle}>Column Width</h3>
      <div className={styles.selectRow}>
        <select
          value={styling.columnWidthOption}
          onChange={(e) =>
            actions.setColumnWidthOption(e.target.value as 'Narrow' | 'Medium' | 'Wide')
          }
          className={styles.select}
        >
          <option value="Narrow">Narrow</option>
          <option value="Medium">Medium</option>
          <option value="Wide">Wide</option>
        </select>
      </div>

      <h3 className={styles.sectionTitle}>Text Theme</h3>
      <div className={styles.selectRow}>
        <select
          value={styling.textTheme}
          onChange={(e) => actions.setTextTheme(e.target.value as keyof typeof TEXT_THEMES)}
          className={styles.selectWithPreview}
        >
          {textThemeOptions.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
        <div
          className={styles.colorSwatch}
          style={{ backgroundColor: TEXT_THEMES[styling.textTheme].hex }}
        />
      </div>

      <h3 className={styles.sectionTitle}>Background Colour</h3>
      <div className={styles.selectRow}>
        <select
          value={styling.backgroundTheme}
          onChange={(e) =>
            actions.setBackgroundTheme(e.target.value as keyof typeof BACKGROUNDS)
          }
          className={styles.selectWithPreview}
        >
          {backgroundOptions.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
        <div
          className={styles.colorSwatch}
          style={{ backgroundColor: BACKGROUNDS[styling.backgroundTheme].body }}
        />
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
          <strong>Font Weight:</strong> {styling.fontWeight} (
          {styling.fontWeight === 'normal' ? 400 : 700})
        </p>
        <p className={styles.settingLine}>
          <strong>Zoom Level:</strong> {Math.round(styling.zoomLevel * 100)}%
        </p>
        <p className={styles.settingLine}>
          <strong>Grid Lines:</strong> {styling.showGridLines ? 'Visible' : 'Hidden'}
        </p>
        <p className={styles.settingLine}>
          <strong>Column Width:</strong> {styling.columnWidthOption}
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
