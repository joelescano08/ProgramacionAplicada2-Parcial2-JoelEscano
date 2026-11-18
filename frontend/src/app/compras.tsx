import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { obtenerMisCompras } from '../services/api';

export default function MisComprasScreen() {
  const [compras, setCompras] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      cargarCompras();
    }, [])
  );

  const cargarCompras = async () => {
    setCargando(true);
    try {
      const lista = await obtenerMisCompras();
      setCompras(lista as any);
    } catch (error: any) {
      Alert.alert('Error al cargar historial', error.message);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tituloHeader}>Historial de Compras</Text>

      <FlatList
        data={compras}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.textoSinCompras}>Aún no has realizado ninguna compra.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.vehiculoTitle}>
              {item.vehiculo.marca} {item.vehiculo.modelo} ({item.vehiculo.anio})
            </Text>

            <View style={styles.row}>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.value}>
                {new Date(item.fecha).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Método de pago:</Text>
              <Text style={styles.value}>{item.metodoPago}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Monto pagado:</Text>
              <Text style={styles.valorMonto}>
                ${Number(item.monto).toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      />


      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  tituloHeader: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 14 },
  textoSinCompras: { textAlign: 'center', color: '#64748b', marginTop: 40, fontSize: 15 },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  vehiculoTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontSize: 14, color: '#64748b' },
  value: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  valorMonto: { fontSize: 16, fontWeight: 'bold', color: '#16a34a' },
});