import React from 'react';
import { Wind, Sun, Atom, Droplets, Flame, Factory } from 'lucide-react';

const FuelTypeCellRenderer: React.FC<any> = (props) => {
  const fuelType = props.value;
  let icon = null;
  let color = 'white';

  switch (fuelType) {
    case 'Wind':
      icon = <Wind size={16} />;
      color = '#86efac'; // Green
      break;
    case 'Solar':
      icon = <Sun size={16} />;
      color = '#fde047'; // Yellow
      break;
    case 'Nuclear':
      icon = <Atom size={16} />;
      color = '#e0e7ff'; // Light Blue
      break;
    case 'Hydro':
      icon = <Droplets size={16} />;
      color = '#93c5fd'; // Blue
      break;
    case 'Gas':
      icon = <Flame size={16} />;
      color = '#fdba74'; // Orange
      break;
    case 'Coal':
      icon = <Factory size={16} />;
      color = '#a3a3a3'; // Gray
      break;
    default:
      icon = null;
      color = 'white';
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: color }}>
      {icon}
      <span>{fuelType}</span>
    </div>
  );
};

export default FuelTypeCellRenderer;
