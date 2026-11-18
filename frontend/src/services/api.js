import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vicecity-motors-api.vercel.app';

const peticion = async (endpoint, opciones = {}) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opciones.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...opciones,
      headers,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const mensajeError = json.error || json.mensaje || json.message || `Error HTTP ${response.status}`;
      throw new Error(mensajeError);
    }

    return json;
  } catch (error) {
    throw new Error(error.message || 'No se pudo conectar con el servidor');
  }
};

export const registrarUsuario = async (nombre, email, password) => {
  return await peticion('/auth/registro', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password }),
  });
};

export const iniciarSesion = async (email, password) => {
  const respuesta = await peticion('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const token = respuesta.token || respuesta.data?.token;
  if (token) {
    await AsyncStorage.setItem('token', token);
  }

  return respuesta;
};

export const cerrarSesion = async () => {
  await AsyncStorage.removeItem('token');
};

export const obtenerVehiculos = async (soloDisponibles = false) => {
  const ruta = soloDisponibles ? '/vehiculos?estado=disponible' : '/vehiculos';
  const respuesta = await peticion(ruta);
  return respuesta.data || [];
};

export const obtenerVehiculoPorId = async (id) => {
  const respuesta = await peticion(`/vehiculos/${id}`);
  return respuesta.data || respuesta;
};

export const comprarVehiculo = async (vehiculoId) => {
  return await peticion('/ventas', {
    method: 'POST',
    body: JSON.stringify({
      vehiculoId: Number(vehiculoId), 
      metodoPago: 'transferencia',    
    }),
  });
};

export const obtenerMisCompras = async () => {
  const respuesta = await peticion('/ventas');
  return respuesta.data || [];
};