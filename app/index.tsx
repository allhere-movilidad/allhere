import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [rolActual, setRolActual] = useState<string | null>(null);
  const [cuentaGoogle, setCuentaGoogle] = useState<string | null>(null);
  const [rostroGuardado, setRostroGuardado] = useState<string | null>(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarGoogle, setMostrarGoogle] = useState(false);
  const [rolPendiente, setRolPendiente] = useState<string | null>(null);

  // Al abrir la app, ver si ya hay alguien registrado
  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const rol = await AsyncStorage.getItem("rol");
    const google = await AsyncStorage.getItem("google");
    const rostro = await AsyncStorage.getItem("rostro");
    if (rol) setRolActual(rol);
    if (google) setCuentaGoogle(google);
    if (rostro) setRostroGuardado(rostro);
  }

  // Paso 1: Elige Usuario o Conductor
  function elegirRol(rol: string) {
    setRolPendiente(rol);
    setMostrarGoogle(true);
  }

  // Paso 2: Elige cuenta Google
  async function elegirCuentaGoogle(cuenta: string) {
    // Si ya hay alguien registrado y es otra cuenta, NEGAR
    if (cuentaGoogle && cuentaGoogle !== cuenta) {
      Alert.alert(
        "Acceso denegado",
        `Este celular ya está registrado con ${cuentaGoogle}. No puedes usar otra cuenta aquí.`,
      );
      setMostrarGoogle(false);
      return;
    }
    // Si es la misma cuenta o es primera vez, seguir a rostro
    verificarRostro(cuenta);
  }

  // Paso 3: Verificar rostro
  async function verificarRostro(cuenta: string) {
    setMostrarGoogle(false);

    // AQUÍ VA TU VERIFICACIÓN FACIAL REAL
    // Por ahora simulamos: pedimos rostro y lo comparamos
    // Si es primera vez, guardamos el rostro como "rostro_123"
    const rostroNuevo = "rostro_123"; // Esto lo reemplaza tu SDK de rostro

    if (rostroGuardado && rostroGuardado !== rostroNuevo) {
      Alert.alert(
        "Acceso denegado",
        "Este celular ya está registrado con otra persona. No puedes usar otro rostro en este equipo.",
      );
      return;
    }

    // Si pasa, guardamos todo
    await AsyncStorage.setItem("google", cuenta);
    await AsyncStorage.setItem("rostro", rostroNuevo);
    await AsyncStorage.setItem("rol", rolPendiente || "usuario");

    setCuentaGoogle(cuenta);
    setRostroGuardado(rostroNuevo);
    setRolActual(rolPendiente || "usuario");
    Alert.alert("Bienvenido", `Entraste como ${rolPendiente} con ${cuenta}`);
  }

  // Paso 4: Cambiar de rol desde los 3 puntitos
  function cambiarRolDesdeMenu(nuevoRol: string) {
    setMostrarMenu(false);
    // Vuelve a pedir Google + Rostro
    setRolPendiente(nuevoRol);
    setMostrarGoogle(true);
  }

  // PANTALLA 1: Si NO ha entrado, mostrar Logo + Botones
  if (!rolActual) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/allhere.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>AllHere</Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => elegirRol("usuario")}
        >
          <Text style={styles.btnText}>Usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btn2]}
          onPress={() => elegirRol("conductor")}
        >
          <Text style={styles.btnText}>Conductor</Text>
        </TouchableOpacity>

        {/* MODAL GOOGLE */}
        <Modal visible={mostrarGoogle} transparent animationType="slide">
          <View style={styles.modal}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>¿Con qué cuenta sigues?</Text>
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={() => elegirCuentaGoogle("felix@gmail.com")}
              >
                <Text>Continuar con Google - felix@gmail.com</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={() => elegirCuentaGoogle("otra@gmail.com")}
              >
                <Text>Usar otra cuenta de Google</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMostrarGoogle(false)}>
                <Text style={{ marginTop: 15, color: "red" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // PANTALLA 2: Ya está adentro, botones escondidos en 3 puntitos
  return (
    <View style={styles.container2}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AllHere - {rolActual}</Text>
        <TouchableOpacity onPress={() => setMostrarMenu(true)}>
          <Text style={{ fontSize: 26 }}>⋮</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ marginTop: 30 }}>
        Estás como {rolActual} con {cuentaGoogle}
      </Text>
      <Text>Aquí va tu mapa / pedidos...</Text>

      {/* MENU 3 PUNTITOS */}
      <Modal visible={mostrarMenu} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Opciones</Text>
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() =>
                cambiarRolDesdeMenu(
                  rolActual === "usuario" ? "conductor" : "usuario",
                )
              }
            >
              <Text>
                Cambiar a {rolActual === "usuario" ? "Conductor" : "Usuario"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() => Alert.alert("Mi perfil", cuentaGoogle || "")}
            >
              <Text>Mi perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMostrarMenu(false)}>
              <Text style={{ marginTop: 15, color: "red" }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL GOOGLE PARA CAMBIAR ROL */}
      <Modal visible={mostrarGoogle} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ¿Sigues con este perfil de Google?
            </Text>
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() =>
                elegirCuentaGoogle(cuentaGoogle || "felix@gmail.com")
              }
            >
              <Text>Seguir con {cuentaGoogle}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() => elegirCuentaGoogle("otra@gmail.com")}
            >
              <Text>Usar otra cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMostrarGoogle(false)}>
              <Text style={{ marginTop: 15, color: "red" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1A3A",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  container2: { flex: 1, backgroundColor: "#fff", padding: 20 },
  logo: { width: 180, height: 180, borderRadius: 30 },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 20,
  },
  btn: {
    backgroundColor: "#FFD400",
    width: "100%",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 12,
  },
  btn2: { backgroundColor: "#fff" },
  btnText: { fontSize: 18, fontWeight: "bold", color: "#0A1A3A" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  googleBtn: {
    backgroundColor: "#f0f0f0",
    width: "100%",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
});
