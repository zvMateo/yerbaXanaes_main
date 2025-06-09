import React, { useState, useEffect } from 'react';
import { 
  FileText,
  Download,
  Calendar,
  Filter,
  Eye,
  Trash2,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  Package,
  TrendingUp,
  MapPin,
  DollarSign,
  FileSpreadsheet,
  FileImage,
  Mail,
  Share2,
  Search,
  Plus,
  Settings,
  Archive,
  History,
  Play,
  Pause,
  MoreVertical,
  ChevronDown,
  Info
} from 'lucide-react';
import { toast } from 'react-toastify';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState({});
  const [reportsData, setReportsData] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Simular carga de datos de reportes
  useEffect(() => {
    const loadReportsData = () => {
      setTimeout(() => {
        setReportsData(getMockReportsData());
        setIsLoading(false);
      }, 1000);
    };

    loadReportsData();
  }, []);

  const getMockReportsData = () => ({
    availableReports: [
      {
        id: 'sales-summary',
        name: 'Resumen de Ventas',
        description: 'Reporte completo de ventas por período con métricas clave',
        category: 'ventas',
        icon: BarChart3,
        estimatedTime: '2-3 min',
        lastGenerated: '2025-01-08T10:30:00',
        popularity: 95,
        fields: ['total_sales', 'orders_count', 'avg_order_value', 'conversion_rate'],
        formats: ['pdf', 'excel', 'csv'],
        hasCharts: true,
        canSchedule: true
      },
      {
        id: 'customer-analysis',
        name: 'Análisis de Clientes',
        description: 'Segmentación y comportamiento de clientes por región y frecuencia',
        category: 'clientes',
        icon: Users,
        estimatedTime: '3-4 min',
        lastGenerated: '2025-01-07T15:45:00',
        popularity: 87,
        fields: ['customer_segments', 'retention_rate', 'clv', 'geographic_distribution'],
        formats: ['pdf', 'excel'],
        hasCharts: true,
        canSchedule: true
      },
      {
        id: 'inventory-status',
        name: 'Estado de Inventario',
        description: 'Reporte detallado de stock, rotación y alertas de reposición',
        category: 'inventario',
        icon: Package,
        estimatedTime: '1-2 min',
        lastGenerated: '2025-01-08T09:15:00',
        popularity: 78,
        fields: ['stock_levels', 'low_stock_alerts', 'turnover_rate', 'reorder_suggestions'],
        formats: ['pdf', 'excel', 'csv'],
        hasCharts: false,
        canSchedule: true
      },
      {
        id: 'product-performance',
        name: 'Rendimiento de Productos',
        description: 'Análisis de productos más vendidos, rentabilidad y tendencias',
        category: 'productos',
        icon: TrendingUp,
        estimatedTime: '3-5 min',
        lastGenerated: '2025-01-06T14:20:00',
        popularity: 92,
        fields: ['top_products', 'profit_margins', 'sales_trends', 'category_performance'],
        formats: ['pdf', 'excel'],
        hasCharts: true,
        canSchedule: true
      },
      {
        id: 'geographic-sales',
        name: 'Ventas por Ubicación',
        description: 'Distribución geográfica de ventas y análisis regional',
        category: 'geografico',
        icon: MapPin,
        estimatedTime: '2-3 min',
        lastGenerated: '2025-01-05T11:30:00',
        popularity: 65,
        fields: ['sales_by_region', 'shipping_analysis', 'regional_preferences'],
        formats: ['pdf', 'excel'],
        hasCharts: true,
        canSchedule: false
      },
      {
        id: 'financial-summary',
        name: 'Resumen Financiero',
        description: 'Estados financieros, ingresos, gastos y márgenes de ganancia',
        category: 'financiero',
        icon: DollarSign,
        estimatedTime: '4-6 min',
        lastGenerated: '2025-01-04T16:00:00',
        popularity: 89,
        fields: ['revenue', 'expenses', 'profit_margins', 'cash_flow'],
        formats: ['pdf', 'excel'],
        hasCharts: true,
        canSchedule: true
      }
    ],
    generatedReports: [
      {
        id: 'rep-001',
        reportType: 'sales-summary',
        name: 'Resumen de Ventas - Enero 2025',
        generatedAt: '2025-01-08T10:30:00',
        format: 'pdf',
        fileSize: '2.4 MB',
        status: 'completed',
        downloadCount: 3,
        expiresAt: '2025-02-08T10:30:00',
        parameters: {
          dateRange: '2025-01-01 to 2025-01-31',
          includeCharts: true,
          detailLevel: 'high'
        }
      },
      {
        id: 'rep-002',
        reportType: 'customer-analysis',
        name: 'Análisis de Clientes - Q4 2024',
        generatedAt: '2025-01-07T15:45:00',
        format: 'excel',
        fileSize: '1.8 MB',
        status: 'completed',
        downloadCount: 1,
        expiresAt: '2025-02-07T15:45:00',
        parameters: {
          dateRange: '2024-10-01 to 2024-12-31',
          segmentation: 'geographic'
        }
      },
      {
        id: 'rep-003',
        reportType: 'inventory-status',
        name: 'Estado de Inventario - Semanal',
        generatedAt: '2025-01-08T09:15:00',
        format: 'csv',
        fileSize: '856 KB',
        status: 'completed',
        downloadCount: 5,
        expiresAt: '2025-01-15T09:15:00',
        parameters: {
          includeAlerts: true,
          lowStockThreshold: 10
        }
      },
      {
        id: 'rep-004',
        reportType: 'financial-summary',
        name: 'Resumen Financiero - Diciembre 2024',
        generatedAt: '2025-01-06T14:30:00',
        format: 'pdf',
        fileSize: '3.2 MB',
        status: 'generating',
        progress: 75,
        estimatedCompletion: '2025-01-08T11:45:00'
      }
    ],
    scheduledReports: [
      {
        id: 'sched-001',
        reportType: 'sales-summary',
        name: 'Resumen de Ventas Mensual',
        frequency: 'monthly',
        nextRun: '2025-02-01T09:00:00',
        lastRun: '2025-01-01T09:00:00',
        isActive: true,
        recipients: ['admin@yerbaxanaes.com', 'ventas@yerbaxanaes.com'],
        format: 'pdf',
        parameters: {
          includeCharts: true,
          emailDelivery: true
        }
      },
      {
        id: 'sched-002',
        reportType: 'inventory-status',
        name: 'Control de Stock Semanal',
        frequency: 'weekly',
        nextRun: '2025-01-13T08:00:00',
        lastRun: '2025-01-06T08:00:00',
        isActive: true,
        recipients: ['admin@yerbaxanaes.com'],
        format: 'excel',
        parameters: {
          emailDelivery: true,
          alertsOnly: false
        }
      },
      {
        id: 'sched-003',
        reportType: 'customer-analysis',
        name: 'Análisis de Clientes Trimestral',
        frequency: 'quarterly',
        nextRun: '2025-04-01T10:00:00',
        lastRun: '2025-01-01T10:00:00',
        isActive: false,
        recipients: ['admin@yerbaxanaes.com', 'marketing@yerbaxanaes.com'],
        format: 'pdf'
      }
    ],
    statistics: {
      totalReports: 156,
      reportsThisMonth: 23,
      totalDownloads: 1247,
      avgGenerationTime: 185, // segundos
      popularReport: 'sales-summary',
      scheduledActive: 8
    }
  });

  const handleGenerateReport = async (reportId, customParams = {}) => {
    setIsGenerating(prev => ({ ...prev, [reportId]: true }));
    
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('Reporte generado exitosamente');
      
      // Actualizar lista de reportes generados
      // En una app real, recargarías los datos
      
    } catch (error) {
      toast.error('Error al generar el reporte');
    } finally {
      setIsGenerating(prev => ({ ...prev, [reportId]: false }));
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      toast.info('Descargando reporte...');
      // Simular descarga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una app real, descargarías el archivo
      // window.open(`/api/reports/${reportId}/download`, '_blank');
      
      toast.success('Reporte descargado');
    } catch (error) {
      toast.error('Error al descargar el reporte');
    }
  };

  const handleScheduleReport = (report) => {
    setSelectedReport(report);
    setShowScheduleModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      generating: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status] || colors.completed;
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: CheckCircle,
      generating: Clock,
      failed: AlertCircle,
      scheduled: Calendar
    };
    const IconComponent = icons[status] || CheckCircle;
    return <IconComponent className="h-4 w-4" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      ventas: 'bg-blue-100 text-blue-800',
      clientes: 'bg-green-100 text-green-800',
      inventario: 'bg-yellow-100 text-yellow-800',
      productos: 'bg-purple-100 text-purple-800',
      geografico: 'bg-indigo-100 text-indigo-800',
      financiero: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const dateRangeOptions = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 3 meses' },
    { value: '1y', label: 'Último año' },
    { value: 'custom', label: 'Rango personalizado' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'excel', label: 'Excel', icon: FileSpreadsheet },
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'ventas', label: 'Ventas' },
    { value: 'clientes', label: 'Clientes' },
    { value: 'inventario', label: 'Inventario' },
    { value: 'productos', label: 'Productos' },
    { value: 'geografico', label: 'Geográfico' },
    { value: 'financiero', label: 'Financiero' }
  ];

  const ReportCard = ({ report, onGenerate, onSchedule }) => {
    const IconComponent = report.icon;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <IconComponent className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{report.description}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
            {report.category}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Tiempo estimado:</span>
            <span className="ml-1 font-medium">{report.estimatedTime}</span>
          </div>
          <div>
            <span className="text-gray-500">Última generación:</span>
            <span className="ml-1 font-medium">
              {report.lastGenerated ? formatDate(report.lastGenerated) : 'Nunca'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Popularidad:</span>
            <span className="ml-1 font-medium">{report.popularity}%</span>
          </div>
          <div>
            <span className="text-gray-500">Formatos:</span>
            <span className="ml-1 font-medium">{report.formats.join(', ').toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            {report.hasCharts && (
              <span className="flex items-center">
                <BarChart3 className="h-3 w-3 mr-1" />
                Gráficos
              </span>
            )}
            {report.canSchedule && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Programable
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {report.canSchedule && (
              <button
                onClick={() => onSchedule(report)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Programar
              </button>
            )}
            <button
              onClick={() => onGenerate(report.id)}
              disabled={isGenerating[report.id]}
              className={`inline-flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                isGenerating[report.id]
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isGenerating[report.id] ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Generar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const GeneratedReportRow = ({ report }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <FileText className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{report.name}</p>
            <p className="text-sm text-gray-500">{formatDate(report.generatedAt)}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
          {getStatusIcon(report.status)}
          <span className="ml-1 capitalize">
            {report.status === 'completed' ? 'Completado' :
             report.status === 'generating' ? 'Generando' :
             report.status === 'failed' ? 'Fallido' : report.status}
          </span>
        </span>
        {report.status === 'generating' && report.progress && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${report.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{report.progress}% completado</p>
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <span className="font-medium">{report.format?.toUpperCase()}</span>
        {report.fileSize && <span className="block">{report.fileSize}</span>}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {report.downloadCount || 0} descargas
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {report.status === 'completed' && (
            <>
              <button
                onClick={() => handleDownloadReport(report.id)}
                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                title="Descargar"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Compartir"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded-md flex-1"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Centro de Reportes</h1>
              <p className="mt-2 text-gray-600">
                Genera, programa y gestiona todos los reportes de tu negocio
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                <Archive className="h-4 w-4 mr-2" />
                Exportar Todo
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reportes Totales</p>
                <p className="text-2xl font-bold text-gray-900">{reportsData.statistics.totalReports}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">{reportsData.statistics.reportsThisMonth}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Descargas Totales</p>
                <p className="text-2xl font-bold text-gray-900">{reportsData.statistics.totalDownloads}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Programados Activos</p>
                <p className="text-2xl font-bold text-gray-900">{reportsData.statistics.scheduledActive}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'available', label: 'Reportes Disponibles', icon: FileText },
              { id: 'generated', label: 'Reportes Generados', icon: Archive },
              { id: 'scheduled', label: 'Programados', icon: Calendar },
              { id: 'history', label: 'Historial', icon: History }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de las pestañas */}
        {activeTab === 'available' && (
          <>
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período de Datos
                  </label>
                  <select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {dateRangeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formato de Exportación
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {formatOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar Reportes
                  </label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Reportes Disponibles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {reportsData.availableReports
                .filter(report => 
                  selectedCategory === 'all' || report.category === selectedCategory
                )
                .filter(report =>
                  searchTerm === '' || 
                  report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  report.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onGenerate={handleGenerateReport}
                  onSchedule={handleScheduleReport}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'generated' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reportes Generados</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar reportes..."
                      className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reporte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Formato/Tamaño
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descargas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportsData.generatedReports.map((report) => (
                    <GeneratedReportRow key={report.id} report={report} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="space-y-6">
            {reportsData.scheduledReports.map((scheduled) => (
              <div key={scheduled.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${scheduled.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Calendar className={`h-5 w-5 ${scheduled.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{scheduled.name}</h3>
                      <p className="text-sm text-gray-600">
                        Frecuencia: {scheduled.frequency === 'monthly' ? 'Mensual' : 
                                   scheduled.frequency === 'weekly' ? 'Semanal' : 
                                   scheduled.frequency === 'quarterly' ? 'Trimestral' : scheduled.frequency}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      scheduled.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {scheduled.isActive ? 'Activo' : 'Pausado'}
                    </span>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Próxima ejecución:</span>
                    <p className="font-medium">{formatDate(scheduled.nextRun)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Última ejecución:</span>
                    <p className="font-medium">{formatDate(scheduled.lastRun)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Destinatarios:</span>
                    <p className="font-medium">{scheduled.recipients.length} usuarios</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Historial de Reportes</h3>
            <p className="text-gray-600">
              El historial completo de reportes estará disponible próximamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
