import React from 'react';
import { BarChart2, Coins, PieChart, LineChart, Grid } from 'lucide-react';

const navItems = [
  { name: 'Portfolio', path: '/', icon: PieChart },
  { name: 'Assets', path: '/assets', icon: BarChart2 },
  { name: 'Grid Bots', path: '/grid-bots', icon: Grid },
  { name: 'Coins', path: '/coins', icon: Coins },
  { name: 'Chart', path: '/chart', icon: LineChart },
];

export default function Navigation() {
  const currentPath = window.location.pathname;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                currentPath === item.path
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}