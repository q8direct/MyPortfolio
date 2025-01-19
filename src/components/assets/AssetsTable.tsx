import React, { useState } from 'react';
import { Plus, LayoutGrid, Table as TableIcon, History } from 'lucide-react';
import { Asset } from '../../types/asset';
import { useAssets } from '../../hooks/useAssets';
import { useAllAssets } from '../../hooks/useAllAssets';
import AddAssetModal from './AddAssetModal';
import EditAssetModal from './EditAssetModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import CloseAssetModal from './CloseAssetModal';
import GroupedAssetsView from './GroupedAssetsView';
import TableView from './TableView';
import PortfolioSummary from './PortfolioSummary';
import PortfolioLayout from '../layout/PortfolioLayout';
import { Portfolio } from '../../types/portfolio';
import { supabase } from '../../lib/supabase';

export default function AssetsTable() {
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const { assets: portfolioAssets, loading: loadingPortfolio, error: portfolioError, refetch: refetchPortfolio } = useAssets(selectedPortfolio?.id || null);
  const { assets: allAssets, loading: loadingAll, error: allError, refresh: refreshAll } = useAllAssets();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [deleteAsset, setDeleteAsset] = useState<Asset | null>(null);
  const [closeAsset, setCloseAsset] = useState<Asset | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grouped'>('table');
  const [showHistory, setShowHistory] = useState(false);

  const loading = selectedPortfolio ? loadingPortfolio : loadingAll;
  const error = selectedPortfolio ? portfolioError : allError;
  const allAssetsData = selectedPortfolio ? portfolioAssets : allAssets;
  
  const assets = showHistory 
    ? allAssetsData.filter(asset => asset.status === 'closed')
    : allAssetsData.filter(asset => asset.status === 'open');

  const handleRefresh = async () => {
    if (selectedPortfolio) {
      await refetchPortfolio();
    } else {
      await refreshAll();
    }
  };

  const handleDelete = async (asset: Asset) => {
    try {
      const { error: deleteError } = await supabase
        .from('assets')
        .delete()
        .eq('id', asset.id);

      if (deleteError) throw deleteError;
      await handleRefresh();
    } catch (err) {
      console.error('Error deleting asset:', err);
    } finally {
      setDeleteAsset(null);
    }
  };

  return (
    <div className="p-6">
      <PortfolioLayout
        selectedPortfolio={selectedPortfolio}
        onPortfolioChange={setSelectedPortfolio}
        onRefresh={handleRefresh}
        assets={assets}
      >
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {showHistory ? 'Trade History' : 'Open Positions'}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  <span>{showHistory ? 'Show Open' : 'Show History'}</span>
                </button>
                {!showHistory && (
                  <>
                    <button
                      onClick={() => setViewMode(viewMode === 'table' ? 'grouped' : 'table')}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                    >
                      {viewMode === 'table' ? (
                        <>
                          <LayoutGrid className="h-4 w-4" />
                          <span>Group View</span>
                        </>
                      ) : (
                        <>
                          <TableIcon className="h-4 w-4" />
                          <span>Table View</span>
                        </>
                      )}
                    </button>
                    {selectedPortfolio && (
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Asset</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">
              {error}
            </div>
          ) : assets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg font-medium mb-2">
                {showHistory ? 'No closed trades yet' : 'No open positions'}
              </p>
              <p className="text-sm">
                {showHistory 
                  ? 'Closed trades will appear here' 
                  : selectedPortfolio 
                    ? 'Add your first position to start tracking'
                    : 'Select a portfolio to add positions'}
              </p>
            </div>
          ) : viewMode === 'table' || showHistory ? (
            <TableView 
              assets={assets}
              onDelete={setDeleteAsset}
              onEdit={setEditAsset}
              onClose={setCloseAsset}
              showActions={!showHistory}
              showDeleteHistory={showHistory}
            />
          ) : (
            <GroupedAssetsView 
              assets={assets}
              onEdit={setEditAsset}
              onDelete={setDeleteAsset}
              onAddTrade={() => setIsAddModalOpen(true)}
            />
          )}
        </div>
      </PortfolioLayout>

      {selectedPortfolio && (
        <AddAssetModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAssetAdded={handleRefresh}
          portfolioId={selectedPortfolio.id}
        />
      )}

      <EditAssetModal
        isOpen={!!editAsset}
        asset={editAsset}
        onClose={() => setEditAsset(null)}
        onAssetUpdated={handleRefresh}
      />

      <DeleteConfirmModal
        isOpen={!!deleteAsset}
        asset={deleteAsset}
        onClose={() => setDeleteAsset(null)}
        onConfirm={() => deleteAsset && handleDelete(deleteAsset)}
      />

      <CloseAssetModal
        isOpen={!!closeAsset}
        asset={closeAsset}
        onClose={() => setCloseAsset(null)}
        onAssetClosed={handleRefresh}
      />
    </div>
  );
}