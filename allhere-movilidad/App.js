import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ============================================
// ALLHERE - 1 SOLA APP, 2 MODOS, VARIAS CIUDADES
// ============================================

// CIUDADES - Aquí agregas las que quieras, la app sola se adapta
const CIUDADES = [
  { id: "lima", nombre: "Lima", lat: -12.0464, lng: -77.0428 },
  { id: "arequipa", nombre: "Arequipa", lat: -16.409, lng: -71.5375 },
  { id: "cusco", nombre: "Cusco", lat: -13.5319, lng: -72.0014 },
  { id: "trujillo", nombre: "Trujillo", lat: -8.1116, lng: -78.7177 },
  { id: "chiclayo", nombre: "Chiclayo", lat: -6.7714, lng: -79.8409 },
  { id: "piura", nombre: "Piura", lat: -5.1945, lng: -80.6328 },
  { id: "huancayo", nombre: "Huancayo", lat: -12.0651, lng: -75.2049 },
  { id: "ica", nombre: "Ica", lat: -14.0678, lng: -75.7286 },
];

// LUGARES POR CIUDAD - Cada ciudad tiene sus propios lugares y precios
const LUGARES_POR_CIUDAD = {
  lima: [
    { id: "l1", nombre: "Villa María", dir: "La Molina", precio: "12" },
    { id: "l2", nombre: "Miraflores", dir: "Av. Larco", precio: "14" },
    { id: "l3", nombre: "San Isidro", dir: "Av. Javier Prado", precio: "15" },
    { id: "l4", nombre: "Surco", dir: "Av. Benavides", precio: "13" },
  ],
  arequipa: [
    { id: "a1", nombre: "Yanahuara", dir: "Plaza Yanahuara", precio: "10" },
    { id: "a2", nombre: "Cayma", dir: "Av. Cayma", precio: "9" },
    { id: "a3", nombre: "Cercado", dir: "Plaza de Armas", precio: "8" },
  ],
  cusco: [
    {
      id: "c1",
      nombre: "Centro Histórico",
      dir: "Plaza de Armas",
      precio: "9",
    },
    { id: "c2", nombre: "Wanchaq", dir: "Av. La Cultura", precio: "8" },
    { id: "c3", nombre: "San Sebastián", dir: "Av. Cusco", precio: "10" },
  ],
  trujillo: [
    { id: "t1", nombre: "Centro", dir: "Plaza de Armas", precio: "8" },
    { id: "t2", nombre: "Víctor Larco", dir: "Av. Larco", precio: "9" },
  ],
  chiclayo: [
    { id: "ch1", nombre: "Centro", dir: "Parque Principal", precio: "7" },
    { id: "ch2", nombre: "Pimentel", dir: "Malecón", precio: "10" },
  ],
  piura: [
    { id: "p1", nombre: "Centro", dir: "Plaza de Armas", precio: "7" },
    { id: "p2", nombre: "Castilla", dir: "Av. Irazola", precio: "8" },
  ],
  huancayo: [
    { id: "h1", nombre: "Centro", dir: "Plaza Constitución", precio: "7" },
    { id: "h2", nombre: "El Tambo", dir: "Av. Mariscal Castilla", precio: "8" },
  ],
  ica: [
    { id: "i1", nombre: "Centro", dir: "Plaza de Armas", precio: "7" },
    { id: "i2", nombre: "Huacachina", dir: "Oasis", precio: "12" },
  ],
};

