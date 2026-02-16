import type { ICellRendererParams } from 'ag-grid-community';
import type { PriceDirection } from '../types';

interface PriceRendererParams extends ICellRendererParams {
  value: number;
  data: {
    PriceDirection: PriceDirection;
  };
}

const PriceCellRenderer: React.FC<PriceRendererParams> = ({ value, data }) => {
  const direction = data?.PriceDirection;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      <span style={{ width: '3em', textAlign: 'right' }}>{value}</span>
      <span style={{ width: '12px', textAlign: 'center', marginLeft: '4px' }}>
        {direction === 'up' && (
          <span style={{ color: '#ef4444', fontSize: '10px' }}>▲</span>
        )}
        {direction === 'down' && (
          <span style={{ color: '#22c55e', fontSize: '10px' }}>▼</span>
        )}
      </span>
    </div>
  );
};

export default PriceCellRenderer;
