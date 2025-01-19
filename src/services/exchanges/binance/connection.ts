import { makeSignedRequest } from './request';
import { BinanceResponse } from './types';
import { ENDPOINTS } from './config';

export async function testBinanceConnection(apiKey: string, apiSecret: string): Promise<boolean> {
  if (!apiKey || !apiSecret) {
    throw new Error('Missing API credentials');
  }

  try {
    // First test system status
    const systemStatus = await fetch(`${ENDPOINTS.SYSTEM_STATUS}`);
    const statusData = await systemStatus.json();
    
    if (statusData.status !== 0) {
      throw new Error('Binance system is currently under maintenance');
    }

    // Then test account access
    const data = await makeSignedRequest<BinanceResponse>(
      ENDPOINTS.ACCOUNT,
      apiKey,
      apiSecret
    );
    
    if (!data?.canTrade) {
      throw new Error('Account trading is disabled');
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid API key')) {
        throw new Error('Invalid API key - please check your credentials');
      }
      if (error.message.includes('signature')) {
        throw new Error('Invalid API secret - please check your credentials');
      }
      throw new Error(`Connection failed: ${error.message}`);
    }
    throw new Error('Unable to connect to Binance');
  }
}