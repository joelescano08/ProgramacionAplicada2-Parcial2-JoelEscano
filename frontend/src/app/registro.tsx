import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { registrarUsuario } from '../services/api';

export default function RegistroScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async () => {
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      return;
    }

    setCargando(true);
    try {
      await registrarUsuario(nombre, email, password);

      Alert.alert('Cuenta creada exitosamente');
      router.back(); 
    } catch (error: any) {
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Cliente</Text>
      <Text style={styles.subtitle}>Vice City Motors</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electronico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegistro} disabled={cargando}>
        {cargando ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#0f172a' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 24, color: '#64748b' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#ffffff', fontSize: 16 },
  button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
});