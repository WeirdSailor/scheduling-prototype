import type { ICellRendererParams } from 'ag-grid-community';
import { Wind, Sun, Atom, Droplets, Flame, Factory } from 'lucide-react';
import type { FuelType } from '../types';

interface FuelTypeRendererParams extends ICellRendererParams {
  value: FuelType;
}

const FUEL_CONFIG: Record<FuelType, { icon: React.ReactNode; color: string }> = {
  Wind: { icon: <Wind size={16} />, color: '#86efac' },
  Solar: { icon: <Sun size={16} />, color: '#fde047' },
  Nuclear: { icon: <Atom size={16} />, color: '#e0e7ff' },
  Hydro: { icon: <Droplets size={16} />, color: '#93c5fd' },
  Gas: { icon: <Flame size={16} />, color: '#fdba74' },
  Coal: { icon: <Factory size={16} />, color: '#a3a3a3' },
};

const FuelTypeCellRenderer: React.FC<FuelTypeRendererParams> = ({ value }) => {
  const config = FUEL_CONFIG[value];

  if (!config) {
    return <span>{value}</span>;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: config.color }}>
      {config.icon}
      <span>{value}</span>
    </div>
  );
};

export default FuelTypeCellRenderer;
