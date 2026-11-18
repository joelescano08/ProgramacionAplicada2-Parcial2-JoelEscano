import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { obtenerVehiculoPorId, comprarVehiculo } from '../../services/api';

export default function DetalleVehiculoScreen() {
  const { id } = useLocalSearchParams();
  const vehiculoId = Array.isArray(id) ? id[0] : id;

  const [vehiculo, setVehiculo] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [comprando, setComprando] = useState(false);

  useEffect(() => {
    if (vehiculoId) {
      cargarDetalle();
    }
  }, [vehiculoId]);

  const cargarDetalle = async () => {
    setCargando(true);
    try {
      const datos = await obtenerVehiculoPorId(vehiculoId);
      setVehiculo(datos);
    } catch (error: any) {
      Alert.alert('Error');
      router.back();
    } finally {
      setCargando(false);
    }
  };

  const confirmarCompra = () => {
    Alert.alert('Confirmar Compra', `¿Quieres comprar el ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.anio}) por $${Number(vehiculo.precio).toLocaleString()} mediante transferencia?`,
      [{ text: 'Cancelar', style: 'cancel' },{ text: 'Confirmar', onPress: procesarCompra },]
    );
  };

  const procesarCompra = async () => {
    setComprando(true);
    try {
      await comprarVehiculo(vehiculo.id);
    } catch (error: any) {

    } finally {
      setComprando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!vehiculo) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se encontró información del vehículo.</Text>
      </View>
    );
  }

  const estaDisponible = vehiculo.estado === 'disponible';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.marca}>{vehiculo.marca}</Text>
        <Text style={styles.modelo}>{vehiculo.modelo}</Text>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Año:</Text>
          <Text style={styles.value}>{vehiculo.anio}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Precio:</Text>
          <Text style={styles.valorPrecio}>${Number(vehiculo.precio).toLocaleString()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={[styles.estadoValue, estaDisponible ? styles.disponible : styles.vendido]}>
            {vehiculo.estado?.toUpperCase()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Método de pago:</Text>
          <Text style={styles.value}>Transferencia bancaria</Text>
        </View>
      </View>

      {estaDisponible ? (
        <TouchableOpacity
          style={styles.comprarBoton}
          onPress={confirmarCompra}
          disabled={comprando}
        >
          {comprando ? (<ActivityIndicator color="#ffffff" />) : (<Text style={styles.buyButtonText}>Comprar Vehículo</Text>)}
        </TouchableOpacity>
      ) : (
        <View style={styles.soldBanner}>
          <Text style={styles.textoVendido}>Este vehículo ya no esta disponible</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc', justifyContent: 'space-between' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  errorText: { fontSize: 16, color: '#64748b' },
  card: { backgroundColor: '#ffffff', padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  marca: { fontSize: 16, fontWeight: '600', color: '#64748b', textTransform: 'uppercase' },
  modelo: { fontSize: 28, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },
  divider: { backgroundColor: '#e2e8f0' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  label: { fontSize: 15, color: '#475569' },
  value: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  valorPrecio: { fontSize: 20, fontWeight: 'bold', color: '#16a34a' },
  estadoValue: { fontSize: 14, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  disponible: { backgroundColor: '#dcfce7', color: '#166534' },
  vendido: { backgroundColor: '#fee2e2', color: '#991b1b' },
  comprarBoton: { backgroundColor: '#16a34a', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  buyButtonText: { color: '#ffffff', fontSize: 17, fontWeight: 'bold' },
  soldBanner: { backgroundColor: '#e2e8f0', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  textoVendido: { color: '#284061', fontSize: 15, fontWeight: '600' },
});