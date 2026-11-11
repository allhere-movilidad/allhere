import { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

type Pantalla =
  | "inicio"
  | "conductores"
  | "mapas"
  | "ciudad"
  | "apps"
  | "monedero"
  | "ayuda"
  | "historial";

export default function Home() {
  const [pantalla, setPantalla] = useState<Pantalla>("inicio");
  const [mensaje, setMensaje] = useState("");
  const [chat, setChat] = useState<string[]>([
    "Conductor: Hola, ¿qué olvidaste en el taxi?",
  ]);

  const enviarMensaje = () => {
    if (!mensaje.trim()) return;
    setChat([...chat, `Tú: ${mensaje}`]);
    setMensaje("");
    setTimeout(
      () =>
        setChat((c) => [...c, "Conductor: Lo reviso y te escribo enseguida."]),
      800,
    );
  };

  // PANTALLA DE CADA BOTÓN
  if (pantalla !== "inicio") {
    return (
      <View style={styles.contenedorPantalla}>
        <TouchableOpacity
          onPress={() => setPantalla("inicio")}
          style={styles.volver}
        >
          <Text style={styles.volverTexto}>⬅ Volver a Principal</Text>
        </TouchableOpacity>

        {pantalla === "conductores" && (
          <View style={styles.caja}>
            <Text style={styles.titulo2}>🚘 Conductores</Text>
            <Text>Conductores cerca de ti: 12 disponibles</Text>
            <Text>⭐ Juan - 4.9 - Toyota Corolla</Text>
            <Text>⭐ Maria - 4.8 - Hyundai Elantra</Text>
            <TouchableOpacity
              style={styles.botonAccion}
              onPress={() => Alert.alert("Listo", "Pediste conductor Juan")}
            >
              <Text style={styles.botonAccionTexto}>Pedir a Juan</Text>
            </TouchableOpacity>
          </View>
        )}

        {pantalla === "mapas" && (
          <View style={styles.caja}>
            <Text style={styles.titulo2}>📍 Mapas</Text>
            <View style={styles.mapaFalso}>
              <Text style={styles.mapaTexto}>🗺️ MAPA DE LIMA AQUÍ</Text>
              <Text>Tu ubicación: Lima, Perú</Text>
            </View>
            <TextInput placeholder="¿A dónde vas?" style={styles.input} />
            <TouchableOpacity
              style={styles.botonAccion}
              onPress={() =>
                Alert.alert("Ruta", "Calculando ruta... 15 min - S/ 12.50")
              }
            >
              <Text style={styles.botonAccionTexto}>Buscar ruta</Text>
            </TouchableOpacity>
          </View>
        )}

        {pantalla === "ciudad" && (
          <View style={styles.caja}>
            <Text style={styles.titulo2}>🏙️ Mi Ciudad</Text>
            <Text>Lima - Miraflores, Surco, La Molina</Text>
            <Text>📍 Lugares populares: Parque Kennedy, Larcomar</Text>
            <TouchableOpacity
              style={styles.botonAccion}
              onPress={() =>
                Alert.alert("Mi Ciudad", "Mostrando zonas de Lima")
              }
            >
              <Text style={styles.botonAccionTexto}>Ver mi zona</Text>
            </TouchableOpacity>
          </View>
        )}

        {pantalla === "apps" && (
          <View style={styles.caja}>
            <Text style={styles.titulo2}>📱 Apps</Text>
            <Text>• AllHere Viajes</Text>
            <Text>• AllHere Comida</Text>
            <Text>• AllHere Envíos</Text>
            <TouchableOpacity
              style={styles.botonAccion}
              onPress={() => Alert.alert("Apps", "Abriendo AllHere Comida...")}
            >
              <Text style={styles.botonAccionTexto}>Abrir AllHere Comida</Text>
            </TouchableOpacity>
          </View>
        )}

        {pantalla === "monedero" && (
          <View style={styles.caja}>
            <Text style={styles.titulo2}>💳 Monedero</Text>
            <Text style={styles.saldo}>Saldo: S/ 45.00</Text>
            <TouchableOpacity
              style={styles.botonAccion}
              onPress={() => Alert.alert("Monedero", "Recargaste S/ 20.00")}
            >
              <Text style={styles.botonAccionTexto}>Recargar S/ 20</Text>
            </TouchableOpacity>
          </View>
        )}

        {pantalla === "ayuda" && (
          <View style={styles.caja}>
            <Text style={styles.titulo2}>❓ Ayuda - Cómo funciona</Text>
            <Text>1. Elige Conductores o Mapas</Text>
            <Text>2. Pones a dónde vas</Text>
            <Text>3. Te llega tu conductor</Text>
            <Text>4. Pagas con Monedero o efectivo</Text>
            <Text>
              5. Si olvidas algo, vas a Historial de Autos y le escribes por
              mensaje
            </Text>
            <TouchableOpacity
              style={styles.botonAccion}
              onPress={() =>
                Alert.alert("Entendido", "Ya sabes cómo funciona AllHere")
              }
            >
              <Text style={styles.botonAccionTexto}>Entendido</Text>
            </TouchableOpacity>
          </View>
        )}

        {pantalla === "historial" && (
          <View style={styles.caja}>
            <Text style={styles.titulo2}>💬 Historial de Autos</Text>
            <Text>Viaje de ayer - Juan - Corolla - 10:30 AM</Text>
            <Text>¿Olvidaste algo? Escríbele por mensaje:</Text>
            <ScrollView style={styles.chat}>
              {chat.map((m, i) => (
                <Text key={i} style={styles.mensajeChat}>
                  {m}
                </Text>
              ))}
            </ScrollView>
            <TextInput
              value={mensaje}
              onChangeText={setMensaje}
              placeholder="Ej: Olvidé mi celular en el taxi..."
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.botonAccion}
              onPress={enviarMensaje}
            >
              <Text style={styles.botonAccionTexto}>Enviar mensaje</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // PANTALLA PRINCIPAL ESTILO ENCARTA 2026
  const botones: {
    titulo: string;
    icono: string;
    sub: string;
    accion: Pantalla;
  }[] = [
    { titulo: "Conductores", icono: "🚘", sub: "", accion: "conductores" },
    { titulo: "Mapas", icono: "📍", sub: "", accion: "mapas" },
    { titulo: "Mi Ciudad", icono: "🏙️", sub: "", accion: "ciudad" },
    { titulo: "Apps", icono: "📱", sub: "", accion: "apps" },
    { titulo: "Monedero", icono: "💳", sub: "", accion: "monedero" },
    { titulo: "Ayuda", icono: "❓", sub: "Como funciona", accion: "ayuda" },
    {
      titulo: "Historial de Autos",
      icono: "💬",
      sub: "Escribir por mensaje si olvidaste algo",
      accion: "historial",
    },
  ];

  return (
    <View style={styles.principal}>
      <View style={styles.izquierda}>
        <Image
          source={require("../assets/images/allhere.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.bienvenido}>
          Bienvenido a AllHere • v1.0 • 2026
        </Text>
        <Text style={styles.subPrincipal}>
          AllHere • Plataforma de Servicios 2026
        </Text>
      </View>
      <View style={styles.derecha}>
        {botones.map((b) => (
          <TouchableOpacity
            key={b.titulo}
            style={styles.boton}
            onPress={() => setPantalla(b.accion)}
          >
            <Text style={styles.icono}>{b.icono}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.botonTexto}>{b.titulo}</Text>
              {b.sub ? <Text style={styles.sub}>{b.sub}</Text> : null}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  principal: { flex: 1, flexDirection: "row", backgroundColor: "#0A2A4D" },
  izquierda: {
    flex: 1.1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  logo: { width: 250, height: 150, backgroundColor: "#0A2A4D" },
  bienvenido: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
  subPrincipal: { color: "#FFC107", fontSize: 12, marginTop: 5 },
  derecha: { flex: 1, justifyContent: "center", padding: 10, gap: 10 },
  boton: {
    backgroundColor: "#CDE6F5",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
  },
  icono: { fontSize: 22, marginRight: 10 },
  botonTexto: { fontSize: 17, fontWeight: "bold", color: "#0A2A4D" },
  sub: { fontSize: 11, color: "#333" },
  contenedorPantalla: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
  },
  volver: {
    backgroundColor: "#0A2A4D",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  volverTexto: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  caja: { gap: 10 },
  titulo2: { fontSize: 24, fontWeight: "bold", color: "#0A2A4D" },
  mapaFalso: {
    backgroundColor: "#D6EAF8",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  mapaTexto: { fontSize: 18, fontWeight: "bold" },
  input: { backgroundColor: "#F2F2F2", padding: 14, borderRadius: 10 },
  botonAccion: {
    backgroundColor: "#FFC107",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  botonAccionTexto: { fontWeight: "bold", color: "#0A2A4D" },
  saldo: { fontSize: 28, fontWeight: "bold" },
  chat: {
    backgroundColor: "#F2F2F2",
    padding: 10,
    borderRadius: 10,
    maxHeight: 150,
  },
  mensajeChat: { marginBottom: 8 },
});
