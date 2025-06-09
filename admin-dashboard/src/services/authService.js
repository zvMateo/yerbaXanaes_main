// Servicio de autenticación con datos mock para desarrollo
const authService = {
  login: async (email, password) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Credenciales de demostración
    const validCredentials = {
      'tu@email.com': '********',
      'admin@yerbaxanaes.com': 'admin123',
      'demo@yerbaxanaes.com': 'demo123'
    };

    if (validCredentials[email] && validCredentials[email] === password) {
      const mockUser = {
        id: '1',
        email: email,
        name: 'Administrador YerbaXanaes',
        role: 'admin',
        avatar: '/images/logoYerbaXanaes.png'
      };

      const mockToken = btoa(JSON.stringify({ 
        userId: mockUser.id, 
        email: mockUser.email,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
      }));

      return {
        user: mockUser,
        token: mockToken
      };
    } else {
      throw new Error('Credenciales inválidas. Intenta con tu@email.com y ********');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  validateToken: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const payload = JSON.parse(atob(token));
      
      // Verificar si el token ha expirado
      if (payload.exp < Date.now()) {
        throw new Error('Token expired');
      }

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        id: payload.userId,
        email: payload.email,
        name: 'Administrador YerbaXanaes',
        role: 'admin',
        avatar: '/images/logoYerbaXanaes.png'
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token));
      return {
        id: payload.userId,
        email: payload.email,
        name: 'Administrador YerbaXanaes',
        role: 'admin'
      };
    } catch {
      return null;
    }
  }
};

export default authService;