/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  AlertTriangle,
  DollarSign,
  MapPin,
  Eye,
  Edit,
  Percent,
  RefreshCw,
  Download,
  Bell,
  X,
  Clock,
  Users
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

// ✅ DATOS EXTENDIDOS CON MÁS FECHAS PARA FILTRADO REAL
const salesData = [
  { date: '2024-03-15', ventas: 22400, pedidos: 7, nuevosClientes: 2 },
  { date: '2024-03-20', ventas: 28900, pedidos: 9, nuevosClientes: 3 },
  { date: '2024-04-01', ventas: 31200, pedidos: 10, nuevosClientes: 4 },
  { date: '2024-04-15', ventas: 26800, pedidos: 8, nuevosClientes: 2 },
  { date: '2024-05-01', ventas: 35600, pedidos: 12, nuevosClientes: 5 },
  { date: '2024-05-15', ventas: 29400, pedidos: 9, nuevosClientes: 3 },
  { date: '2024-06-01', ventas: 24750, pedidos: 8, nuevosClientes: 3 },
  { date: '2024-06-02', ventas: 18200, pedidos: 6, nuevosClientes: 1 },
  { date: '2024-06-03', ventas: 32100, pedidos: 12, nuevosClientes: 4 },
  { date: '2024-06-04', ventas: 28500, pedidos: 9, nuevosClientes: 2 },
  { date: '2024-06-05', ventas: 41300, pedidos: 15, nuevosClientes: 6 },
  { date: '2024-06-06', ventas: 35800, pedidos: 11, nuevosClientes: 3 },
  { date: '2024-06-07', ventas: 29600, pedidos: 10, nuevosClientes: 2 },
  { date: '2024-06-08', ventas: 33200, pedidos: 11, nuevosClientes: 4 },
  { date: '2024-06-09', ventas: 27800, pedidos: 9, nuevosClientes: 2 },
  { date: '2024-06-10', ventas: 38900, pedidos: 13, nuevosClientes: 5 },
];

const topProducts = [
  { id: 1, name: 'Yerba Mate Premium 1kg', sold: 45, revenue: 67500, stock: 12, category: 'Yerbas', trend: '+12%' },
  { id: 2, name: 'Mate Calabaza Tradicional', sold: 32, revenue: 48000, stock: 8, category: 'Mates', trend: '+8%' },
  { id: 3, name: 'Yerba Suave 500g', sold: 28, revenue: 33600, stock: 25, category: 'Yerbas', trend: '+5%' },
  { id: 4, name: 'Mate Acero Inoxidable', sold: 22, revenue: 44000, stock: 3, category: 'Mates', trend: '+15%' },
  { id: 5, name: 'Yuyo Mix Digestivo', sold: 18, revenue: 27000, stock: 15, category: 'Yuyos', trend: '+3%' },
];

