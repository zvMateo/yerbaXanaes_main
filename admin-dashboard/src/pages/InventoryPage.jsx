import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Archive,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  RefreshCw,
  Search,
  Eye,
  BarChart3,
  PieChart,
  Zap,
  Target,
  Calendar,
  Plus,
  Minus,
  Edit,
  ShoppingCart,
  Truck,
  RotateCcw,
  Activity,
  Bell,
  Settings,
  FileText,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  X,
  MapPin,
  Layers,
  Gauge,
  Star,
  AlertCircle,
  Info,
  PlayCircle,
  History,
  LineChart,
  Users,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  Building2,
  Tag,
  Percent,
} from "lucide-react";

const InventoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inventoryData, setInventoryData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState("overview");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const autoRefreshInterval = useRef(null);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      autoRefreshInterval.current = setInterval(() => {
        loadInventoryData();
        addNotification("Datos actualizados automáticamente", "info");
      }, 30000); // Refresh every 30 seconds
    } else {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    }

    return () => {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    };
  }, [autoRefresh]);

  const addNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [
      ...prev,
      { id, message, type, timestamp: new Date() },
    ]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  // Load inventory data
  const loadInventoryData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setInventoryData(getMockInventoryData());
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    loadInventoryData();
  }, [dateRange, categoryFilter, statusFilter]);

  const getMockInventoryData = () => ({
    overview: {
      totalProducts: 156,
      totalValue: 2847500,
      lowStockItems: 12,
      outOfStockItems: 6,
      overstockItems: 8,
      avgTurnoverRate: 4.2,
      totalMovements: 342,
      pendingReorders: 18,
      warehouseLocations: 3,
      totalSuppliers: 8,
      pendingOrders: 5,
      dailyMovements: 28,
      weeklyTrend: 12.5,
      monthlyGrowth: 8.3,
      criticalAlerts: 4,
      performance: {
        stockAccuracy: 98.5,
        fulfillmentRate: 94.2,
        inventoryTurns: 6.8,
        shrinkageRate: 0.8,
      },
    },
    alerts: {
      critical: [
        {
          id: 1,
          name: "Yerba Amanda 1kg",
          category: "Yerbas",
          currentStock: 2,
          minStock: 15,
          maxStock: 50,
          unitCost: 890,
          lastSale: "2025-01-08",
          dailyUsage: 3.2,
          daysUntilOut: 1,
          suggestedOrder: 35,
          supplier: "Distribuidora Norte",
          location: "A-01-15",
          sku: "YER-AMA-1K",
          priority: "urgent",
          impact: "high",
        },
        {
          id: 2,
          name: "Mate Calabaza Premium",
          category: "Mates",
          currentStock: 1,
          minStock: 8,
          maxStock: 25,
          unitCost: 1850,
          lastSale: "2025-01-07",
          dailyUsage: 1.5,
          daysUntilOut: 1,
          suggestedOrder: 20,
          supplier: "Artesanos del Sur",
          location: "B-02-08",
          sku: "MAT-CAL-PRE",
          priority: "urgent",
          impact: "medium",
        },
      ],
      warning: [
        {
          id: 3,
          name: "Bombilla Alpaca Artesanal",
          category: "Bombillas",
          currentStock: 4,
          minStock: 10,
          maxStock: 30,
          unitCost: 2100,
          lastSale: "2025-01-06",
          dailyUsage: 0.8,
          daysUntilOut: 5,
          suggestedOrder: 20,
          supplier: "Metales Premium",
          location: "C-03-12",
          sku: "BOM-ALP-ART",
          priority: "high",
          impact: "low",
        },
      ],
      overstock: [
        {
          id: 5,
          name: "Yerba Sin Palo 500g",
          category: "Yerbas",
          currentStock: 85,
          minStock: 10,
          maxStock: 30,
          unitCost: 750,
          lastSale: "2025-01-03",
          dailyUsage: 0.3,
          daysUntilOut: 283,
          suggestedAction: "promoción",
          turnoverRate: 0.8,
          location: "A-03-22",
          sku: "YER-SIN-500",
          priority: "medium",
          impact: "medium",
        },
      ],
    },
    products: [
      {
        id: 1,
        name: "Yerba Amanda 1kg",
        category: "Yerbas",
        sku: "YER-AMA-1K",
        currentStock: 45,
        minStock: 15,
        maxStock: 60,
        unitCost: 890,
        sellPrice: 1500,
        lastUpdated: "2025-01-08",
        supplier: "Distribuidora Norte",
        location: "A-01-15",
        turnoverRate: 6.2,
        status: "normal",
        movements30d: 24,
        avgDailySales: 3.2,
        profit: 610,
        marginPercent: 40.6,
        lastMovement: {
          type: "sale",
          quantity: -3,
          date: "2025-01-08",
          reference: "Pedido #1234",
        },
        forecast: {
          nextWeek: 22,
          nextMonth: 85,
          confidence: 87,
        },
      },
    ],
    movements: [
      {
        id: 1,
        productName: "Yerba Amanda 1kg",
        type: "sale",
        quantity: -3,
        unitCost: 890,
        totalValue: -2670,
        date: "2025-01-08 14:30",
        reference: "Pedido #1234",
        user: "Sistema",
        location: "A-01-15",
      },
      {
        id: 2,
        productName: "Mate Torpedo Cuero",
        type: "purchase",
        quantity: +5,
        unitCost: 1650,
        totalValue: +8250,
        date: "2025-01-05 09:15",
        reference: "Compra #456",
        user: "Admin",
        location: "B-02-08",
      },
      {
        id: 3,
        productName: "Bombilla Pico Loro",
        type: "adjustment",
        quantity: -1,
        unitCost: 1200,
        totalValue: -1200,
        date: "2025-01-04 16:45",
        reference: "Ajuste por daño",
        user: "Admin",
        location: "C-03-12",
      },
    ],
    analytics: {
      categoryDistribution: [
        {
          category: "Yerbas",
          products: 68,
          value: 1245000,
          percentage: 43.7,
          growth: 8.5,
        },
        {
          category: "Mates",
          products: 34,
          value: 789000,
          percentage: 27.7,
          growth: 12.3,
        },
        {
          category: "Bombillas",
          products: 28,
          value: 567000,
          percentage: 19.9,
          growth: 15.2,
        },
        {
          category: "Accesorios",
          products: 26,
          value: 246500,
          percentage: 8.7,
          growth: 6.8,
        },
      ],
      trends: {
        sales: [12, 19, 15, 27, 22, 28, 35, 42, 38, 45, 52, 48],
        stock: [85, 82, 78, 75, 73, 69, 72, 74, 71, 68, 65, 62],
        movements: [156, 189, 234, 267, 298, 312, 345, 378, 392, 445, 467, 489],
      },
      performance: {
        topPerformers: [
          {
            name: "Yerba Amanda 1kg",
            category: "Yerbas",
            score: 95,
            trend: "up",
          },
          {
            name: "Mate Calabaza Premium",
            category: "Mates",
            score: 92,
            trend: "up",
          },
          {
            name: "Bombilla Alpaca",
            category: "Bombillas",
            score: 88,
            trend: "stable",
          },
        ],
        lowPerformers: [
          {
            name: "Yerba Sin Palo 500g",
            category: "Yerbas",
            score: 45,
            trend: "down",
          },
          {
            name: "Mate Vidrio Simple",
            category: "Mates",
            score: 38,
            trend: "down",
          },
        ],
      },
    },
  });

  // Enhanced UI Components
  const EnhancedMetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    format = "number",
    color = "blue",
    subtitle,
    trend,
    onClick,
  }) => {
    const isPositive = change >= 0;
    const formattedValue =
      format === "currency"
        ? formatCurrency(value)
        : format === "percentage"
        ? `${value}%`
        : value.toLocaleString();

    const colorClasses = {
      blue: "from-blue-500 to-blue-600 text-white",
      green: "from-green-500 to-green-600 text-white",
      yellow: "from-yellow-500 to-yellow-600 text-white",
      red: "from-red-500 to-red-600 text-white",
      purple: "from-purple-500 to-purple-600 text-white",
      indigo: "from-indigo-500 to-indigo-600 text-white",
    };

    return (
      <div
        className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden`}
        onClick={onClick}
      >
        {/* Background decoration */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Icon className="h-6 w-6" />
            </div>
            {trend && (
              <div className="flex items-center text-sm bg-white/20 px-2 py-1 rounded-full">
                {trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : trend === "down" ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : (
                  <Minus className="h-3 w-3 mr-1" />
                )}
                {Math.abs(change)}%
              </div>
            )}
          </div>

          <div>
            <p className="text-sm opacity-90 mb-1">{title}</p>
            <p className="text-3xl font-bold mb-2">{formattedValue}</p>
            {subtitle && <p className="text-sm opacity-75">{subtitle}</p>}
          </div>
        </div>
      </div>
    );
  };

  const AlertCard = ({ alert, onViewDetails, onCreateOrder }) => {
    const getPriorityColor = (priority) => {
      const colors = {
        urgent: "border-red-500 bg-red-50",
        high: "border-orange-500 bg-orange-50",
        medium: "border-yellow-500 bg-yellow-50",
        low: "border-green-500 bg-green-50",
      };
      return colors[priority] || colors.medium;
    };

    const getImpactIcon = (impact) => {
      const icons = {
        high: <AlertTriangle className="h-5 w-5 text-red-600" />,
        medium: <AlertCircle className="h-5 w-5 text-yellow-600" />,
        low: <Info className="h-5 w-5 text-blue-600" />,
      };
      return icons[impact] || icons.medium;
    };

    return (
      <div
        className={`border-l-4 ${getPriorityColor(
          alert.priority
        )} p-4 rounded-r-lg hover:shadow-md transition-all duration-200`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {getImpactIcon(alert.impact)}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold text-gray-900">{alert.name}</h4>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                  {alert.sku}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Stock actual:</span>{" "}
                  {alert.currentStock}
                </div>
                <div>
                  <span className="font-medium">Stock mínimo:</span>{" "}
                  {alert.minStock}
                </div>
                <div>
                  <span className="font-medium">Ubicación:</span>{" "}
                  {alert.location}
                </div>
                <div>
                  <span className="font-medium">Días restantes:</span>
                  <span
                    className={`ml-1 font-bold ${
                      alert.daysUntilOut <= 1
                        ? "text-red-600"
                        : alert.daysUntilOut <= 5
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {alert.daysUntilOut}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewDetails(alert)}
                  className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  Ver detalles
                </button>
                <button
                  onClick={() => onCreateOrder(alert)}
                  className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                >
                  Generar orden
                </button>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(alert.unitCost * alert.suggestedOrder)}
            </div>
            <div className="text-sm text-gray-600">
              {alert.suggestedOrder} unidades
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TrendChart = ({ data, title, color = "blue" }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">{title}</h4>
        <div className="relative h-24">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke={
                color === "blue"
                  ? "#3B82F6"
                  : color === "green"
                  ? "#10B981"
                  : "#F59E0B"
              }
              strokeWidth="2"
              points={data
                .map((value, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = 100 - ((value - min) / range) * 100;
                  return `${x},${y}`;
                })
                .join(" ")}
            />
          </svg>
          <div className="absolute bottom-0 left-0 text-xs text-gray-500">
            {min}
          </div>
          <div className="absolute top-0 right-0 text-xs text-gray-500">
            {max}
          </div>
        </div>
      </div>
    );
  };

  const ProductModal = ({ product, isOpen, onClose }) => {
    if (!isOpen || !product) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {product.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Información General
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoría:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ubicación:</span>
                      <span className="font-medium">{product.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Proveedor:</span>
                      <span className="font-medium">{product.supplier}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Stock y Precios
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock actual:</span>
                      <span className="font-medium">
                        {product.currentStock}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock mínimo:</span>
                      <span className="font-medium">{product.minStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Costo unitario:</span>
                      <span className="font-medium">
                        {formatCurrency(product.unitCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precio venta:</span>
                      <span className="font-medium">
                        {formatCurrency(product.sellPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Rendimiento
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rotación:</span>
                      <span className="font-medium">
                        {product.turnoverRate}x
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Movimientos (30d):</span>
                      <span className="font-medium">
                        {product.movements30d}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Margen:</span>
                      <span className="font-medium text-green-600">
                        {product.marginPercent}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ganancia:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(product.profit)}
                      </span>
                    </div>
                  </div>
                </div>

                {product.forecast && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-3">
                      Proyección
                    </h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>Próxima semana:</span>
                        <span className="font-medium">
                          {product.forecast.nextWeek} unidades
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Próximo mes:</span>
                        <span className="font-medium">
                          {product.forecast.nextMonth} unidades
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confianza:</span>
                        <span className="font-medium">
                          {product.forecast.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NotificationToast = ({ notifications }) => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`px-4 py-3 rounded-lg shadow-lg border-l-4 bg-white ${
            notification.type === "info"
              ? "border-blue-500"
              : notification.type === "success"
              ? "border-green-500"
              : notification.type === "warning"
              ? "border-yellow-500"
              : "border-red-500"
          } animate-slide-in-right`}
        >
          <div className="flex items-center">
            <Bell className="h-4 w-4 mr-2 text-gray-600" />
            <span className="text-sm text-gray-900">
              {notification.message}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Event handlers
  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCreateOrder = (alert) => {
    addNotification(`Orden de compra creada para ${alert.name}`, "success");
  };

  const handleExportData = () => {
    addNotification("Exportando datos del inventario...", "info");
    // Simulate export
    setTimeout(() => {
      addNotification("Datos exportados exitosamente", "success");
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">
            Cargando inventario...
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Analizando datos en tiempo real
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast notifications={notifications} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Control de Inventario
                </h1>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    autoRefresh
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {autoRefresh ? "Auto-actualización ON" : "Manual"}
                </div>
              </div>
              <p className="text-gray-600">
                Gestión inteligente de stock con alertas automáticas y análisis
                predictivo
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`p-2 border rounded-lg transition-colors duration-200 ${
                    autoRefresh
                      ? "bg-green-100 border-green-300 text-green-700"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  title={
                    autoRefresh
                      ? "Desactivar auto-actualización"
                      : "Activar auto-actualización"
                  }
                >
                  <RefreshCw
                    className={`h-5 w-5 ${autoRefresh ? "animate-spin" : ""}`}
                  />
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  title="Filtros avanzados"
                >
                  <Filter className="h-5 w-5" />
                </button>

                <button
                  onClick={handleExportData}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7d">Últimos 7 días</option>
                    <option value="30d">Últimos 30 días</option>
                    <option value="90d">Últimos 3 meses</option>
                    <option value="1y">Último año</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="Yerbas">Yerbas</option>
                    <option value="Mates">Mates</option>
                    <option value="Bombillas">Bombillas</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="normal">Stock normal</option>
                    <option value="low">Stock bajo</option>
                    <option value="critical">Stock crítico</option>
                    <option value="out">Sin stock</option>
                    <option value="overstock">Sobrestock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Producto, SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            {[
              {
                id: "overview",
                label: "Resumen",
                icon: BarChart3,
                description: "Vista general del inventario",
              },
              {
                id: "alerts",
                label: "Alertas",
                icon: AlertTriangle,
                description: "Alertas críticas y recomendaciones",
                badge: inventoryData?.overview.criticalAlerts,
              },
              {
                id: "movements",
                label: "Movimientos",
                icon: Activity,
                description: "Historial de transacciones",
              },
              {
                id: "analysis",
                label: "Análisis",
                icon: LineChart,
                description: "Insights y tendencias",
              },
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`relative flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedView === view.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title={view.description}
              >
                <view.icon className="h-4 w-4 mr-2" />
                {view.label}
                {view.badge && (
                  <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {view.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Enhanced Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <EnhancedMetricCard
            title="Valor Total Inventario"
            value={inventoryData.overview.totalValue}
            change={inventoryData.overview.monthlyGrowth}
            icon={DollarSign}
            format="currency"
            color="blue"
            subtitle="Inversión total"
            trend="up"
          />
          <EnhancedMetricCard
            title="Productos Activos"
            value={inventoryData.overview.totalProducts}
            change={2.1}
            icon={Package}
            color="green"
            subtitle={`${inventoryData.overview.warehouseLocations} ubicaciones`}
            trend="up"
          />
          <EnhancedMetricCard
            title="Alertas Críticas"
            value={
              inventoryData.overview.lowStockItems +
              inventoryData.overview.outOfStockItems
            }
            change={-15.2}
            icon={AlertTriangle}
            color="red"
            subtitle="Requieren atención"
            trend="down"
          />
          <EnhancedMetricCard
            title="Precisión de Stock"
            value={inventoryData.overview.performance.stockAccuracy}
            change={2.3}
            icon={Target}
            format="percentage"
            color="purple"
            subtitle="Meta: 99%"
            trend="up"
          />
        </div>

        {/* Content based on selected view */}
        {selectedView === "overview" && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Rendimiento Diario
                  </h3>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Movimientos hoy:</span>
                    <span className="font-semibold">
                      {inventoryData.overview.dailyMovements}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Precisión cumplimiento:
                    </span>
                    <span className="font-semibold text-green-600">
                      {inventoryData.overview.performance.fulfillmentRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rotación inventario:</span>
                    <span className="font-semibold">
                      {inventoryData.overview.performance.inventoryTurns}x
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Órdenes Pendientes
                  </h3>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Por procesar:</span>
                    <span className="font-semibold">
                      {inventoryData.overview.pendingOrders}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reposiciones:</span>
                    <span className="font-semibold text-orange-600">
                      {inventoryData.overview.pendingReorders}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proveedores activos:</span>
                    <span className="font-semibold">
                      {inventoryData.overview.totalSuppliers}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tendencia Semanal
                  </h3>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crecimiento:</span>
                    <span className="font-semibold text-green-600">
                      +{inventoryData.overview.weeklyTrend}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Merma:</span>
                    <span className="font-semibold text-red-600">
                      {inventoryData.overview.performance.shrinkageRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eficiencia:</span>
                    <span className="font-semibold text-blue-600">
                      Excelente
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Alerts Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Alertas Prioritarias
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {inventoryData.alerts.critical.length +
                      inventoryData.alerts.warning.length}{" "}
                    alertas activas
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver todas
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {inventoryData.alerts.critical
                  .concat(inventoryData.alerts.warning)
                  .slice(0, 3)
                  .map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onViewDetails={handleViewProductDetails}
                      onCreateOrder={handleCreateOrder}
                    />
                  ))}
              </div>
            </div>

            {/* Enhanced Category Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Distribución por Categorías
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {inventoryData.analytics.categoryDistribution.map(
                  (category, index) => (
                    <div key={index} className="relative group">
                      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">
                            {category.category}
                          </h4>
                          <div className="flex items-center text-sm text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {category.growth}%
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Productos:
                            </span>
                            <span className="font-semibold">
                              {category.products}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Valor:
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(category.value)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Participación:
                            </span>
                            <span className="font-semibold text-blue-600">
                              {category.percentage}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {/* Enhanced Alerts View */}
        {selectedView === "alerts" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Sugerencias de Reposición
                  </h3>
                  <div className="space-y-4">
                    {inventoryData.alerts.critical
                      .concat(inventoryData.alerts.warning)
                      .map((alert) => (
                        <AlertCard
                          key={alert.id}
                          alert={alert}
                          onViewDetails={handleViewProductDetails}
                          onCreateOrder={handleCreateOrder}
                        />
                      ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <TrendChart
                  data={inventoryData.analytics.trends.stock}
                  title="Tendencia de Stock"
                  color="blue"
                />
                <TrendChart
                  data={inventoryData.analytics.trends.sales}
                  title="Tendencia de Ventas"
                  color="green"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default InventoryPage;
