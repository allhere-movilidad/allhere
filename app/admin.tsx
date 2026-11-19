import { createAudioPlayer } from "expo-audio";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [rol, setRol] = useState<string | null>(null);

  const botones = [
    { nombre: "carcargaya.mp3", archivo: require("../assets/cargaya.mp3") },
    { nombre: "llegaste", archivo: require("../assets/llegaste.mp3") },
    {
      nombre: "unminuto",
      archivo: require("../assets/unminuto.mp3"),
    },
    {
      nombre: "mientras",
      archivo: require("../assets/mientras.mp3"),
    },
    { nombre: "No demores", archivo: require("../assets/nodemores.mp3") },
    { nombre: "felicidades", archivo: require("../assets/felicidades.mp3") },
  ];

  const reproducir = (archivo: any) => {
    try {
      const player = createAudioPlayer(archivo);
      player.play();
    } catch (e) {
      console.log("Error audio", e);
    }
  };

  if (!rol) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/allhere.jpg")}
          style={styles.logo}
        />
        <Text style={styles.titulo}>ALLHERE</Text>
        <Text style={styles.subtitulo}>¿Quién eres?</Text>
        <TouchableOpacity
          style={styles.botonAzul}
          onPress={() => setRol("pasajero")}
        >
          <Text style={styles.textoBlanco}>Soy Pasajero</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botonAzul}
          onPress={() => setRol("conductor")}
        >
          <Text style={styles.textoBlanco}>Soy Conductor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botonGris}
          onPress={() => setRol("admin")}
        >
          <Text style={styles.textoNegro}>Admin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (rol === "conductor") {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/allhere.jpg")}
          style={styles.logoChico}
        />
        <Text style={styles.titulo}>CONDUCTOR</Text>
        <Text style={styles.subtitulo}>Toca para avisar al pasajero</Text>
        <ScrollView style={{ width: "100%" }}>
          {botones.map((b, i) => (
            <TouchableOpacity
              key={i}
              style={styles.botonAzul}
              onPress={() => reproducir(b.archivo)}
            >
              <Text style={styles.textoBlanco}>{b.nombre} 🔊</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.botonGris} onPress={() => setRol(null)}>
          <Text style={styles.textoNegro}>← Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (rol === "admin") {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/allhere.jpg")}
          style={styles.logoChico}
        />
        <Text style={styles.titulo}>ADMIN</Text>
        <Text style={styles.subtitulo}>Panel de control</Text>
        <Text style={{ marginVertical: 20 }}>
          Aquí van los viajes, conductores y pasajeros.
        </Text>
        <TouchableOpacity style={styles.botonGris} onPress={() => setRol(null)}>
          <Text style={styles.textoNegro}>← Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/allhere.jpg")}
        style={styles.logoChico}
      />
      <Text style={styles.titulo}>PASAJERO</Text>
      <Text style={styles.subtitulo}>Tu conductor viene en camino...</Text>
      <Text style={{ marginVertical: 20, textAlign: "center" }}>
        Espera el audio de tu conductor. 🚗
      </Text>
      <TouchableOpacity style={styles.botonGris} onPress={() => setRol(null)}>
        <Text style={styles.textoNegro}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: { width: 180, height: 180, resizeMode: "contain", marginBottom: 10 },
  logoChico: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },
  titulo: { fontSize: 32, fontWeight: "bold", marginBottom: 5 },
  subtitulo: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  botonAzul: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  botonGris: {
    backgroundColor: "#E5E5EA",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  textoBlanco: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  textoNegro: { color: "#000", fontSize: 18, fontWeight: "bold" },
});
