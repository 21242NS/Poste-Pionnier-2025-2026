import { Button, ErrorView, Spinner, Surface, TextField } from "heroui-native";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { useTicket } from "hooks";
import { orpc } from "@/utils/orpc";

export default function Billets() {
  const { tickets, addTicket, description, setDescription } = useTicket(orpc);

  return (
    <Container className="p-4">
      <Text className="text-2xl font-bold text-foreground mb-4">Billets</Text>

      <Surface variant="secondary" className="p-4 rounded-2xl mb-4">
        <Text className="text-foreground font-semibold mb-3">Nouveau billet</Text>

        <ErrorView isInvalid={!!tickets.error} className="mb-3">
          {tickets.error?.message ?? null}
        </ErrorView>

        <View className="gap-3">
          <TextField>
            <TextField.Label>Description</TextField.Label>
            <TextField.Input
              value={description}
              onChangeText={setDescription}
              placeholder="Description du billet..."
              multiline
            />
          </TextField>

          <Button
            onPress={addTicket}
            isDisabled={tickets.isLoading || !description.trim()}
          >
            {tickets.isLoading ? (
              <Spinner size="sm" color="default" />
            ) : (
              <Button.Label>Ajouter</Button.Label>
            )}
          </Button>
        </View>
      </Surface>

      {tickets.isLoading && (
        <View className="items-center py-8">
          <Spinner />
        </View>
      )}

      {(tickets.data ?? []).map((ticket) => (
        <View key={ticket.id} className="bg-surface border border-divider rounded-2xl p-4 mb-3">
          <Text className="text-foreground">{ticket.description}</Text>
          <Text className="text-muted text-xs mt-1">
            {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
          </Text>
        </View>
      ))}

      {!tickets.isLoading && (tickets.data?.length ?? 0) === 0 && (
        <View className="items-center py-12">
          <Text className="text-muted-foreground">Aucun billet</Text>
        </View>
      )}
    </Container>
  );
}
