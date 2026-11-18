import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Iniciar sesion' }} />
      <Stack.Screen name="registro" options={{ title: 'Crear cuenta' }} />
      <Stack.Screen name="vehiculos" options={{ title: 'Vice City Motors' }} />
      <Stack.Screen name="vehiculo/[id]" options={{ title: 'Detalle del vehiculo' }} />
      <Stack.Screen name="compras" options={{ title: 'Mis compras' }} />
    </Stack>
  );
}