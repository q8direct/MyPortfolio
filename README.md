# Crypto Portfolio Tracker

A professional cryptocurrency portfolio tracking application built with React, TypeScript, and Supabase.

![Portfolio Dashboard](https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&q=80)

## Features

- **Real-time Portfolio Tracking**: Monitor your cryptocurrency investments with live price updates
- **Multi-Exchange Support**: Connect with major exchanges like Binance, Coinbase, and Kraken
- **Manual Trade Management**: Add and track trades manually for any supported cryptocurrency
- **Advanced Charting**: Professional-grade charts powered by TradingView
- **Portfolio Analytics**: Track performance metrics, profit/loss, and ROI
- **Admin Dashboard**: Comprehensive admin interface for user and asset management
- **Secure Authentication**: Email-based authentication with Supabase

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: React Context API with custom hooks
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: TradingView integration
- **Icons**: Lucide React
- **API Integration**: CoinGecko for market data

## Architecture

The application follows a modular architecture with clear separation of concerns:

- `components/`: Reusable UI components organized by feature
- `contexts/`: React Context providers for global state
- `hooks/`: Custom React hooks for shared logic
- `services/`: API integration and external services
- `types/`: TypeScript type definitions
- `utils/`: Utility functions and helpers

## Security Features

- Row Level Security (RLS) with Supabase
- Secure API key management for exchange connections
- Rate limiting for external API calls
- Input validation and sanitization
- Secure password handling

## Database Schema

The application uses a PostgreSQL database with the following main tables:

- `profiles`: User profiles and settings
- `assets`: User cryptocurrency holdings
- `exchanges`: Connected exchange credentials
- `manual_trades`: Manually tracked trades

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```
4. Start the development server: `npm run dev`

## Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.