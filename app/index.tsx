import { AudioPlayer, createAudioPlayer } from "expo-audio";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PantallaPrincipal() {
  const [buscando, setBuscando] = useState(false);
  const [tiempo, setTiempo] = useState(60);
  const timerRef = useRef<any>(null);
  const sonidoRef = useRef<AudioPlayer | null>(null);

  const sonar = async (archivo: any) => {
    try {
      if (sonidoRef.current) {
        sonidoRef.current.pause();
        sonidoRef.current.remove();
      }
      const player = createAudioPlayer(archivo);
      sonidoRef.current = player;
      player.play();
    } catch (e) {
      console.log("Error audio", e);
    }
  };

  const conseguir = () => {
    // TU VOZ DE VERDAD - MIENTRAS ESPERAS DIVIERTETE CON OLJIER
    sonar(require("../assets/mientras.mp3"));
    setBuscando(true);
    setTiempo(60);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTiempo((s) => {
        // CUANDO FALTA 1 MINUTO - A UN MINUTO DE LLEGAR
        if (s === 60) {
          // no hacemos nada, ya sonó mientras
        }
        if (s === 15) {
          sonar(require("../assets/unminuto.mp3"));
        }
        if (s <= 1) {
          clearInterval(timerRef.current);
          setBuscando(false);
          // CUANDO LLEGÓ - LLEGASTE
          sonar(require("../assets/llegaste.mp3"));
          return 60;
        }
        return s - 1;
      });
    }, 1000);
  };

  const pararTodo = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (sonidoRef.current) {
      sonidoRef.current.pause();
      sonidoRef.current.remove();
      sonidoRef.current = null;
    }
    // SI DEMORA - NO DEMORES
    sonar(require("../assets/nodemores.mp3"));
    setBuscando(false);
    setTiempo(60);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [buscando]);

  const pedirPermiso = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso", "Necesitamos tu ubicación para buscar tu AllHere");
      return;
    }
    conseguir();
  };

  return (
    <View style={styles.contenedor}>
      {/* TU LOGO AZUL COMPLETO */}
      <Image
        source={require("../assets/images/allhere.jpg")}
        style={styles.logoGrande}
      />
      <Text style={styles.subtitulo}>¿A dónde vamos hoy?</Text>

      {!buscando ? (
        <TouchableOpacity style={styles.botonCarro} onPress={pedirPermiso}>
          <Text style={styles.textoBoton}>CONSEGUIR ALLHERE</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buscandoBox}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.buscandoTexto}>Buscando tu AllHere...</Text>
          <Text style={styles.tiempo}>{tiempo}s</Text>
          <Text style={styles.oljier}>
            Mientras esperas diviértete con Oljier Games
          </Text>
          <TouchableOpacity onPress={pararTodo} style={styles.cancelar}>
            <Text style={styles.cancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoGrande: {
    width: 230,
    height: 230,
    borderRadius: 25,
    resizeMode: "contain",
    marginBottom: 10,
  },
  subtitulo: { fontSize: 20, color: "#FFF", marginBottom: 30 },
  botonCarro: {
    backgroundColor: "#007AFF",
    width: "100%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  textoBoton: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
  buscandoBox: { alignItems: "center", width: "100%" },
  buscandoTexto: { color: "#FFF", fontSize: 20, marginTop: 20 },
  tiempo: { color: "#007AFF", fontSize: 42, fontWeight: "bold", marginTop: 10 },
  oljier: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 25,
    paddingHorizontal: 20,
  },
  cancelar: {
    marginTop: 25,
    padding: 12,
    backgroundColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 30,
  },
  cancelarTexto: { color: "#FFF", fontSize: 16 },
});