export default function App() {
  // --- ESTADO GENERAL ---
  const [ciudadId, setCiudadId] = useState("lima");
  const [modo, setModo] = useState("usuario"); // 'usuario' o 'conductor'
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarCiudades, setMostrarCiudades] = useState(false);

  // --- PEDIDOS COMPARTIDOS - Esto hace que usuario y conductor compatibilicen ---
  const [pedidos, setPedidos] = useState([]);
  const [miPedido, setMiPedido] = useState(null);

  // --- REGISTRO CONDUCTOR ---
  const [conductor, setConductor] = useState(null);
  const [formConductor, setFormConductor] = useState({
    celular: "",
    dni: "",
    licencia: "",
    soat: "",
    tarjeta: "",
    placa: "",
    tipoCarro: "Simple",
  });

  const ciudadActual = CIUDADES.find((c) => c.id === ciudadId);
  const lugares = LUGARES_POR_CIUDAD[ciudadId] || [];
  // Solo pedidos de la ciudad actual
  const pedidosCiudad = pedidos.filter((p) => p.ciudadId === ciudadId);

  // --- USUARIO: PEDIR TAXI ---
  const pedirTaxi = (lugar) => {
    const nuevo = {
      id: Date.now().toString(),
      ciudadId: ciudadId,
      ciudadNombre: ciudadActual.nombre,
      origen: "Estoy aquí - " + ciudadActual.nombre,
      destino: lugar.nombre + " - " + lugar.dir,
      precio: lugar.precio,
      verificado: false,
    };
    setPedidos([...pedidos, nuevo]);
    setMiPedido(nuevo);
    Alert.alert(
      "¡Pedido enviado!",
      "Buscando conductor en " + ciudadActual.nombre + "...",
    );
  };

  // --- CONDUCTOR: TOMAR PEDIDO ---
  const tomarPedido = (id) => {
    setPedidos(pedidos.filter((p) => p.id !== id));
    Alert.alert(
      "¡Pedido tomado!",
      "Ya eres el conductor. Comisión AllHere: 12%",
    );
  };

  // --- CONDUCTOR: REGISTRARSE ---
  const registrarConductor = () => {
    if (
      !formConductor.celular ||
      !formConductor.dni ||
      !formConductor.placa ||
      !formConductor.soat ||
      !formConductor.tarjeta ||
      !formConductor.licencia
    ) {
      Alert.alert(
        "Falta algo",
        "Tienes que llenar TODO: celular, DNI, licencia, SOAT, tarjeta y placa. Si no, no se activa.",
      );
      return;
    }
    setConductor({ ...formConductor, ciudadId });
    setMostrarRegistro(false);
    setModo("conductor");
    Alert.alert(
      "¡Bienvenido conductor!",
      "Ya puedes recibir pedidos en " +
        ciudadActual.nombre +
        ". Tipo: " +
        formConductor.tipoCarro,
    );
  };

  // --- CAMBIAR DE MODO CON LA LLAVE DE LOS 3 PUNTOS ---
  const cambiarModo = () => {
    setMostrarMenu(false);
    if (modo === "usuario") {
      if (conductor) {
        setModo("conductor");
      } else {
        setMostrarRegistro(true);
      }
    } else {
      setModo("usuario");
    }
  };

  return (
    <ScrollView style={styles.fondo}>
      {/* BARRA SUPERIOR */}
      <View style={styles.barra}>
        <Text style={styles.logo}>ALLHERE 🚕</Text>
        <TouchableOpacity
          onPress={() => setMostrarMenu(true)}
          style={styles.puntos}
        >
          <Text style={{ fontSize: 24 }}>...</Text>
        </TouchableOpacity>
      </View>

      {/* SELECTOR DE CIUDAD - FUNCIONA EN TODO EL CONTENIDO Y EL PLANO */}
      <TouchableOpacity
        onPress={() => setMostrarCiudades(true)}
        style={styles.ciudadBtn}
      >
        <Text style={{ fontWeight: "bold" }}>
          📍 Ciudad: {ciudadActual.nombre} ▼
        </Text>
        <Text style={{ fontSize: 12, color: "#666" }}>
          Toca para cambiar de ciudad
        </Text>
      </TouchableOpacity>

      {/* PLANO DE UBICACIÓN - CAMBIA SEGÚN LA CIUDAD */}
      <View style={styles.mapa}>
        <Text style={{ fontSize: 30 }}>🗺️</Text>
        <Text style={{ fontWeight: "bold" }}>
          Plano - {ciudadActual.nombre}
        </Text>
        <Text>
          Estoy aquí: Lat {ciudadActual.lat}, Lng {ciudadActual.lng}
        </Text>
        <Text style={{ fontSize: 12, color: "#666", textAlign: "center" }}>
          El plano y los lugares cambian solos cuando cambias de ciudad
        </Text>
      </View>

      {/* MODO ACTUAL */}
      <View style={styles.modoCaja}>
        <Text style={{ fontWeight: "bold" }}>
          {modo === "usuario" ? "🙋‍♂️ MODO PASAJERO" : "🚕 MODO CONDUCTOR"}
        </Text>
        <Text style={{ fontSize: 12 }}>
          {conductor
            ? `Conductor: ${conductor.placa} - ${conductor.tipoCarro} - ${ciudadActual.nombre}`
            : "Aún no eres conductor"}
        </Text>
      </View>

      {/* ============ VISTA USUARIO ============ */}
      {modo === "usuario" && (
        <View>
          <Text style={styles.titulo}>
            ¿A dónde vas en {ciudadActual.nombre}?
          </Text>
          <Text style={{ marginBottom: 10, color: "#666" }}>
            Lugares de {ciudadActual.nombre} - Precios de {ciudadActual.nombre}
          </Text>

          {miPedido && (
            <View style={styles.pedidoActivo}>
              <Text style={{ fontWeight: "bold" }}>
                ✅ Tu pedido está buscando conductor
              </Text>
              <Text>
                {miPedido.origen} → {miPedido.destino}
              </Text>
              <Text>
                Precio: S/ {miPedido.precio} - Ciudad: {miPedido.ciudadNombre}
              </Text>
            </View>
          )}

          {lugares.map((lugar) => (
            <View key={lugar.id} style={styles.cajita}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {lugar.nombre}
              </Text>
              <Text>
                {lugar.dir} - {ciudadActual.nombre}
              </Text>
              <Text style={{ color: "green", fontWeight: "bold" }}>
                S/ {lugar.precio}
              </Text>
              <TouchableOpacity
                onPress={() => pedirTaxi(lugar)}
                style={styles.botonVerde}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  PEDIR TAXI
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* ============ VISTA CONDUCTOR ============ */}
      {modo === "conductor" && (
        <View>
          <Text style={styles.titulo}>Pedidos en {ciudadActual.nombre}</Text>
          <Text style={{ marginBottom: 10 }}>
            Comisión AllHere: 12% - Fin de semana: 6% - Sin castigo si rechazas
          </Text>

          {pedidosCiudad.length === 0 && (
            <Text
              style={{
                padding: 15,
                backgroundColor: "#fffbe6",
                borderRadius: 10,
              }}
            >
              No hay pedidos en {ciudadActual.nombre} todavía. Espera, cuando un
              usuario de {ciudadActual.nombre} pida, te sale aquí.
            </Text>
          )}

          {pedidosCiudad.map((p) => (
            <View key={p.id} style={styles.cajitaConductor}>
              <Text style={{ fontWeight: "bold" }}>
                {p.origen} → {p.destino}
              </Text>
              <Text>
                Precio: S/ {p.precio} - Ciudad: {p.ciudadNombre}
              </Text>
              <TouchableOpacity
                onPress={() => tomarPedido(p.id)}
                style={styles.botonConductor}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  YO LO LLEVO
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* MENU 3 PUNTOS - LA LLAVE ESCONDIDA */}
      <Modal visible={mostrarMenu} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalFondo}
          onPress={() => setMostrarMenu(false)}
        >
          <View style={styles.modalCaja}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              🔑 Menú
            </Text>
            <TouchableOpacity onPress={cambiarModo} style={styles.modalBtn}>
              <Text>
                {modo === "usuario"
                  ? "🚕 Pasar a Conductor"
                  : "🙋‍♂️ Pasar a Pasajero"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMostrarMenu(false)}
              style={styles.modalBtn}
            >
              <Text>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* SELECTOR CIUDADES */}
      <Modal visible={mostrarCiudades} transparent animationType="slide">
        <View style={styles.modalFondo}>
          <View style={styles.modalCaja}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Elige tu ciudad
            </Text>
            {CIUDADES.map((c) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => {
                  setCiudadId(c.id);
                  setMostrarCiudades(false);
                }}
                style={styles.modalBtn}
              >
                <Text>
                  {c.nombre} {c.id === ciudadId ? "✅" : ""}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setMostrarCiudades(false)}
              style={styles.modalBtn}
            >
              <Text>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* REGISTRO CONDUCTOR */}
      <Modal visible={mostrarRegistro} animationType="slide">
        <ScrollView style={{ padding: 20, backgroundColor: "white" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}>
            ¡Bienvenido Conductor AllHere!
          </Text>
          <Text style={{ marginBottom: 15 }}>
            Ciudad: {ciudadActual.nombre} - Si no llenas todo, no se activa.
          </Text>

          <Text>Celular *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 987654321"
            keyboardType="phone-pad"
            value={formConductor.celular}
            onChangeText={(t) =>
              setFormConductor({ ...formConductor, celular: t })
            }
          />
          <Text>DNI *</Text>
          <TextInput
            style={styles.input}
            placeholder="DNI"
            keyboardType="numeric"
            value={formConductor.dni}
            onChangeText={(t) => setFormConductor({ ...formConductor, dni: t })}
          />
          <Text>Licencia de conducir *</Text>
          <TextInput
            style={styles.input}
            placeholder="Número de licencia / foto"
            value={formConductor.licencia}
            onChangeText={(t) =>
              setFormConductor({ ...formConductor, licencia: t })
            }
          />
          <Text>SOAT vigente *</Text>
          <TextInput
            style={styles.input}
            placeholder="Número SOAT"
            value={formConductor.soat}
            onChangeText={(t) =>
              setFormConductor({ ...formConductor, soat: t })
            }
          />
          <Text>Tarjeta de propiedad *</Text>
          <TextInput
            style={styles.input}
            placeholder="Número tarjeta"
            value={formConductor.tarjeta}
            onChangeText={(t) =>
              setFormConductor({ ...formConductor, tarjeta: t })
            }
          />
          <Text>Placa *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: ABC-123"
            autoCapitalize="characters"
            value={formConductor.placa}
            onChangeText={(t) =>
              setFormConductor({ ...formConductor, placa: t })
            }
          />

          <Text style={{ marginTop: 10, fontWeight: "bold" }}>
            Tipo de carro:
          </Text>
          {["Simple", "Confort", "5 pasajeros", "6 pasajeros / Minivan"].map(
            (tipo) => (
              <TouchableOpacity
                key={tipo}
                onPress={() =>
                  setFormConductor({ ...formConductor, tipoCarro: tipo })
                }
                style={[
                  styles.tipoBtn,
                  formConductor.tipoCarro === tipo && styles.tipoBtnActivo,
                ]}
              >
                <Text>
                  {tipo} {formConductor.tipoCarro === tipo ? "✅" : ""}
                </Text>
              </TouchableOpacity>
            ),
          )}

          <TouchableOpacity
            onPress={registrarConductor}
            style={styles.botonVerde}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              REGISTRARME COMO CONDUCTOR
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMostrarRegistro(false)}
            style={{ marginTop: 15, padding: 10 }}
          >
            <Text style={{ textAlign: "center" }}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: "#f2f2f2", padding: 15 },
  barra: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: { fontSize: 22, fontWeight: "bold" },
  puntos: { padding: 10, backgroundColor: "white", borderRadius: 10 },
  ciudadBtn: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  mapa: {
    backgroundColor: "#d9f0ff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  modoCaja: {
    backgroundColor: "#e6ffe6",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  titulo: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  cajita: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cajitaConductor: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  pedidoActivo: {
    backgroundColor: "#d4edda",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  botonVerde: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  botonConductor: {
    backgroundColor: "#ff8800",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  tipoBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 5,
  },
  tipoBtnActivo: { backgroundColor: "#e6ffe6", borderColor: "green" },
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalCaja: { backgroundColor: "white", padding: 20, borderRadius: 15 },
  modalBtn: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
});
