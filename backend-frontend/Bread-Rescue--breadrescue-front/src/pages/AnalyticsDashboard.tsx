import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, Package, Clock, Coffee } from 'lucide-react';

// Types TypeScript
interface AnalyticsData {
  bread_saved: Array<{ period: string; kg_saved: number }>;
  missions_delivered: Array<{ period: string; delivered: number }>;
  avg_delay: Array<{ period: string; avg_delay_hours: number }>;
  summary: {
    total_kg_saved: number;
    total_missions: number;
    delivered_missions: number;
    avg_delay_hours: number;
  };
}

type Period = 'day' | 'week' | 'month';

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<Period>('day');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulation des données (remplace l'API réelle)
  const generateMockData = (selectedPeriod: Period): AnalyticsData => {
    const periods = selectedPeriod === 'day' ? 7 : selectedPeriod === 'week' ? 12 : 12;
    const breadData = [];
    const missionsData = [];
    const delayData = [];

    for (let i = 0; i < periods; i++) {
      let periodLabel: string;
      if (selectedPeriod === 'day') {
        const date = new Date();
        date.setDate(date.getDate() - (periods - 1 - i));
        periodLabel = date.toISOString().split('T')[0];
      } else if (selectedPeriod === 'week') {
        periodLabel = `2024-W${String(40 + i).padStart(2, '0')}`;
      } else {
        const date = new Date();
        date.setMonth(date.getMonth() - (periods - 1 - i));
        periodLabel = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      breadData.push({
        period: periodLabel,
        kg_saved: Math.round((Math.random() * 50 + 10) * 100) / 100
      });

      missionsData.push({
        period: periodLabel,
        delivered: Math.floor(Math.random() * 20 + 5)
      });

      delayData.push({
        period: periodLabel,
        avg_delay_hours: Math.round((Math.random() * 8 + 2) * 100) / 100
      });
    }

    return {
      bread_saved: breadData,
      missions_delivered: missionsData,
      avg_delay: delayData,
      summary: {
        total_kg_saved: breadData.reduce((sum, item) => sum + item.kg_saved, 0),
        total_missions: missionsData.reduce((sum, item) => sum + item.delivered, 0) + Math.floor(Math.random() * 20),
        delivered_missions: missionsData.reduce((sum, item) => sum + item.delivered, 0),
        avg_delay_hours: delayData.reduce((sum, item) => sum + item.avg_delay_hours, 0) / delayData.length
      }
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = generateMockData(period);
        setData(mockData);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const formatPeriodLabel = (period: string, selectedPeriod: Period) => {
    if (selectedPeriod === 'day') {
      return new Date(period).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    } else if (selectedPeriod === 'week') {
      return period.replace('2024-W', 'S');
    } else {
      return period.replace('2024-', '').replace('-', '/');
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">❌ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🍞 Tableau de Bord Analytique
          </h1>
          <p className="text-gray-600">Suivi des missions de sauvetage de pain</p>
        </div>

        {/* Period Selector */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-md w-fit">
            {(['day', 'week', 'month'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  period === p
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p === 'day' ? 'Jour' : p === 'week' ? 'Semaine' : 'Mois'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pain Sauvé Total"
            value={`${data?.summary.total_kg_saved.toFixed(1)} kg`}
            icon={<Coffee size={24} />}
            color="#10B981"
            subtitle="Depuis le début"
          />
          <StatCard
            title="Missions Livrées"
            value={data?.summary.delivered_missions || 0}
            icon={<Package size={24} />}
            color="#3B82F6"
            subtitle={`sur ${data?.summary.total_missions} total`}
          />
          <StatCard
            title="Délai Moyen"
            value={`${data?.summary.avg_delay_hours.toFixed(1)}h`}
            icon={<Clock size={24} />}
            color="#F59E0B"
            subtitle="Claim → Livraison"
          />
          <StatCard
            title="Taux de Livraison"
            value={`${Math.round((data?.summary.delivered_missions || 0) / (data?.summary.total_missions || 1) * 100)}%`}
            icon={<TrendingUp size={24} />}
            color="#8B5CF6"
            subtitle="Missions réussies"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pain Sauvé Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Coffee className="mr-2 text-green-600" size={20} />
              Pain Sauvé par {period === 'day' ? 'Jour' : period === 'week' ? 'Semaine' : 'Mois'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.bread_saved}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period" 
                  tickFormatter={(value) => formatPeriodLabel(value, period)}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => formatPeriodLabel(value as string, period)}
                  formatter={(value: number) => [`${value} kg`, 'Pain sauvé']}
                />
                <Line 
                  type="monotone" 
                  dataKey="kg_saved" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Missions Livrées Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="mr-2 text-blue-600" size={20} />
              Missions Livrées
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.missions_delivered}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period" 
                  tickFormatter={(value) => formatPeriodLabel(value, period)}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => formatPeriodLabel(value as string, period)}
                  formatter={(value: number) => [`${value}`, 'Missions']}
                />
                <Bar dataKey="delivered" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Délai Moyen Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="mr-2 text-yellow-600" size={20} />
              Délai Moyen (Claim → Livraison)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.avg_delay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period" 
                  tickFormatter={(value) => formatPeriodLabel(value, period)}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => formatPeriodLabel(value as string, period)}
                  formatter={(value: number) => [`${value}h`, 'Délai moyen']}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_delay_hours" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 