import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const MAPA_OSCURO = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [ubicacion, setUbicacion] = useState(null);
  const [miPrecio, setMiPrecio] = useState("13.42");
  const [precioAllHere, setPrecioAllHere] = useState("13.42");
  const [rutaReal, setRutaReal] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [lugarSel, setLugarSel] = useState(null);
  const [modoOscuro, setModoOscuro] = useState(true);
  const [showApps, setShowApps] = useState(false);
  const [showPagos, setShowPagos] = useState(false);
  const [showSelectorPago, setShowSelectorPago] = useState(false);
  const [appsPrefs, setAppsPrefs] = useState({ inDriver: true, yango: true });
  const [tempApps, setTempApps] = useState({
    inDriver: true,
    yango: true,
    didi: false,
    uber: false,
  });
  const [tempPagos, setTempPagos] = useState({
    yape: true,
    plin: false,
    ligo: false,
  });
  const [pagosPrefs, setPagosPrefs] = useState({ yape: true });
  const [textoOrigen, setTextoOrigen] = useState("Urb. Alpamayo D6, Ate");
  const [textoDestino, setTextoDestino] = useState("");
  const [editOrigen, setEditOrigen] = useState(false);
  const [editDestino, setEditDestino] = useState(false);
  const [editPrecio, setEditPrecio] = useState(false);
  const [miCiudadAbierta, setMiCiudadAbierta] = useState(true);
  const [cintaPos, setCintaPos] = useState(null);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [bloqueados, setBloqueados] = useState({});
  const mapRef = useRef(null);
  const cintaRef = useRef(null);
  const pos = useRef(0);
  const origen = ubicacion || { latitude: -12.061042, longitude: -76.934487 };

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(t);
  }, []);

  const CAJITAS = [
    {
      id: "deporte",
      titulo: "Deporte",
      icono: "⚽",
      color: "#34C759",
      esPrivado: false,
      lugares: [
        {
          id: "dep1",
          nombre: "Estadio Nacional",
          dir: "Cercado",
          lat: -12.067,
          lng: -77.033,
          precio: "15",
          esPrivado: false,
        },
        {
          id: "dep2",
          nombre: "Monumental Ate",
          dir: "Ate",
          lat: -12.0555,
          lng: -76.936,
          precio: "12",
          esPrivado: false,
        },
        {
          id: "dep3",
          nombre: "Matute Alianza",
          dir: "La Victoria",
          lat: -12.065,
          lng: -77.023,
          precio: "10",
          esPrivado: false,
        },
        {
          id: "dep4",
          nombre: "Alberto Gallardo",
          dir: "Rímac",
          lat: -12.038,
          lng: -77.048,
          precio: "8",
          esPrivado: false,
        },
        {
          id: "dep5",
          nombre: "Lolo Fernández",
          dir: "Breña",
          lat: -12.063,
          lng: -77.05,
          precio: "7",
          esPrivado: false,
        },
        {
          id: "dep6",
          nombre: "San Marcos",
          dir: "Cercado",
          lat: -12.057,
          lng: -77.088,
          precio: "8",
          esPrivado: false,
        },
        {
          id: "dep7",
          nombre: "Municipal Chorrillos",
          dir: "Chorrillos",
          lat: -12.167,
          lng: -77.025,
          precio: "7",
          esPrivado: false,
        },
        {
          id: "dep8",
          nombre: "Iván Elías Moreno",
          dir: "Villa El Salvador",
          lat: -12.213,
          lng: -76.941,
          precio: "9",
          esPrivado: false,
        },
      ],
    },
    {
      id: "universidades",
      titulo: "Universidades",
      icono: "🎓",
      color: "#000",
      esPrivado: true,
      lugares: [
        {
          id: "uni1",
          nombre: "UNMSM San Marcos",
          dir: "Cercado",
          lat: -12.058,
          lng: -77.085,
          precio: "10",
          esPrivado: false,
        },
        {
          id: "uni2",
          nombre: "UNI",
          dir: "Rímac",
          lat: -12.02,
          lng: -77.05,
          precio: "9",
          esPrivado: false,
        },
        {
          id: "uni3",
          nombre: "UNALM Agraria",
          dir: "La Molina",
          lat: -12.082,
          lng: -76.944,
          precio: "12",
          esPrivado: false,
        },
        {
          id: "uni5",
          nombre: "PUCP Católica",
          dir: "San Miguel",
          lat: -12.069,
          lng: -77.079,
          precio: "18",
          esPrivado: true,
        },
        {
          id: "uni6",
          nombre: "U de Lima",
          dir: "Surco",
          lat: -12.084,
          lng: -76.97,
          precio: "20",
          esPrivado: true,
        },
        {
          id: "uni7",
          nombre: "USMP",
          dir: "La Molina",
          lat: -12.073,
          lng: -76.95,
          precio: "15",
          esPrivado: true,
        },
        {
          id: "uni8",
          nombre: "UPC Monterrico",
          dir: "Surco",
          lat: -12.103,
          lng: -76.962,
          precio: "22",
          esPrivado: true,
        },
        {
          id: "uni9",
          nombre: "Cayetano Heredia",
          dir: "San Martín",
          lat: -12.02,
          lng: -77.055,
          precio: "16",
          esPrivado: true,
        },
        {
          id: "uni11",
          nombre: "USIL",
          dir: "La Molina",
          lat: -12.073,
          lng: -76.944,
          precio: "15",
          esPrivado: true,
        },
        {
          id: "uni12",
          nombre: "UPN",
          dir: "Los Olivos",
          lat: -11.991,
          lng: -77.062,
          precio: "12",
          esPrivado: true,
        },
      ],
    },
    {
      id: "salud",
      titulo: "Salud",
      icono: "🏥",
      color: "#FF2D55",
      esPrivado: true,
      lugares: [
        {
          id: "sal1",
          nombre: "Clínica Montefiori",
          dir: "La Molina",
          lat: -12.07,
          lng: -76.94,
          precio: "25",
          esPrivado: true,
        },
        {
          id: "sal2",
          nombre: "Clínica Delgado Auna",
          dir: "Miraflores",
          lat: -12.12,
          lng: -77.03,
          precio: "30",
          esPrivado: true,
        },
        {
          id: "sal3",
          nombre: "Clínica Internacional",
          dir: "Cercado",
          lat: -12.058,
          lng: -77.038,
          precio: "22",
          esPrivado: true,
        },
        {
          id: "sal4",
          nombre: "Clínica Ricardo Palma",
          dir: "San Isidro",
          lat: -12.097,
          lng: -77.036,
          precio: "24",
          esPrivado: true,
        },
        {
          id: "sal9",
          nombre: "Hospital Rebagliati",
          dir: "Jesús María",
          lat: -12.077,
          lng: -77.04,
          precio: "8",
          esPrivado: false,
        },
        {
          id: "sal10",
          nombre: "Hospital Almenara",
          dir: "La Victoria",
          lat: -12.05,
          lng: -77.023,
          precio: "7",
          esPrivado: false,
        },
        {
          id: "sal11",
          nombre: "Hospital Loayza",
          dir: "Cercado",
          lat: -12.05,
          lng: -77.04,
          precio: "6",
          esPrivado: false,
        },
        {
          id: "sal16",
          nombre: "Posta C.S. Ate",
          dir: "Ate",
          lat: -12.05,
          lng: -76.92,
          precio: "5",
          esPrivado: false,
        },
      ],
    },
    {
      id: "malls",
      titulo: "Malls",
      icono: "🛍️",
      color: "#FF9500",
      esPrivado: false,
      lugares: [
        {
          id: "mall1",
          nombre: "Jockey Plaza",
          dir: "Surco",
          lat: -12.086,
          lng: -76.976,
          precio: "15",
          esPrivado: false,
        },
        {
          id: "mall2",
          nombre: "Larcomar",
          dir: "Miraflores",
          lat: -12.131,
          lng: -77.031,
          precio: "18",
          esPrivado: false,
        },
        {
          id: "mall3",
          nombre: "Puruchuco",
          dir: "Ate",
          lat: -12.045,
          lng: -76.934,
          precio: "9",
          esPrivado: false,
        },
        {
          id: "mall4",
          nombre: "Plaza San Miguel",
          dir: "San Miguel",
          lat: -12.076,
          lng: -77.083,
          precio: "12",
          esPrivado: false,
        },
        {
          id: "mall5",
          nombre: "MegaPlaza Norte",
          dir: "Independencia",
          lat: -11.99,
          lng: -77.063,
          precio: "14",
          esPrivado: false,
        },
        {
          id: "mall6",
          nombre: "Mall del Sur",
          dir: "SJM",
          lat: -12.155,
          lng: -76.98,
          precio: "16",
          esPrivado: false,
        },
      ],
    },
    {
      id: "colegios",
      titulo: "Colegios",
      icono: "🏫",
      color: "#007AFF",
      esPrivado: true,
      lugares: [
        {
          id: "col1",
          nombre: "Alpamayo",
          dir: "La Molina",
          lat: -12.075,
          lng: -76.95,
          precio: "12",
          esPrivado: true,
        },
        {
          id: "col2",
          nombre: "Villa María",
          dir: "La Molina",
          lat: -12.08,
          lng: -76.96,
          precio: "14",
          esPrivado: true,
        },
      ],
    },
    {
      id: "hoteles",
      titulo: "Hoteles",
      icono: "🏨",
      color: "#00D15E",
      esPrivado: true,
      lugares: [
        {
          id: "hot1",
          nombre: "Costa del Sol Ate",
          dir: "Ate",
          lat: -12.05,
          lng: -76.94,
          precio: "30",
          esPrivado: true,
        },
      ],
    },
    {
      id: "turismo",
      titulo: "Turismo",
      icono: "🏛️",
      color: "#0A2342",
      esPrivado: false,
      lugares: [
        {
          id: "tur1",
          nombre: "Puruchuco",
          dir: "Ate",
          lat: -12.045,
          lng: -76.934,
          precio: "5",
          esPrivado: false,
        },
        {
          id: "tur2",
          nombre: "Plaza de Armas",
          dir: "Cercado",
          lat: -12.046,
          lng: -77.03,
          precio: "8",
          esPrivado: false,
        },
      ],
    },
  ];

  const TODAS_APPS = [
    { id: "inDriver", nombre: "inDriver", icono: "💚", color: "#00D15E" },
    { id: "yango", nombre: "Yango", icono: "❤️", color: "#FF3B30" },
    { id: "didi", nombre: "DiDi", icono: "🧡", color: "#FF9500" },
    { id: "uber", nombre: "Uber", icono: "⬛", color: "#000" },
  ];
  const TODOS_PAGOS = [
    {
      id: "yape",
      nombre: "Yape",
      icono: "💜",
      color: "#7B2CBF",
      scheme: "yape://",
      store:
        "https://play.google.com/store/apps/details?id=com.bcp.innovacxion.yapeapp",
    },
    {
      id: "plin",
      nombre: "Plin",
      icono: "💙",
      color: "#00B4D8",
      scheme: "plin://",
      store: "https://play.google.com/store/apps/details?id=com.bbva.plin",
    },
    {
      id: "ligo",
      nombre: "Ligo",
      icono: "💛",
      color: "#FFC300",
      scheme: "ligo://",
      store: "https://play.google.com/store/apps/details?id=com.ligo.wallet",
    },
  ];

  const abrirMonedero = async (tipo) => {
    const pago = TODOS_PAGOS.find((p) => p.id === tipo);
    if (!pago) return;
    try {
      const puedeAbrir = await Linking.canOpenURL(pago.scheme);
      if (puedeAbrir) {
        await Linking.openURL(pago.scheme);
      } else {
        Alert.alert(
          pago.nombre,
          `Se abriría ${pago.nombre} para pagar S/ ${miPrecio}`,
        );
      }
    } catch (e) {
      Alert.alert(pago.nombre, `Se abriría ${pago.nombre}`);
    }
    setShowSelectorPago(false);
  };

  const handlePagarAbajo = () => {
    const lista = Object.keys(pagosPrefs);
    if (lista.length === 0) {
      setTempPagos({ yape: false, plin: false, ligo: false });
      setShowPagos(true);
      return;
    }
    if (lista.length === 1) {
      abrirMonedero(lista[0]);
    } else {
      setShowSelectorPago(true);
    }
  };

  useEffect(() => {
    if (
      !miCiudadAbierta ||
      categoriaActiva ||
      showSplash ||
      editOrigen ||
      editDestino ||
      editPrecio
    )
      return;
    const t = setInterval(() => {
      if (cintaRef.current) {
        pos.current += 1.8;
        if (pos.current > 2500) pos.current = 0;
        cintaRef.current.scrollTo({ x: pos.current, animated: false });
      }
    }, 25);
    return () => clearInterval(t);
  }, [
    miCiudadAbierta,
    categoriaActiva,
    showSplash,
    editOrigen,
    editDestino,
    editPrecio,
  ]);

  const seleccionar = (item) => {
    if (bloqueados[item.id] && !modoAdmin) {
      alert(`🔒 ${item.nombre} BLOQUEADO`);
      return;
    }
    setLugarSel(item);
    setTextoDestino(`${item.nombre} - ${item.dir}`);
    setPrecioAllHere(item.precio);
    setMiPrecio(item.precio);
    setCategoriaActiva(null);
    setEditDestino(false);
    obtenerRuta({ latitude: item.lat, longitude: item.lng });
    setTimeout(() => {
      setMiCiudadAbierta(false);
      setCategoriaActiva(null);
      setCintaPos(null);
    }, 5000);
  };
  const obtenerRuta = async (dest) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origen.longitude},${origen.latitude};${dest.longitude},${dest.latitude}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates.map((c) => ({
          latitude: c[1],
          longitude: c[0],
        }));
        setRutaReal(coords);
        mapRef.current?.fitToCoordinates([...coords, origen, dest], {
          edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
          animated: true,
        });
      }
    } catch (e) {}
  };
  const tocarCajita = (id) => {
    if (cintaPos === id) {
      setCategoriaActiva(id);
    } else {
      setCintaPos(id);
      // Primer toque marca, segundo abre - mensaje
    }
  };
  const cancelar = () => {
    setLugarSel(null);
    setRutaReal([]);
    setTextoDestino("");
    setMiCiudadAbierta(true);
    setCategoriaActiva(null);
    setCintaPos(null);
    setEditOrigen(false);
    setEditDestino(false);
    setEditPrecio(false);
  };
  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status === "granted")
        Location.getCurrentPositionAsync({}).then((loc) =>
          setUbicacion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          }),
        );
    });
  }, []);
  const cat = CAJITAS.find((c) => c.id === categoriaActiva);
  const cardBg = modoOscuro ? "#121212" : "white";
  const textColor = modoOscuro ? "white" : "#0A2342";
  const pagoPrincipal = Object.keys(pagosPrefs)[0] || "yape";
  const pagoInfo =
    TODOS_PAGOS.find((p) => p.id === pagoPrincipal) || TODOS_PAGOS[0];
  const numMonederos = Object.keys(pagosPrefs).length;
  const numApps = Object.keys(appsPrefs).length;

  if (showSplash) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0A2342",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 300,
              height: 8,
              backgroundColor: "white",
              borderRadius: 4,
              marginBottom: 15,
            }}
          />
          <Text
            style={{
              fontSize: 62,
              fontWeight: "bold",
              color: "white",
              letterSpacing: -3,
              fontFamily: "System",
            }}
          >
            AllHere
          </Text>
          <View style={{ flexDirection: "row", gap: 90, marginTop: -5 }}>
            <View
              style={{
                width: 60,
                height: 30,
                backgroundColor: "#FFC300",
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: "#0A2342",
                  borderRadius: 9,
                  borderWidth: 3,
                  borderColor: "black",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: "white",
                    borderRadius: 3,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                width: 60,
                height: 30,
                backgroundColor: "#FFC300",
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: "#0A2342",
                  borderRadius: 9,
                  borderWidth: 3,
                  borderColor: "black",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: "white",
                    borderRadius: 3,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#FFC300",
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 10,
            marginTop: 40,
          }}
        >
          <Text style={{ fontWeight: "bold", color: "black", fontSize: 13 }}>
            TU CIUDAD EN UNA APP
          </Text>
        </View>
        <Text
          style={{
            color: "#FFC300",
            fontSize: 10,
            marginTop: 20,
            fontWeight: "bold",
          }}
        >
          🚗 CARGANDO TU CARRITO...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: modoOscuro ? "black" : "white",
          paddingTop: 28,
        }}
      >
        <View
          style={{
            backgroundColor: modoOscuro ? "#000" : "#0A2342",
            paddingBottom: 6,
            borderBottomWidth: 3,
            borderColor: "#FFC300",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 6,
              gap: 6,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setTempApps({
                  inDriver: !!appsPrefs.inDriver,
                  yango: !!appsPrefs.yango,
                  didi: !!appsPrefs.didi,
                  uber: !!appsPrefs.uber,
                });
                setShowApps(true);
              }}
              style={{
                backgroundColor: "#00D15E",
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 7,
                borderWidth: 1,
                borderColor: "white",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 10, color: "white" }}
              >
                📱 MIS APPS ({numApps})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTempPagos({
                  yape: !!pagosPrefs.yape,
                  plin: !!pagosPrefs.plin,
                  ligo: !!pagosPrefs.ligo,
                });
                setShowPagos(true);
              }}
              style={{
                backgroundColor: "#7B2CBF",
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 7,
                borderWidth: 1,
                borderColor: "white",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 10, color: "white" }}
              >
                💳 MONEDEROS ({numMonederos})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModoOscuro(!modoOscuro)}
              style={{
                backgroundColor: "#FFC300",
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 7,
                flex: 1,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 11, color: "black" }}
              >
                {modoOscuro ? "☀️ CLARO" : "🌙 OSCURO"}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 8,
              marginTop: 8,
              alignItems: "center",
              gap: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (miCiudadAbierta && categoriaActiva) {
                  setCategoriaActiva(null);
                  setCintaPos(null);
                } else {
                  setMiCiudadAbierta(!miCiudadAbierta);
                  setCategoriaActiva(null);
                  setCintaPos(null);
                }
              }}
              style={{
                backgroundColor: "#FFC300",
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderWidth: 2,
                borderColor: "white",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 12, color: "black" }}
              >
                {miCiudadAbierta ? "✕ MI CIUDAD" : "📦 MI CIUDAD"} (
                {CAJITAS.length})
              </Text>
            </TouchableOpacity>
            <Text style={{ color: "#FFC300", fontSize: 9, flex: 1 }}>
              {categoriaActiva
                ? `Viendo ${cat?.lugares.length} lugares`
                : "Toca cajita 1 vez marca, 2 veces abre"}
            </Text>
          </View>
          {miCiudadAbierta &&
            !categoriaActiva &&
            !editOrigen &&
            !editDestino &&
            !editPrecio && (
              <View
                style={{
                  backgroundColor: "#FFF9D6",
                  marginTop: 8,
                  paddingVertical: 10,
                  borderTopWidth: 2,
                  borderBottomWidth: 2,
                  borderColor: "#FFC300",
                }}
              >
                <ScrollView
                  ref={cintaRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}
                >
                  {CAJITAS.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => tocarCajita(c.id)}
                      style={{
                        backgroundColor: cintaPos === c.id ? c.color : "white",
                        borderRadius: 20,
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderWidth: cintaPos === c.id ? 2 : 1.5,
                        borderColor:
                          cintaPos === c.id
                            ? "black"
                            : c.esPrivado
                              ? "#FFC300"
                              : "#DDD",
                        elevation: cintaPos === c.id ? 4 : 0,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 10,
                          color: cintaPos === c.id ? "white" : "black",
                        }}
                      >
                        {c.icono} {c.titulo} ({c.lugares.length}){" "}
                        {cintaPos === c.id ? "👇 TOCA OTRA VEZ" : ""}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          {cat && !editPrecio && (
            <View
              style={{
                backgroundColor: "white",
                paddingVertical: 10,
                borderBottomWidth: 3,
                borderColor: cat.color,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: 12, color: cat.color }}
                >
                  {cat.icono} {cat.titulo.toUpperCase()} - {cat.lugares.length}{" "}
                  LUGARES ENCONTRADOS ✅
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setCategoriaActiva(null);
                    setCintaPos(null);
                  }}
                  style={{
                    backgroundColor: cat.color,
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{ fontWeight: "bold", color: "white", fontSize: 10 }}
                  >
                    ✕ VOLVER A CINTA
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  gap: 10,
                  marginTop: 8,
                }}
              >
                {cat.lugares.map((item) => {
                  const bloqueado = bloqueados[item.id];
                  return (
                    <View
                      key={item.id}
                      style={{
                        width: 160,
                        backgroundColor: bloqueado ? "#FFE6E6" : "#FFF9D6",
                        borderRadius: 12,
                        padding: 10,
                        borderWidth: 2,
                        borderColor: bloqueado ? "#FF3B30" : cat.color,
                      }}
                    >
                      <Text
                        style={{ fontWeight: "bold", fontSize: 11 }}
                        numberOfLines={2}
                      >
                        {item.nombre}
                      </Text>
                      <Text
                        style={{ fontSize: 8, color: "gray", marginTop: 2 }}
                      >
                        📍 {item.dir}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          color: cat.color,
                          marginTop: 3,
                        }}
                      >
                        S/ {item.precio} {item.esPrivado ? "💰" : "🆓"}
                      </Text>
                      <TouchableOpacity
                        onPress={() => seleccionar(item)}
                        style={{
                          backgroundColor:
                            bloqueado && !modoAdmin ? "#999" : cat.color,
                          borderRadius: 8,
                          paddingVertical: 7,
                          marginTop: 7,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 10,
                            fontWeight: "bold",
                          }}
                        >
                          {bloqueado && !modoAdmin
                            ? "🔒 BLOQUEADO"
                            : "✅ ELEGIR DESTINO"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={{ backgroundColor: cardBg, padding: 6 }}>
          {!editDestino && !editPrecio && (
            <TouchableOpacity
              onPress={() => {
                setEditOrigen(!editOrigen);
                setEditDestino(false);
              }}
              style={{
                backgroundColor: editOrigen
                  ? "#E8FFF0"
                  : modoOscuro
                    ? "#2A2A2A"
                    : "#F5F5F5",
                borderRadius: 12,
                padding: editOrigen ? 10 : 8,
                borderWidth: 1,
                borderColor: editOrigen ? "#00D15E" : "#444",
              }}
            >
              <Text
                style={{ fontSize: 8, color: "#00D15E", fontWeight: "bold" }}
              >
                MI UBICACIÓN ✎ TOCA
              </Text>
              {editOrigen ? (
                <TextInput
                  value={textoOrigen}
                  onChangeText={setTextoOrigen}
                  multiline
                  autoFocus
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "black",
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 10,
                    marginTop: 6,
                    minHeight: 60,
                  }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "bold",
                    color: textColor,
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {textoOrigen}
                </Text>
              )}
              {editOrigen && (
                <View style={{ flexDirection: "row", gap: 6, marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={() => setEditOrigen(false)}
                    style={{
                      flex: 1,
                      backgroundColor: "#0A2342",
                      borderRadius: 8,
                      paddingVertical: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 11,
                      }}
                    >
                      ✅ LISTO
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          )}
          {!editOrigen && !editPrecio && (
            <TouchableOpacity
              onPress={() => {
                setEditDestino(!editDestino);
                setEditOrigen(false);
              }}
              style={{
                backgroundColor: editDestino
                  ? "#FFF0F0"
                  : modoOscuro
                    ? "#2A2A2A"
                    : "#F5F5F5",
                borderRadius: 12,
                padding: editDestino ? 10 : 8,
                borderWidth: 1,
                borderColor: editDestino ? "#FF3B30" : "#444",
                marginTop: 6,
              }}
            >
              <Text
                style={{ fontSize: 8, color: "#FF3B30", fontWeight: "bold" }}
              >
                DESTINO ✎ TOCA
              </Text>
              {editDestino ? (
                <TextInput
                  value={textoDestino}
                  onChangeText={setTextoDestino}
                  multiline
                  autoFocus
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "black",
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 10,
                    marginTop: 6,
                    minHeight: 60,
                  }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "bold",
                    color: textoDestino ? textColor : "gray",
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {textoDestino || "Toca MI CIUDAD arriba"}
                </Text>
              )}
              {editDestino && (
                <TouchableOpacity
                  onPress={() => setEditDestino(false)}
                  style={{
                    backgroundColor: "#0A2342",
                    borderRadius: 8,
                    paddingVertical: 10,
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 11 }}
                  >
                    ✅ LISTO
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={{ flex: 1, minHeight: 200 }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            customMapStyle={modoOscuro ? MAPA_OSCURO : []}
            initialRegion={{
              latitude: origen.latitude,
              longitude: origen.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={origen}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
            >
              <View
                style={{
                  backgroundColor: "#00FF88",
                  borderRadius: 20,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderWidth: 3,
                  borderColor: "white",
                  flexDirection: "row",
                  alignItems: "center",
                  elevation: 5,
                }}
              >
                <Text style={{ fontSize: 16 }}>🚗</Text>
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 10,
                    marginLeft: 4,
                  }}
                >
                  D6 - TU CARRITO
                </Text>
              </View>
            </Marker>
            {lugarSel && (
              <Marker
                coordinate={{ latitude: lugarSel.lat, longitude: lugarSel.lng }}
              >
                <View
                  style={{
                    backgroundColor: "#FF3B30",
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderWidth: 2,
                    borderColor: "white",
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 10 }}
                  >
                    {lugarSel.nombre.substring(0, 15)}
                  </Text>
                </View>
              </Marker>
            )}
            {rutaReal.length > 0 && (
              <>
                <Polyline
                  coordinates={rutaReal}
                  strokeColor={modoOscuro ? "white" : "#0A2342"}
                  strokeWidth={8}
                />
                <Polyline
                  coordinates={rutaReal}
                  strokeColor="#FFC300"
                  strokeWidth={4}
                />
              </>
            )}
          </MapView>
        </View>

        <View
          style={{
            backgroundColor: cardBg,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 10,
            paddingBottom: 70,
            borderWidth: 2,
            borderColor: "#FFC300",
            borderBottomWidth: 0,
          }}
        >
          {!editPrecio ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 8, color: "gray", fontWeight: "bold" }}
                  >
                    AllHere
                  </Text>
                  <View
                    style={{
                      backgroundColor: modoOscuro ? "#2A2A2A" : "#F0F0F0",
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      marginTop: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: textColor,
                      }}
                    >
                      S/ {precioAllHere}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1, marginHorizontal: 8 }}>
                  <Text
                    style={{
                      fontSize: 8,
                      color: textColor,
                      fontWeight: "bold",
                    }}
                  >
                    Tu oferta
                  </Text>
                  <TouchableOpacity
                    onPress={() => setEditPrecio(true)}
                    style={{
                      backgroundColor: "#FFF9D6",
                      borderRadius: 10,
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      marginTop: 2,
                      borderWidth: 1.5,
                      borderColor: "#FFC300",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        fontSize: 11,
                      }}
                    >
                      S/
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: "black",
                      }}
                    >
                      {miPrecio}
                    </Text>
                    <Text style={{ fontSize: 10 }}>✎</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    flex: 1.3,
                    backgroundColor: "#FF0080",
                    borderRadius: 12,
                    paddingVertical: 8,
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: "#FFC300",
                    elevation: 5,
                  }}
                >
                  <Text style={{ fontSize: 10 }}>🎉✨🎊</Text>
                  <Text
                    style={{ fontWeight: "bold", fontSize: 11, color: "white" }}
                  >
                    Pedir AllHere
                  </Text>
                  <View
                    style={{
                      backgroundColor: "white",
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      marginTop: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 11,
                        color: "#FF0080",
                      }}
                    >
                      S/ {miPrecio} 🚀
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                <TouchableOpacity
                  onPress={cancelar}
                  style={{
                    width: 90,
                    backgroundColor: "transparent",
                    borderRadius: 8,
                    paddingVertical: 8,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#FF3B30",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 9,
                      color: "#FF3B30",
                    }}
                  >
                    ✕ CANCELAR
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePagarAbajo}
                  style={{
                    flex: 1,
                    backgroundColor: pagoInfo.color,
                    borderRadius: 10,
                    paddingVertical: 9,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                    borderWidth: 1.5,
                    borderColor: "#FFC300",
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{pagoInfo.icono}</Text>
                  <Text
                    style={{ fontWeight: "bold", fontSize: 12, color: "white" }}
                  >
                    PAGAR CON {pagoPrincipal.toUpperCase()} ↗️
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 10,
                  color: "#FFC300",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                💰 INGRESA TU OFERTA
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                  gap: 10,
                }}
              >
                <Text
                  style={{ fontSize: 28, fontWeight: "bold", color: textColor }}
                >
                  S/
                </Text>
                <View
                  style={{
                    backgroundColor: "#FFF9D6",
                    borderRadius: 14,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderWidth: 2,
                    borderColor: "#FFC300",
                    minWidth: 140,
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    value={miPrecio}
                    onChangeText={setMiPrecio}
                    keyboardType="numeric"
                    autoFocus
                    selectTextOnFocus
                    style={{
                      fontWeight: "bold",
                      fontSize: 32,
                      color: "black",
                      minWidth: 100,
                      textAlign: "center",
                    }}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setEditPrecio(false)}
                style={{
                  backgroundColor: "#0A2342",
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  marginTop: 12,
                  borderWidth: 2,
                  borderColor: "#FFC300",
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 13 }}
                >
                  ✅ LISTO - VOLVER NORMAL
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Modal visible={showSelectorPago} transparent animationType="slide">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.8)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                💳 Elige tu monedero S/ {miPrecio}
              </Text>
              {Object.keys(pagosPrefs).map((id) => {
                const p = TODOS_PAGOS.find((x) => x.id === id);
                return (
                  <TouchableOpacity
                    key={id}
                    onPress={() => abrirMonedero(id)}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderColor: "#EEE",
                      marginTop: 8,
                      backgroundColor: "#F9F9F9",
                      borderRadius: 12,
                      paddingHorizontal: 12,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      {p.icono} {p.nombre}
                    </Text>
                    <View
                      style={{
                        backgroundColor: p.color,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 10,
                        }}
                      >
                        ABRIR ↗️
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                onPress={() => setShowSelectorPago(false)}
                style={{
                  backgroundColor: "#EEE",
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* MODAL MIS APPS - AHORA SÍ ABRE CON BOTÓN AÑADIR Y LISTO */}
        <Modal
          visible={showApps}
          transparent
          animationType="slide"
          onRequestClose={() => setShowApps(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.8)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                maxHeight: "80%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  📱 MIS APPS DE TAXI
                </Text>
                <TouchableOpacity
                  onPress={() => setShowApps(false)}
                  style={{
                    backgroundColor: "#EEE",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 11, color: "gray", marginTop: 4 }}>
                Toca AÑADIR para agregar tu app de taxi
              </Text>
              <ScrollView style={{ marginTop: 12, maxHeight: 400 }}>
                {TODAS_APPS.map((app) => {
                  const activo = !!tempApps[app.id];
                  return (
                    <View
                      key={app.id}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderColor: "#EEE",
                        backgroundColor: activo ? "#E8FFF0" : "white",
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        marginVertical: 4,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: app.color,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ color: "white", fontWeight: "bold" }}>
                            {app.icono}
                          </Text>
                        </View>
                        <View>
                          <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                            {app.nombre}
                          </Text>
                          <Text style={{ fontSize: 9, color: "gray" }}>
                            {activo ? "✅ Añadida" : "No añadida"}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          setTempApps({
                            ...tempApps,
                            [app.id]: !tempApps[app.id],
                          })
                        }
                        style={{
                          backgroundColor: activo ? "#FF3B30" : "#00D15E",
                          borderRadius: 10,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 11,
                          }}
                        >
                          {activo ? "QUITAR" : "➕ AÑADIR"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 15 }}>
                <TouchableOpacity
                  onPress={() => setShowApps(false)}
                  style={{
                    flex: 1,
                    backgroundColor: "#EEE",
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const f = Object.fromEntries(
                      Object.entries(tempApps).filter(([k, v]) => v),
                    );
                    setAppsPrefs(f);
                    setShowApps(false);
                  }}
                  style={{
                    flex: 2,
                    backgroundColor: "#00D15E",
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    ✅ LISTO - {Object.values(tempApps).filter(Boolean).length}{" "}
                    APPS AÑADIDAS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* MODAL MONEDEROS - AHORA SÍ ABRE CON BOTÓN AÑADIR Y LISTO */}
        <Modal
          visible={showPagos}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPagos(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.8)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                maxHeight: "80%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  💳 MONEDEROS
                </Text>
                <TouchableOpacity
                  onPress={() => setShowPagos(false)}
                  style={{
                    backgroundColor: "#EEE",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 11, color: "gray", marginTop: 4 }}>
                Toca AÑADIR para agregar tu billetera - abajo se abre automático
              </Text>
              <ScrollView style={{ marginTop: 12, maxHeight: 400 }}>
                {TODOS_PAGOS.map((pago) => {
                  const activo = !!tempPagos[pago.id];
                  return (
                    <View
                      key={pago.id}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderColor: "#EEE",
                        backgroundColor: activo ? "#F3E8FF" : "white",
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        marginVertical: 4,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: pago.color,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: pago.id === "ligo" ? "black" : "white",
                              fontWeight: "bold",
                            }}
                          >
                            {pago.icono}
                          </Text>
                        </View>
                        <View>
                          <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                            {pago.nombre}
                          </Text>
                          <Text style={{ fontSize: 9, color: "gray" }}>
                            {activo
                              ? "✅ Añadido - Abre automático"
                              : "No añadido"}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          setTempPagos({
                            ...tempPagos,
                            [pago.id]: !tempPagos[pago.id],
                          })
                        }
                        style={{
                          backgroundColor: activo ? "#FF3B30" : "#7B2CBF",
                          borderRadius: 10,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 11,
                          }}
                        >
                          {activo ? "QUITAR" : "➕ AÑADIR"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 15 }}>
                <TouchableOpacity
                  onPress={() => setShowPagos(false)}
                  style={{
                    flex: 1,
                    backgroundColor: "#EEE",
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const f = Object.fromEntries(
                      Object.entries(tempPagos).filter(([k, v]) => v),
                    );
                    setPagosPrefs(f);
                    setShowPagos(false);
                  }}
                  style={{
                    flex: 2,
                    backgroundColor: "#7B2CBF",
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    ✅ LISTO - {Object.values(tempPagos).filter(Boolean).length}{" "}
                    MONEDEROS AÑADIDOS - ABAJO CAMBIA
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}
