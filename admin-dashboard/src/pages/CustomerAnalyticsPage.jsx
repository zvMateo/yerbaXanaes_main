import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign, 
  ArrowLeft,
  Star,
  UserCheck,
  AlertTriangle,
  Clock,
  Activity,
  PieChart,
  Target
} from 'lucide-react';

const CustomerAnalyticsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/customers"
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics de Clientes</h1>
            <p className="text-gray-600 mt-1">
              Análisis detallado del comportamiento y segmentación de clientes
            </p>
          </div>
        </div>
        
        <Link
          to="/admin/customers"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Users className="h-4 w-4 mr-2" />
          Ver Lista de Clientes
        </Link>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white shadow rounded-lg p-12 text-center">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
          <BarChart3 className="h-12 w-12 text-blue-600" />
        </div>
        
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          📊 Analytics de Clientes
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
          Esta página estará disponible próximamente con análisis detallados de 
          comportamiento de clientes, segmentación avanzada, métricas de retención y 
          predicciones de valor de vida del cliente (LTV).
        </p>
        
        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Segmentación Inteligente</h3>
            <p className="text-sm text-gray-600">
              Análisis automático de clientes por comportamiento, valor y frecuencia de compra
            </p>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Métricas de Retención</h3>
            <p className="text-sm text-gray-600">
              Análisis de fidelidad, churn rate y patrones de recompra de clientes
            </p>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Valor de Vida (LTV)</h3>
            <p className="text-sm text-gray-600">
              Predicciones del valor futuro de cada cliente y ROI por segmento
            </p>
          </div>
          
          <div className="text-center p-6 bg-orange-50 rounded-lg">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PieChart className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Análisis Geográfico</h3>
            <p className="text-sm text-gray-600">
              Distribución de clientes por región y análisis de mercado local
            </p>
          </div>
          
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Alertas de Riesgo</h3>
            <p className="text-sm text-gray-600">
              Identificación automática de clientes en riesgo de abandono
            </p>
          </div>
          
          <div className="text-center p-6 bg-yellow-50 rounded-lg">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Campañas Dirigidas</h3>
            <p className="text-sm text-gray-600">
              Recomendaciones de marketing personalizado por segmento de cliente
            </p>
          </div>
        </div>

        {/* Current Features */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Funcionalidades Actuales Disponibles:
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/admin/customers"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users className="h-4 w-4 mr-2" />
              Lista de Clientes
            </Link>
            <span className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg">
              <UserCheck className="h-4 w-4 mr-2" />
              Segmentación Básica
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg">
              <Activity className="h-4 w-4 mr-2" />
              Métricas por Cliente
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg">
              <Star className="h-4 w-4 mr-2" />
              Clasificación VIP
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Preview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
              <p className="text-xs text-gray-400">datos de muestra</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Clientes Activos</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
              <p className="text-xs text-gray-400">100% activos</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Clientes VIP</p>
              <p className="text-2xl font-semibold text-gray-900">1</p>
              <p className="text-xs text-gray-400">33% del total</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Valor Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">$28.3K</p>
              <p className="text-xs text-gray-400">por cliente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalyticsPage;