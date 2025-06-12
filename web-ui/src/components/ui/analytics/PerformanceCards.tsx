import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-blue-50 rounded-lg">
          <span className="text-2xl text-blue-600">{icon}</span>
        </div>
        <span className={`text-sm font-medium flex items-center gap-1 ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-700">{title}</h3>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
};

export function PerformanceCards() {
  const metrics = [
    {
      title: 'Total Views',
      value: '2,847',
      change: 12.5,
      icon: '👁️',
    },
    {
      title: 'Total Inquiries',
      value: '156',
      change: 8.2,
      icon: '💬',
    },
    {
      title: 'Conversion Rate',
      value: '5.48%',
      change: -2.1,
      icon: '📈',
    },
    {
      title: 'Avg. Response Time',
      value: '2.4 min',
      change: 15.3,
      icon: '⏱️',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
        />
      ))}
    </div>
  );
} 