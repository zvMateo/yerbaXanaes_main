// Datos mock centralizados para toda la aplicación

export const mockCustomers = [
  {
    _id: '1',
    name: 'María González',
    email: 'maria@email.com',
    phone: '+54 9 11 1234-5678',
    document: '12.345.678',
    address: {
      street: 'Av. Corrientes 1234',
      city: 'Buenos Aires',
      province: 'CABA',
      postalCode: '1043',
      country: 'Argentina'
    },
    stats: {
      totalOrders: 8,
      totalSpent: 24750,
      averageOrderValue: 3093.75,
      lastOrderDate: '2025-06-01',
      firstOrderDate: '2024-02-15'
    },
    marketing: {
      customerSegment: 'regular',
      preferredCategories: ['yerba', 'mates'],
      emailOptIn: true,
      smsOptIn: false,
      lastEmailSent: '2024-05-28',
      notes: 'Cliente muy fiel, siempre compra yerba La Merced.'
    },
    createdAt: '2024-02-15',
    isActive: true,
    daysSinceLastOrder: 5,
    customerLifetimeDays: 107
  },
  {
    _id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@email.com',
    phone: '+54 9 11 3456-7890',
    document: '23.456.789',
    address: {
      street: 'San Martín 567',
      city: 'Córdoba',
      province: 'Córdoba',
      postalCode: '5000',
      country: 'Argentina'
    },
    stats: {
      totalOrders: 12,
      totalSpent: 67800,
      averageOrderValue: 5650,
      lastOrderDate: '2025-06-05',
      firstOrderDate: '2024-01-10'
    },
    marketing: {
      customerSegment: 'vip',
      preferredCategories: ['yerba', 'mates', 'accesorios'],
      emailOptIn: true,
      smsOptIn: true,
      lastEmailSent: '2024-06-04',
      notes: 'Cliente VIP, compras grandes y frecuentes. Muy buen pagador.'
    },
    createdAt: '2024-01-10',
    isActive: true,
    daysSinceLastOrder: 1,
    customerLifetimeDays: 147
  },
  {
    _id: '3',
    name: 'Ana López',
    email: 'ana@email.com',
    phone: '+54 9 11 4567-8901',
    document: '34.567.890',
    address: {
      street: 'Mitre 890',
      city: 'Rosario',
      province: 'Santa Fe',
      postalCode: '2000',
      country: 'Argentina'
    },
    stats: {
      totalOrders: 1,
      totalSpent: 1850,
      averageOrderValue: 1850,
      lastOrderDate: '2025-06-04',
      firstOrderDate: '2025-06-04'
    },
    marketing: {
      customerSegment: 'new',
      preferredCategories: ['yerba'],
      emailOptIn: true,
      smsOptIn: false,
      lastEmailSent: '2024-06-04',
      notes: 'Cliente nuevo, primera compra. Potencial para crecimiento.'
    },
    createdAt: '2025-06-04',
    isActive: true,
    daysSinceLastOrder: 2,
    customerLifetimeDays: 2
  }
];

export const mockOrders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'María González',
      email: 'maria@email.com',
      phone: '+54 9 11 1234-5678',
      document: '12.345.678'
    },
    date: '2025-06-07T10:30:00',
    status: 'pending',
    type: 'presencial',
    deliveryMethod: 'pickup',
    total: 3250.00,
    subtotal: 3250.00,
    shipping: 0,
    tax: 0,
    shippingCost: 0,
    paymentMethod: 'Efectivo',
    paymentStatus: 'pending',
    items: [
      { 
        name: 'Yerba Amanda 1kg', 
        quantity: 2, 
        price: 1500,
        sku: 'YAM-1KG'
      },
      { 
        name: 'Yerba Taragüi 500g', 
        quantity: 1, 
        price: 1250,
        sku: 'YTA-500G'
      }
    ],
    shippingAddress: {
      street: 'Retiro en local',
      city: 'Buenos Aires',
      state: 'CABA',
      zipCode: '-',
      country: 'Argentina'
    },
    notes: 'Cliente prefiere retirar en horario de tarde',
    priority: 'normal'
  },
  // ...más órdenes
];

export const mockProducts = [
  {
    _id: '1',
    name: 'Yerba Amanda 1kg',
    description: 'Yerba mate tradicional argentina de excelente calidad',
    category: 'Yerbas',
    type: 'yerba',
    stockInKg: 50,
    packageSizes: [
      { sizeInKg: 1, price: 1500 },
      { sizeInKg: 0.5, price: 800 }
    ],
    isActive: true,
    imageUrl: '/images/products/yerba-amanda-1kg.jpg',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z'
  },
  {
    _id: '2',
    name: 'Mate Calabaza Natural',
    description: 'Mate de calabaza curada, ideal para principiantes',
    category: 'Mates',
    type: 'mate calabaza',
    price: 2500,
    stock: 15,
    isActive: true,
    imageUrl: '/images/products/mate-calabaza.jpg',
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-05-20T00:00:00Z'
  },
  {
    _id: '3',
    name: 'Bombilla Alpaca Premium',
    description: 'Bombilla de alpaca con filtro mejorado',
    category: 'Bombillas',
    type: 'bombilla alpaca',
    price: 1800,
    stock: 25,
    isActive: true,
    imageUrl: '/images/products/bombilla-alpaca.jpg',
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-05-15T00:00:00Z'
  }
];

export const orderStatuses = {
  pending: { 
    label: 'Pendiente', 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800'
  },
  confirmed: { 
    label: 'Confirmado', 
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  preparing: { 
    label: 'Preparando', 
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800'
  },
  shipped: { 
    label: 'Enviado', 
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800'
  },
  delivered: { 
    label: 'Entregado', 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800'
  },
  cancelled: { 
    label: 'Cancelado', 
    color: 'bg-red-50 text-red-700 border-red-200',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  }
};

export const deliveryMethods = {
  pickup: { 
    label: 'Retiro en Local', 
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Cliente retira en el local',
    shippingCost: 0
  },
  courier: { 
    label: 'Envío por Correo', 
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Envío por servicio de correo',
    shippingCost: 850
  },
  whatsapp_delivery: { 
    label: 'Acordar por WhatsApp', 
    color: 'bg-green-50 text-green-700 border-green-200',
    description: 'Coordinar entrega por WhatsApp',
    shippingCost: 0
  }
};

export const customerSegments = {
  new: {
    label: 'Nuevo',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Cliente reciente, menos de 30 días'
  },
  regular: {
    label: 'Regular',
    color: 'bg-green-50 text-green-700 border-green-200',
    description: 'Cliente establecido, compras frecuentes'
  },
  vip: {
    label: 'VIP',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Cliente de alto valor, compras grandes'
  },
  at_risk: {
    label: 'En Riesgo',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    description: 'Cliente inactivo recientemente'
  },
  inactive: {
    label: 'Inactivo',
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    description: 'Sin compras por más de 6 meses'
  }
};
