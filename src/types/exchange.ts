export interface Exchange {
  id: string;
  name: string;
  description: string;
  logo: string;
  connected?: boolean;
  connectedAt?: string;
}