const geographicData = [
  { region: 'Buenos Aires', pedidos: 45, percentage: 35 },
  { region: 'Córdoba', pedidos: 28, percentage: 22 },
  { region: 'Santa Fe', pedidos: 20, percentage: 16 },
  { region: 'Mendoza', pedidos: 15, percentage: 12 },
  { region: 'Otros', pedidos: 19, percentage: 15 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const DashboardMain = () => {
  const [timeFilter, setTimeFilter] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    productsCount: 0,
    lowStockAlerts: 0,
    activePromotions: 0,
    newCustomers: 0,
    conversionRate: 0,
    pendingOrders: 0
  });

  // ✅ FUNCIÓN HELPER PARA LABELS DE PERÍODO (MOVIDA ARRIBA)
  const getPeriodLabel = useCallback((filter, dataCount) => {
    const labels = {
      '1d': 'Hoy',
      '7d': 'Últimos 7 días',
      '30d': 'Últimos 30 días',
      '90d': 'Últimos 90 días',
      '1y': 'Este año'
    };
    return `${labels[filter] || labels['7d']} (${dataCount} registros)`;
  }, []);

  // ✅ HOOK DE PERFORMANCE MONITORING AVANZADO - CON FPS INTEGRADO
  const useAdvancedPerformanceMonitor = () => {
    const [performanceData, setPerformanceData] = useState({
      renderTimes: [],
      averageRenderTime: 0,
      slowRenders: 0,
      totalRenders: 0,
      fps: 0, // 👈 Agregar FPS aquí
      memoryUsage: null // 👈 Agregar memoria aquí también
    });

    useEffect(() => {
      const startTime = performance.now();
      const componentName = 'DashboardMain';
      
      // ✅ FPS MONITORING INTEGRADO (solo en desarrollo)
      let fpsRafId;
      if (import.meta.env.DEV) {
        let fps = 0;
        let lastTime = performance.now();
        let frameCount = 0;

        const measureFPS = (currentTime) => {
          frameCount++;
          
          if (currentTime >= lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // Actualizar FPS en el estado
            setPerformanceData(prev => ({ ...prev, fps }));
            
            if (fps < 30) {
              console.warn(`🎯 Low FPS detected: ${fps} FPS`);
            }
            
            frameCount = 0;
            lastTime = currentTime;
            
            sessionStorage.setItem('dashboard-fps', fps.toString());
          }
          
          fpsRafId = requestAnimationFrame(measureFPS);
        };

        fpsRafId = requestAnimationFrame(measureFPS);
      }

      // ✅ MONITOREO DE MEMORIA INTEGRADO
      let memoryInterval;
      if ('memory' in performance) {
        const checkMemory = () => {
          const memory = performance.memory;
          const memoryUsage = {
            used: Math.round(memory.usedJSHeapSize / 1048576),
            total: Math.round(memory.totalJSHeapSize / 1048576),
            limit: Math.round(memory.jsHeapSizeLimit / 1048576)
          };

          // Actualizar memoria en el estado
          setPerformanceData(prev => ({ ...prev, memoryUsage }));

          if (memoryUsage.used > 50) {
            console.warn('🧠 High memory usage detected:', memoryUsage);
          }

          sessionStorage.setItem('dashboard-memory', JSON.stringify(memoryUsage));
        };

        memoryInterval = setInterval(checkMemory, 30000);
        checkMemory(); // Ejecutar inmediatamente
      }
      
      // Performance Observer para métricas avanzadas
      let observer;
      if ('PerformanceObserver' in window) {
        observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'measure' && entry.name.includes(componentName)) {
              console.log(`Performance measure: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
            }
          });
        });
        
        try {
          observer.observe({ entryTypes: ['measure'] });
        } catch (_) {
          console.warn('PerformanceObserver not supported for measures');
        }
      }

      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        // ✅ Cleanup FPS monitoring
        if (fpsRafId) {
          cancelAnimationFrame(fpsRafId);
        }

        // ✅ Cleanup memory monitoring
        if (memoryInterval) {
          clearInterval(memoryInterval);
        }
        
        // Actualizar métricas de performance
        setPerformanceData(prev => {
          const newRenderTimes = [...prev.renderTimes.slice(-9), renderTime];
          const newTotal = prev.totalRenders + 1;
          const newSlow = renderTime > 100 ? prev.slowRenders + 1 : prev.slowRenders;
          const newAverage = newRenderTimes.reduce((a, b) => a + b, 0) / newRenderTimes.length;

          return {
            ...prev,
            renderTimes: newRenderTimes,
            averageRenderTime: newAverage,
            slowRenders: newSlow,
            totalRenders: newTotal
          };
        });

        // Logging inteligente
        if (renderTime > 100) {
          console.warn(`🐌 ${componentName} render: ${renderTime.toFixed(2)}ms (optimización requerida)`, {
            component: componentName,
            renderTime,
            threshold: 100,
            suggestion: 'Considera memoizar más componentes o optimizar cálculos'
          });
          
          // Analytics avanzados
          if (window.gtag) {
            window.gtag('event', 'performance_slow_render', {
              event_category: 'Performance',
              event_label: componentName,
              value: Math.round(renderTime)
            });
          }
        } else if (renderTime > 50) {
          console.info(`⚡ ${componentName} render: ${renderTime.toFixed(2)}ms (bueno)`);
        } else {
          console.log(`🚀 ${componentName} render: ${renderTime.toFixed(2)}ms (excelente)`);
        }

        // Crear marca de performance para DevTools
        if ('performance' in window && 'mark' in performance) {
          performance.mark(`${componentName}-render-end`);
          
          try {
            performance.measure(
              `${componentName}-render-duration`,
              `${componentName}-render-start`,
              `${componentName}-render-end`
            );
          } catch (_) {
            performance.mark(`${componentName}-render-start`);
          }
        }

        // Cleanup observer
        if (observer) {
          observer.disconnect();
        }
      };
    }, [timeFilter, isLoading]);

    // Marcar inicio de render
    useEffect(() => {
      if ('performance' in window && 'mark' in performance) {
        performance.mark('DashboardMain-render-start');
      }
    });

    return performanceData;
  };

  // ✅ USAR EL HOOK AVANZADO CONSOLIDADO
  const performanceMetrics = useAdvancedPerformanceMonitor();

  // ❌ ELIMINAR hooks individuales
  // const useMemoryMonitor = () => { ... }; // ELIMINADO
  // useMemoryMonitor(); // ELIMINADO
  // const useFPSMonitor = () => { ... }; // ELIMINADO
  // if (import.meta.env.DEV === 'development') { // ELIMINADO
  //   useFPSMonitor(); // ELIMINADO
  // }

  // ✅ FILTRADO DINÁMICO REAL CON FECHAS
  const filteredSalesData = useMemo(() => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark('filteredSalesData-start');
    }
    
    const now = new Date();
    const days = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const filterDays = days[timeFilter] || 7;
    const cutoffDate = subDays(startOfDay(now), filterDays);
    
    const filtered = salesData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate && itemDate <= endOfDay(now);
    });
    
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark('filteredSalesData-end');
      try {
        performance.measure('filteredSalesData-duration', 'filteredSalesData-start', 'filteredSalesData-end');
      } catch (_) {
        // Ignore if marks don't exist
      }
    }
    
    console.log(`🔍 Filtrado ${timeFilter}: ${filtered.length} registros de ${salesData.length} totales`);
    return filtered;
  }, [timeFilter]);

  // ✅ CÁLCULOS OPTIMIZADOS BASADOS EN DATOS FILTRADOS
  const calculatedData = useMemo(() => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark('calculatedData-start');
    }
    
    const totalSales = filteredSalesData.reduce((sum, day) => sum + day.ventas, 0);
    const totalOrders = filteredSalesData.reduce((sum, day) => sum + day.pedidos, 0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const newCustomers = filteredSalesData.reduce((sum, day) => sum + day.nuevosClientes, 0);
    const lowStockAlerts = topProducts.filter(p => p.stock < 10).length;
    
    // ✅ CALCULAR TENDENCIAS COMPARATIVAS
    const previousPeriodData = salesData.slice(-filteredSalesData.length * 2, -filteredSalesData.length);
    const previousSales = previousPeriodData.reduce((sum, day) => sum + day.ventas, 0);
    const previousOrders = previousPeriodData.reduce((sum, day) => sum + day.pedidos, 0);
    
    const salesGrowth = previousSales > 0 ? ((totalSales - previousSales) / previousSales) * 100 : 0;
    const ordersGrowth = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0;
    
    const result = {
      totalSales,
      totalOrders,
      averageOrderValue,
      newCustomers,
      lowStockAlerts,
      activePromotions: 3,
      productsCount: 127,
      conversionRate: 3.2,
      pendingOrders: 5,
      salesGrowth: Number(salesGrowth.toFixed(1)),
      ordersGrowth: Number(ordersGrowth.toFixed(1)),
      periodLabel: getPeriodLabel(timeFilter, filteredSalesData.length)
    };

    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark('calculatedData-end');
      try {
        performance.measure('calculatedData-duration', 'calculatedData-start', 'calculatedData-end');
      } catch (_) {
        // Ignore if marks don't exist
      }
    }

    return result;
  }, [filteredSalesData, timeFilter, getPeriodLabel]);

  // ✅ FUNCIÓN DE REFRESH CON MÉTRICAS
  const handleRefresh = useCallback(() => {
    const refreshStart = performance.now();
    console.log('🔄 Iniciando refresh del dashboard...');
    
    setIsLoading(true);
    setLastUpdateTime(new Date());
    
    setTimeout(() => {
      setDashboardData(prev => ({
        ...prev,
        ...calculatedData,
        totalSales: calculatedData.totalSales + Math.floor(Math.random() * 1000 - 500),
        totalOrders: calculatedData.totalOrders + Math.floor(Math.random() * 5 - 2)
      }));
      setIsLoading(false);
      
      const refreshEnd = performance.now();
      const refreshTime = refreshEnd - refreshStart;
      console.log(`✅ Refresh completado en ${refreshTime.toFixed(2)}ms`);
      
      if (window.gtag) {
        window.gtag('event', 'dashboard_refresh', {
          event_category: 'User Interaction',
          event_label: 'manual_refresh',
          value: Math.round(refreshTime)
        });
      }
    }, 1000);
  }, [calculatedData]);

  // ✅ CARGAR DATOS INICIAL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboardData(calculatedData);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [calculatedData]);

  // ✅ AUTO-REFRESH CADA 5 MINUTOS
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        handleRefresh();
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [handleRefresh]);

  // ✅ FUNCIÓN PARA EXPORTAR MÉTRICAS DE PERFORMANCE - ACTUALIZADA
  const exportPerformanceData = useCallback(() => {
    const performanceReport = {
      component: 'DashboardMain',
      timestamp: new Date().toISOString(),
      metrics: {
        ...performanceMetrics,
        // Incluir datos de sessionStorage
        sessionFPS: sessionStorage.getItem('dashboard-fps'),
        sessionMemory: JSON.parse(sessionStorage.getItem('dashboard-memory') || 'null')
      },
      memory: performanceMetrics.memoryUsage,
      environment: {
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio,
        connectionType: navigator.connection?.effectiveType || 'unknown',
        isDevelopment: import.meta.env.DEV
      },
      dataMetrics: {
        filteredDataPoints: filteredSalesData?.length || 0,
        totalDataPoints: salesData.length,
        currentFilter: timeFilter,
        alertsCount: dismissedAlerts.size
      }
    };

    const blob = new Blob([JSON.stringify(performanceReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-performance-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [performanceMetrics, filteredSalesData, timeFilter, dismissedAlerts]);

  // ✅ FUNCIÓN DE EXPORTAR DATOS MEJORADA
  const exportData = useCallback(() => {
    const data = { 
      filteredData: filteredSalesData,
      allSalesData: salesData, 
      topProducts, 
      geographicData, 
      dashboardData,
      filter: timeFilter,
      timestamp: new Date().toISOString(),
      lastUpdate: lastUpdateTime.toISOString(),
      metrics: calculatedData
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-yerba-xanaes-${timeFilter}-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [filteredSalesData, dashboardData, timeFilter, lastUpdateTime, calculatedData]);

  // ✅ COMPONENTE STATCARD OPTIMIZADO
  const StatCard = memo(({ title, value, icon, change, color = "blue", isCurrency = false, urgent = false }) => {
    const Icon = icon;
    
    const colorClasses = useMemo(() => ({
      green: { 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-200', 
        icon: 'text-emerald-600', 
        iconBg: 'bg-emerald-100',
        text: 'text-emerald-800'
      },
      blue: { 
        bg: 'bg-blue-50', 
        border: 'border-blue-200', 
        icon: 'text-blue-600', 
        iconBg: 'bg-blue-100',
        text: 'text-blue-800'
      },
      red: { 
        bg: urgent ? 'bg-red-100' : 'bg-red-50', 
        border: urgent ? 'border-red-300' : 'border-red-200', 
        icon: 'text-red-600', 
        iconBg: 'bg-red-100',
        text: 'text-red-800'
      },
      purple: { 
        bg: 'bg-purple-50', 
        border: 'border-purple-200', 
        icon: 'text-purple-600', 
        iconBg: 'bg-purple-100',
        text: 'text-purple-800'
      },
      yellow: { 
        bg: 'bg-yellow-50', 
        border: 'border-yellow-200', 
        icon: 'text-yellow-600', 
        iconBg: 'bg-yellow-100',
        text: 'text-yellow-800'
      },
      indigo: { 
        bg: 'bg-indigo-50', 
        border: 'border-indigo-200', 
        icon: 'text-indigo-600', 
        iconBg: 'bg-indigo-100',
        text: 'text-indigo-800'
      }
    }), [urgent]);

    const classes = colorClasses[color] || colorClasses.blue;
    
    const formatValue = useCallback((val) => {
      if (isCurrency) {
        return new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
          maximumFractionDigits: 0
        }).format(val);
      }
      return val.toLocaleString('es-AR');
    }, [isCurrency]);

    return (
      <div className={`${classes.bg} border-2 ${classes.border} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${urgent ? 'animate-pulse' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${urgent ? 'text-red-700' : classes.text}`}>
              {formatValue(value)}
            </p>
            
            {change !== undefined && (
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-4 w-4 mr-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'} ${change >= 0 ? '' : 'rotate-180'}`} />
                <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? '+' : ''}{change}% vs período anterior
                </span>
              </div>
            )}
          </div>
          
          <div className={`${classes.iconBg} rounded-full p-3 ${urgent ? 'animate-bounce' : ''}`}>
            <Icon className={`h-6 w-6 ${classes.icon}`} />
          </div>
        </div>
        
        {urgent && (
          <div className="mt-3 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
            ⚠️ Requiere atención inmediata
          </div>
        )}
      </div>
    );
  });

  // ✅ COMPONENTE DE ALERTAS OPTIMIZADO - SIN USEMEMO
  const QuickAlerts = memo(() => {
    const alerts = [
      { 
        id: 'stock-mate-acero',
        type: 'stock', 
        message: 'Mate Acero tiene stock bajo (3 unidades)', 
        urgent: true,
        action: () => console.log('Navigate to product')
      },
      { 
        id: 'pending-orders',
        type: 'order', 
        message: '2 pedidos pendientes de más de 24h', 
        urgent: true,
        action: () => console.log('Navigate to orders')
      },
      { 
        id: 'promo-expiring',
        type: 'promo', 
        message: 'Promoción "VERANO2024" expira en 3 días', 
        urgent: false,
        action: () => console.log('Navigate to promotions')
      }
    ].filter(alert => !dismissedAlerts.has(alert.id)); // Sin useMemo

    const dismissAlert = useCallback((alertId) => {
      setDismissedAlerts(prev => new Set([...prev, alertId]));
    }, []);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Alertas Rápidas</h3>
          <div className="flex items-center space-x-1">
            <Bell className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">{alerts.length} pendientes</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">No hay alertas pendientes</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.urgent 
                    ? 'bg-red-50 border-red-400 text-red-800' 
                    : 'bg-yellow-50 border-yellow-400 text-yellow-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={alert.action}
                        className="text-xs px-2 py-1 bg-white rounded border hover:bg-gray-50 transition-colors"
                      >
                        Ver detalles
                      </button>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 ml-2 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <Link 
          to="/admin/alerts" 
          className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-4 font-medium transition-colors"
        >
          Ver todas las alertas →
        </Link>
      </div>
    );
  });

  // ✅ COMPONENTE DE GRÁFICO OPTIMIZADO
  const SalesChart = memo(({ data, filter }) => (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => format(new Date(value), filter === '1d' ? 'HH:mm' : 'dd/MM')}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value, name) => [
            name === 'ventas' ? `$${value.toLocaleString('es-AR')}` : value,
            name === 'ventas' ? 'Ventas' : 'Pedidos'
          ]}
          labelFormatter={(value) => format(new Date(value), 'dd MMMM yyyy', { locale: es })}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="ventas" 
          stroke="#3B82F6" 
          fill="url(#colorVentas)"
          strokeWidth={2}
        />
        <defs>
          <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  ));

  // ✅ COMPONENTES AUXILIARES MEMOIZADOS
  const LowStockAlert = memo(({ product }) => (
    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-150">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-900">{product.name}</p>
          <p className="text-xs text-red-600">
            Stock actual: {product.stock} {product.unit}
          </p>
        </div>
      </div>
      <Link
        to={`/admin/products/${product.id}`}
        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-200 transition-colors duration-150"
      >
        <Edit className="h-4 w-4" />
      </Link>
    </div>
  ));

  const ProductRow = memo(({ product, index }) => (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">{product.category}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center">
          <Package className="h-4 w-4 text-gray-400 mr-2" />
          <span>{product.sold} unidades</span>
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
            product.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.trend}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
        ${product.revenue.toLocaleString('es-AR')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          product.stock <= 5 ? 'bg-red-100 text-red-800' : 
          product.stock <= 10 ? 'bg-yellow-100 text-yellow-800' : 
          'bg-green-100 text-green-800'
        }`}>
          Stock: {product.stock}
          {product.stock <= 5 && <AlertTriangle className="h-3 w-3 ml-1" />}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center space-x-2">
          <Link
            to={`/admin/products/${product.id}`}
            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors duration-150"
            title="Ver producto"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors duration-150"
            title="Editar producto"
          >
            <Edit className="h-4 w-4" />
          </Link>
        </div>
      </td>
    </tr>
  ));

  // ✅ COMPONENTE DEBUG PARA DESARROLLO - ACTUALIZADO CON FPS Y MEMORIA
  const PerformanceDebugInfo = memo(() => {
    if (!import.meta.env.DEV) return null;
    
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg text-xs font-mono mb-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <span>📊 Renders: {performanceMetrics.totalRenders}</span>
            <span>⚡ Avg: {performanceMetrics.averageRenderTime.toFixed(1)}ms</span>
            <span>🐌 Slow: {performanceMetrics.slowRenders}</span>
            {performanceMetrics.fps > 0 && <span>🎯 FPS: {performanceMetrics.fps}</span>}
            {performanceMetrics.memoryUsage && (
              <span>🧠 RAM: {performanceMetrics.memoryUsage.used}MB/{performanceMetrics.memoryUsage.total}MB</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => console.table(performanceMetrics)}
              className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
            >
              Log Metrics
            </button>
            <button
              onClick={exportPerformanceData}
              className="px-2 py-1 bg-green-600 rounded text-xs hover:bg-green-700"
            >
              Export Perf
            </button>
          </div>
        </div>
      </div>
    );
  });

  // ✅ LOADING SKELETON MEJORADO CON MÉTRICAS
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <PerformanceDebugInfo />
        
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="flex space-x-3">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-8 gap-4 lg:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PerformanceDebugInfo />
      
      {/* ✅ HEADER MEJORADO CON INFORMACIÓN DE FILTRO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Yerba Xanaes</h1>
          <p className="text-gray-600 mt-1">
            {calculatedData.periodLabel} - Actualizado: {format(lastUpdateTime, 'HH:mm:ss')}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="1d">Hoy</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Este año</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
            title="Actualizar datos"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </button>
          
          <button 
            onClick={exportData}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
            title="Exportar datos filtrados"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>

          {/* ✅ BOTÓN DE PERFORMANCE (SOLO EN DEV) */}
          {import.meta.env.DEV && (
            <button 
              onClick={exportPerformanceData}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
              title="Exportar métricas de performance"
            >
              📊 Perf
            </button>
          )}
        </div>
      </div>

      {/* ✅ GRID DE KPIs CON TENDENCIAS REALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-8 gap-4 lg:gap-6">
        <div className="sm:col-span-1 lg:col-span-1 xl:col-span-2 2xl:col-span-2">
          <StatCard
            title="Ventas Totales"
            value={dashboardData.totalSales}
            icon={DollarSign}
            change={calculatedData.salesGrowth}
            color="green"
            isCurrency
          />
        </div>
        <StatCard
          title="Pedidos"
          value={dashboardData.totalOrders}
          icon={ShoppingBag}
          change={calculatedData.ordersGrowth}
          color="blue"
        />
        <StatCard
          title="Ticket Promedio"
          value={dashboardData.averageOrderValue}
          icon={TrendingUp}
          change={-2.1}
          color="purple"
          isCurrency
        />
        <StatCard
          title="Productos"
          value={dashboardData.productsCount}
          icon={Package}
          change={5.4}
          color="indigo"
        />
        <StatCard
          title="Stock Bajo"
          value={dashboardData.lowStockAlerts}
          icon={AlertTriangle}
          color="red"
          urgent={dashboardData.lowStockAlerts > 3}
        />
        <StatCard
          title="Nuevos Clientes"
          value={dashboardData.newCustomers}
          icon={Users}
          change={15.3}
          color="yellow"
        />
      </div>

      {/* ✅ GRÁFICO CON DATOS FILTRADOS */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tendencia de Ventas</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{calculatedData.periodLabel}</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Ventas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Pedidos</span>
                </div>
              </div>
            </div>
          </div>
          <SalesChart data={filteredSalesData} filter={timeFilter} />
        </div>

        <div className="xl:col-span-1">
          <QuickAlerts />
        </div>
      </div>

      {/* ✅ PRODUCTOS MÁS VENDIDOS Y MÉTRICAS GEOGRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
              <Link 
                to="/admin/products" 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Ver todos →
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendidos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <ProductRow key={product.id} product={product} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Ventas por Región</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={geographicData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="pedidos"
                  label={({ percentage }) => `${percentage}%`}
                >
                  {geographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value} pedidos`, props.payload.region]}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {geographicData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-gray-700">{entry.region}</span>
                  </div>
                  <span className="font-medium text-gray-900">{entry.pedidos}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas del Período</h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-gray-900">{dashboardData.newCustomers}</p>
                <p className="text-xs text-gray-600">Nuevos Clientes</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{dashboardData.conversionRate}%</p>
                <p className="text-xs text-gray-600">Conversión</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {filteredSalesData.length}
                </p>
                <p className="text-xs text-gray-600">Días con Datos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ ALERTAS DE STOCK BAJO */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Alertas de Stock Bajo</h3>
            <Link 
              to="/admin/inventory"
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              Ver inventario completo →
            </Link>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 1, name: 'Yerba Mate Premium 1kg', stock: 3, unit: 'kg' },
            { id: 2, name: 'Mate Acero Inoxidable', stock: 2, unit: 'unidades' },
            { id: 3, name: 'Yuyo Digestivo', stock: 1, unit: 'kg' },
            { id: 4, name: 'Mate Calabaza Chico', stock: 4, unit: 'unidades' },
          ].map((product) => (
            <LowStockAlert key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;