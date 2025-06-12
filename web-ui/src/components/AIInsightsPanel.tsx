import React from 'react';
import { Flame, MapPin, TrendingUp } from 'lucide-react';

// Mock analytics hook
const useDashboardAnalytics = () => {
  return {
    hotListings: [
      {
        id: '1',
        title: 'Modern Apartment in City Center',
        price: 950000,
        location: 'Bucharest - City Center',
        views: 128,
        trending: true,
      },
      {
        id: '2',
        title: 'Cozy Suburban House',
        price: 650000,
        location: 'Cluj - Suburbs',
        views: 97,
        trending: false,
      },
      {
        id: '3',
        title: 'Luxury Penthouse',
        price: 1850000,
        location: 'Constanta - Seaside',
        views: 142,
        trending: true,
      },
    ],
    leadInterest: [
      { location: 'Bucharest', count: 54 },
      { location: 'Cluj', count: 38 },
      { location: 'Constanta', count: 22 },
      { location: 'Timisoara', count: 17 },
      { location: 'Brasov', count: 11 },
    ],
    leadIntents: [
      'Buy 2BR under €2M',
      'Rent near downtown',
      'Luxury penthouse with sea view',
      'Family house with garden',
      'Short-term rental, city center',
    ],
  };
};

export const AIInsightsPanel = () => {
  const { hotListings, leadInterest, leadIntents } = useDashboardAnalytics();

  return (
    <div className="space-y-10">
      {/* Section 1: Hot Listings */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Flame className="text-red-500" /> Hot Listings This Week
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotListings.map((listing) => (
            <div key={listing.id} className="card card-hover flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{listing.title}</span>
                {listing.trending && <Flame className="text-orange-500 animate-bounce" />}
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {listing.location}
              </div>
              <div className="text-xl font-bold text-blue-700">€{listing.price.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">{listing.views} views this week</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn btn-primary">View</button>
                <button className="btn btn-secondary">Recommend</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Lead Interest Heatmap/Bar Chart */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MapPin className="text-blue-500" /> Where Leads Are Looking
        </h2>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col sm:flex-row gap-8 items-end">
            {/* Bar chart */}
            <div className="flex-1">
              <div className="flex items-end gap-4 h-40">
                {leadInterest.map((item) => (
                  <div key={item.location} className="flex flex-col items-center w-16">
                    <div
                      className="w-8 rounded-t-lg bg-blue-500 transition-all"
                      style={{ height: `${item.count * 2.5}px` }}
                    ></div>
                    <span className="mt-2 text-xs text-gray-600">{item.location}</span>
                    <span className="text-xs text-gray-400">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Legend */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500">Top searched locations this week</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: AI Lead Quality Summary */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-blue-700">🧠</span> AI Lead Quality Summary
        </h2>
        <div className="flex flex-wrap gap-3">
          {leadIntents.map((intent, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium shadow-sm text-sm"
            >
              {intent}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}; 