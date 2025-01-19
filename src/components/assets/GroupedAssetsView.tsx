import React from 'react';
import { Asset } from '../../types/asset';
import AssetGroup from './AssetGroup';
import { groupAssetsBySymbol } from '../../utils/assetUtils';

interface GroupedAssetsViewProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
  onAddTrade: (symbol: string) => void;
}

export default function GroupedAssetsView({ assets, onEdit, onDelete, onAddTrade }: GroupedAssetsViewProps) {
  const groupedAssets = groupAssetsBySymbol(assets);

  return (
    <div className="space-y-4">
      {Object.entries(groupedAssets).map(([symbol, assets]) => (
        <AssetGroup 
          key={symbol} 
          symbol={symbol} 
          assets={assets}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddTrade={onAddTrade}
        />
      ))}
    </div>
  );
}