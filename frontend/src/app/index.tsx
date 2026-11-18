import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { iniciarSesion } from '../services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [verificandoSesion, setVerificandoSesion] = useState(true);

  useEffect(() => {
    verificarSesionActiva();
  }, []);

  const verificarSesionActiva = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        router.replace('/vehiculos' as any);
        return;
      }
    } catch (error) {
    } finally {
      setVerificandoSesion(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Ingresa tu correo y contraseña.');
      return;
    }

    setCargando(true);
    try {
      await iniciarSesion(email, password);

      router.replace('/vehiculos' as any);
    } catch (error: any) {
      Alert.alert('Error de acceso', error.message);
    } finally {
      setCargando(false);
    }
  };

  if (verificandoSesion) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vice City Motors</Text>
      <Text style={styles.subtitle}>Inicia sesion para ver</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={cargando}>
        {cargando ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>ingresar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/registro' as any)}>
        <Text style={styles.linkText}>Registrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#0f172a' },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 24, color: '#64748b' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#ffffff', fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#2563eb', fontSize: 14, fontWeight: '600' },
});