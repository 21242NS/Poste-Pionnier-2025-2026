import * as Location from "expo-location";
import { Spinner, useThemeColor } from "heroui-native";
import { useColorScheme } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, type Region } from "react-native-maps";

import { Container } from "@/components/container";

// Coordonnées du local Poste Pionnier 124 – Watermael-Boitsfort
const POST_LOCATION = {
  latitude: 50.7977,
  longitude: 4.4134,
  name: "Poste Pionnier 124",
  address: "Watermael-Boitsfort, Bruxelles",
};

const INITIAL_REGION: Region = {
  latitude: POST_LOCATION.latitude,
  longitude: POST_LOCATION.longitude,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // mètres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function Carte() {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<"pending" | "granted" | "denied">("pending");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  const background = useThemeColor("background");
  const foreground = useThemeColor("foreground");
  const surface = useThemeColor("surface");
  const accent = useThemeColor("accent");
  const muted = useThemeColor("muted");
  const divider = useThemeColor("divider");
  const danger = useThemeColor("danger");

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionStatus("denied");
        setErrorMsg("Permission de localisation refusée.");
        return;
      }
      setPermissionStatus("granted");

      // Position initiale rapide
      const initial = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation(initial);

      // Puis mises à jour continues
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (loc) => setUserLocation(loc),
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  function centerOnMe() {
    if (!userLocation) return;
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600,
    );
  }

  function centerOnPost() {
    mapRef.current?.animateToRegion(
      { ...POST_LOCATION, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      600,
    );
  }

  const distance =
    userLocation != null
      ? haversineDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          POST_LOCATION.latitude,
          POST_LOCATION.longitude,
        )
      : null;

  if (permissionStatus === "pending") {
    return (
      <Container className="p-6">
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Spinner />
          <Text style={{ color: muted, marginTop: 12, fontSize: 14 }}>
            Demande de permission GPS…
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      {/* Carte plein écran */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        showsUserLocation={permissionStatus === "granted"}
        showsMyLocationButton={false}
        userInterfaceStyle={colorScheme ?? "light"}
      >
        {/* Marqueur du local */}
        <Marker
          coordinate={{ latitude: POST_LOCATION.latitude, longitude: POST_LOCATION.longitude }}
          pinColor={accent}
        >
          <Callout>
            <View style={{ padding: 8, maxWidth: 200 }}>
              <Text style={{ fontWeight: "600", fontSize: 14 }}>{POST_LOCATION.name}</Text>
              <Text style={{ color: "#666", fontSize: 12 }}>{POST_LOCATION.address}</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>

      {/* Panneau d'infos flottant en bas */}
      <View
        style={{
          position: "absolute",
          bottom: 32,
          left: 16,
          right: 16,
          backgroundColor: surface,
          borderRadius: 20,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {errorMsg ? (
          <Text style={{ color: danger, fontSize: 13, textAlign: "center" }}>{errorMsg}</Text>
        ) : (
          <>
            <Text style={{ color: foreground, fontWeight: "700", fontSize: 16, marginBottom: 4 }}>
              {POST_LOCATION.name}
            </Text>
            <Text style={{ color: muted, fontSize: 13, marginBottom: 12 }}>
              {POST_LOCATION.address}
            </Text>

            {/* Distance */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: background,
                borderRadius: 12,
                padding: 10,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: divider,
              }}
            >
              <Text style={{ fontSize: 22, marginRight: 10 }}>📍</Text>
              <View>
                <Text style={{ color: muted, fontSize: 11 }}>Distance jusqu'au local</Text>
                <Text style={{ color: foreground, fontWeight: "700", fontSize: 18 }}>
                  {distance != null ? formatDistance(distance) : "Calcul…"}
                </Text>
              </View>
            </View>

            {/* Boutons */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={centerOnMe}
                disabled={!userLocation}
                style={{
                  flex: 1,
                  backgroundColor: accent,
                  borderRadius: 12,
                  paddingVertical: 10,
                  alignItems: "center",
                  opacity: userLocation ? 1 : 0.4,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>
                  Ma position
                </Text>
              </Pressable>
              <Pressable
                onPress={centerOnPost}
                style={{
                  flex: 1,
                  backgroundColor: background,
                  borderRadius: 12,
                  paddingVertical: 10,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: divider,
                }}
              >
                <Text style={{ color: foreground, fontWeight: "600", fontSize: 13 }}>
                  Le local
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
