import { Button, ErrorView, Spinner, Surface, TextField } from "heroui-native";
import { Text, View } from "react-native";

import { useTicket } from "hooks";
import { orpc } from "@/utils/orpc";

export function Ticket() {
  const { tickets, addTicket, description, setDescription } = useTicket(orpc);

  return (
    <Surface variant="secondary" className="p-4 rounded-lg">
      <Text className="text-foreground font-medium mb-4">Tickets</Text>

      <ErrorView isInvalid={!!tickets.error} className="mb-3">
        {tickets.error?.message ?? null}
      </ErrorView>

      <View className="gap-3">
        {tickets.isLoading && <Spinner />}

        {tickets.data?.map((ticket) => (
          <Text key={ticket.id} className="text-foreground">
            {ticket.description}
          </Text>
        ))}

        <TextField>
          <TextField.Label>Description</TextField.Label>
          <TextField.Input
            value={description}
            onChangeText={setDescription}
            placeholder="Nouvelle description"
          />
        </TextField>

        <Button onPress={addTicket} isDisabled={tickets.isLoading || !description.trim()}>
          <Button.Label>Add Ticket</Button.Label>
        </Button>
      </View>
    </Surface>
  );
}
