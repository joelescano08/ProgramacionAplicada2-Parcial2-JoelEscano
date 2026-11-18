import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { obtenerVehiculos, cerrarSesion } from '../services/api';

export default function VehiculosScreen() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      cargarVehiculos();
    }, [soloDisponibles])
  );

  const cargarVehiculos = async () => {
    setCargando(true);
    try {
      const lista = await obtenerVehiculos(soloDisponibles);
      setVehiculos(lista);
    } catch (error) {
      Alert.alert('Error al cargar catalogo');
    } finally {
      setCargando(false);
    }
  };

  const handleCerrarSesion = async () => {
    await cerrarSesion(); 
    router.replace('/' as any); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.comprasBtn}
          onPress={() => router.push('/compras' as any)}
        >
          <Text style={styles.topBtnText}>Mis compras</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleCerrarSesion}
        >
          <Text style={styles.topBtnText}>Cerrar sesion</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.filterBtn, soloDisponibles && styles.filterBtnActive]}
        onPress={() => setSoloDisponibles(!soloDisponibles)}
      >
        <Text style={[styles.filterText, soloDisponibles && styles.filterTextActive]}>
          {soloDisponibles ? 'Filtro activo: Solo disponibles' : 'Mostrando: Todos los vehículos '}
        </Text>
      </TouchableOpacity>

      {cargando ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={vehiculos}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay vehículos.</Text>
          }
          renderItem={({ item }) => {
            const disponible = item.estado === 'disponible';
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/vehiculo/${item.id}` as any)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {item.marca} {item.modelo}
                  </Text>
                  <Text style={[styles.badge, disponible ? styles.badgeDisponible : styles.badgeVendido]}>
                    {item.estado}
                  </Text>
                </View>

                <Text style={styles.cardDetail}>Año: {item.anio}</Text>
                <Text style={styles.cardPrice}>Precio: ${Number(item.precio).toLocaleString()}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 12 },
  comprasBtn: { flex: 1, backgroundColor: '#2563eb', padding: 10, borderRadius: 8, alignItems: 'center' },
  logoutBtn: { flex: 1, backgroundColor: '#dc2626', padding: 10, borderRadius: 8, alignItems: 'center' },
  topBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  filterBtn: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#2563eb', backgroundColor: '#ffffff', marginBottom: 14, alignItems: 'center' },
  filterBtnActive: { backgroundColor: '#2563eb' },
  filterText: { color: '#2563eb', fontWeight: '600', fontSize: 13 },
  filterTextActive: { color: '#ffffff' },
  emptyText: { textAlign: 'center', color: '#64748b', marginTop: 32, fontSize: 15 },
  card: { backgroundColor: '#ffffff', padding: 16, marginBottom: 12, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  badgeDisponible: { backgroundColor: '#dcfce7', color: '#166534' },
  badgeVendido: { backgroundColor: '#fee2e2', color: '#991b1b' },
  cardDetail: { fontSize: 14, color: '#475569', marginBottom: 4 },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
});