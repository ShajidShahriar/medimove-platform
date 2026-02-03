import { useEffect, useState } from 'react';
import { Package, Users, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Real Data
  useEffect(() => {
    const fetchStats = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      try {
        const res = await fetch(`${API_URL}/api/stats`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Cards Config
  const statCards = [
    { 
      title: 'Total Inventory', 
      value: stats?.inventory?.total || 0, 
      sub: `${stats?.inventory?.low} Low Stock`,
      icon: Package, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Active Leads', 
      value: stats?.leads?.new || 0, 
      sub: 'Requires Attention',
      icon: Users, 
      color: 'bg-emerald-500' 
    },
    { 
      title: 'Pending Quotes', 
      value: stats?.leads?.quotes || 0, 
      sub: 'Needs Pricing',
      icon: FileText, 
      color: 'bg-amber-500' 
    },
    { 
      title: 'Total Inquiries', 
      value: stats?.leads?.total || 0, 
      sub: 'All time',
      icon: AlertTriangle, 
      color: 'bg-purple-500' 
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard Overview</h1>
      
      {/* 1. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center hover:shadow-md transition-shadow">
            <div className={`${stat.color} p-4 rounded-lg text-white mr-4 shadow-sm`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. CHART SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Lead Status Analytics</h3>
        
        <div className="h-80 w-full">
          {!stats?.chartData || stats.chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              No data available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {/* Uses API data directly: [{ _id: 'New', count: 5 }, ...] */}
              <BarChart data={stats.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={60}>
                  {stats.chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={
                      entry._id === 'New' ? '#ef4444' :       // Red for New
                      entry._id === 'Contacted' ? '#f59e0b' : // Orange for Contacted
                      '#10b981'                               // Green for Closed
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}