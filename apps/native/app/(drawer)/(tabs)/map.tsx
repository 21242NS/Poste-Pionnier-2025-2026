import { View, Text } from "react-native";
import { Container } from "@/components/container";

export default function Carte() {
  return (
    <Container className="p-6">
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🗺️</Text>
        <Text className="text-foreground text-xl font-bold mb-2">Carte GPS</Text>
        <Text className="text-muted text-center text-sm">
          La carte est disponible uniquement sur l'application mobile.
        </Text>
      </View>
    </Container>
  );
}
