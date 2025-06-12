import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceMetric {
  label: string;
  value: string;
  change: number;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

interface TopProperty {
  id: string;
  title: string;
  imageUrl: string;
  price: string;
  views: number;
  inquiries: number;
}

const performanceMetrics: PerformanceMetric[] = [
  {
    label: 'Total Views',
    value: '24,593',
    change: 12,
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  },
  {
    label: 'Total Inquiries',
    value: '1,234',
    change: 5.4,
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    )
  },
  {
    label: 'Conversion Rate',
    value: '5.02%',
    change: 1.2,
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    label: 'Avg. Response Time',
    value: '2.4h',
    change: -8.5,
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

const topProperties: TopProperty[] = [
  {
    id: '1',
    title: 'Luxury Waterfront Villa',
    imageUrl: '/api/placeholder/300/200',
    price: '$2,500,000',
    views: 1234,
    inquiries: 45
  },
  {
    id: '2',
    title: 'Modern Downtown Apartment',
    imageUrl: '/api/placeholder/300/200',
    price: '$850,000',
    views: 987,
    inquiries: 32
  },
  {
    id: '3',
    title: 'Suburban Family Home',
    imageUrl: '/api/placeholder/300/200',
    price: '$650,000',
    views: 856,
    inquiries: 28
  }
];

const viewsData: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Property Views',
      data: [3500, 4200, 3800, 4800, 4100, 4900],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      tension: 0.4
    }
  ]
};

const inquiriesData: ChartData<'bar'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Property Inquiries',
      data: [150, 180, 165, 200, 185, 210],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }
  ]
};

const chartOptions: ChartOptions<'line' | 'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

// CountUp animation for numbers
function useCountUp(value: number, duration = 1200) {
  const [display, setDisplay] = React.useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    let start = 0;
    let startTime: number | null = null;
    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setDisplay(Math.floor(start + (value - start) * progress));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    }
    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value, duration]);
  return display;
}

// Revolut-style metric card
function AnimatedMetricCard({ label, value, change, icon }: { label: string; value: string; change: number; icon: any }) {
  const num = parseInt(value.replace(/[^\d]/g, ''));
  const animatedValue = useCountUp(num);
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl px-6 pt-6 pb-12 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in">
      <div className="absolute top-4 right-4 opacity-10 text-6xl pointer-events-none select-none">{icon({ className: 'w-12 h-12' })}</div>
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg bg-blue-100 p-2">{icon({ className: 'h-6 w-6 text-blue-600' })}</div>
        <span className="text-sm font-medium text-gray-500">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-gray-900">{animatedValue.toLocaleString()}</span>
        <span className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'} flex items-center animate-bounce-in`}>{change > 0 ? '↑' : '↓'}{Math.abs(change)}%</span>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            A comprehensive view of your real estate performance metrics and trends.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Animated Metric Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric) => (
          <AnimatedMetricCard key={metric.label} {...metric} />
        ))}
      </div>

      {/* Animated Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-xl animate-fade-in">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Property Views Trend</h3>
          <div className="mt-4 h-80">
            <Line options={{ ...chartOptions, animation: { duration: 1200, easing: 'easeInOutQuart' } }} data={viewsData} />
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-xl animate-fade-in">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Monthly Inquiries</h3>
          <div className="mt-4 h-80">
            <Bar options={{ ...chartOptions, animation: { duration: 1200, easing: 'easeInOutQuart' } }} data={inquiriesData} />
          </div>
        </div>
      </div>

      {/* Animated Top Properties */}
      <div className="mt-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Top Performing Properties</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topProperties.map((property, idx) => (
            <div
              key={property.id}
              className="relative rounded-2xl bg-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden rounded-t-2xl">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="h-full w-full object-cover scale-105 hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-lg font-medium text-white drop-shadow-lg">{property.title}</h4>
                  <p className="mt-1 text-sm text-white/90">{property.price}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-gray-700 font-semibold">{property.views} views</span>
                <span className="text-blue-600 font-semibold">{property.inquiries} inquiries</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 