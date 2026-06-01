import { Button, ErrorView, Spinner, Surface, TextField } from "heroui-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Container } from "@/components/container";
import { useCommand } from "hooks";
import type { CommandeRecord } from "hooks";
import { orpc } from "@/utils/orpc";
import { authClient } from "@/lib/auth-client";

const ROLE_OPTIONS = [
  ["PARENT_ANIMEE", "Parent animé"],
  ["ANIMEE", "Animé"],
  ["ANIMATEUR", "Animateur"],
  ["ADMIN", "Admin"],
  ["EXTERN", "Externe"],
] as const;

const SECTION_OPTIONS = [
  ["BALADIN", "Baladin"],
  ["MEUTE_SEEONEE", "Meute Seeonee"],
  ["MEUTE_DU_PEUPLE_LIBRE", "Peuple Libre"],
  ["TROUPE_DU_GRAND_VENEUR_GOELAND", "Grand Veneur"],
] as const;

const SANDWICH_OPTIONS = [
  ["POULET_CURRY", "Poulet curry"],
  ["HOUMOUS", "Houmous"],
  ["CLUB_JAMBON_FROMAGE", "Club J.F."],
  ["JAMBON", "Jambon"],
  ["FROMAGE", "Fromage"],
  ["THON", "Thon"],
] as const;

const SAUCE_OPTIONS = [
  ["MAYONNAISE", "Mayonnaise"],
  ["KETCHUP", "Ketchup"],
  ["NONE", "Aucune"],
] as const;

const JUICE_OPTIONS = [
  ["ORANGE", "Orange"],
  ["POMME", "Pomme"],
] as const;

const SANDWICH_LABELS: Record<string, string> = Object.fromEntries(SANDWICH_OPTIONS);
const SAUCE_LABELS: Record<string, string> = Object.fromEntries(SAUCE_OPTIONS);
const JUICE_LABELS: Record<string, string> = Object.fromEntries(JUICE_OPTIONS);
const SECTION_LABELS: Record<string, string> = Object.fromEntries(SECTION_OPTIONS);

function OptionPicker<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly (readonly [string, string])[];
  onChange: (v: T) => void;
}) {
  return (
    <View className="mb-3">
      <Text className="text-muted-foreground text-xs mb-1.5">{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2 pb-1">
          {options.map(([val, lbl]) => (
            <Pressable
              key={val}
              onPress={() => onChange(val as T)}
              className={`px-3 py-1.5 rounded-full border ${
                value === val ? "bg-accent border-accent" : "border-divider bg-surface"
              }`}
            >
              <Text
                className={`text-sm ${value === val ? "text-accent-foreground" : "text-foreground"}`}
              >
                {lbl}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ToggleChip({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      className={`px-3 py-1.5 rounded-full border ${
        value ? "bg-accent border-accent" : "border-divider bg-surface"
      }`}
    >
      <Text className={`text-sm ${value ? "text-accent-foreground" : "text-foreground"}`}>
        {label}
      </Text>
    </Pressable>
  );
}

function CommandCard({
  command,
  onDelete,
}: {
  command: CommandeRecord;
  onDelete: (id: string) => void;
}) {
  const garnitures = [
    command.tomato && "Tomate",
    command.lettuce && "Salade",
    command.cucumber && "Concombre",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <View className="bg-surface border border-divider rounded-2xl p-4 mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-foreground font-semibold text-base">{command.name}</Text>
          <Text className="text-muted-foreground text-xs">{command.email}</Text>
        </View>
        <View
          className={`px-2 py-0.5 rounded-full ${command.payment ? "bg-success-soft-hover" : "bg-default"}`}
        >
          <Text
            className={`text-xs font-medium ${command.payment ? "text-success" : "text-muted"}`}
          >
            {command.payment ? "Payé" : "Non payé"}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-1.5 mb-3">
        <View className="bg-default px-2 py-0.5 rounded-md">
          <Text className="text-xs text-foreground">
            {SANDWICH_LABELS[command.sandwichChoice] ?? command.sandwichChoice}
          </Text>
        </View>
        <View className="bg-default px-2 py-0.5 rounded-md">
          <Text className="text-xs text-foreground">
            {SAUCE_LABELS[command.sauce] ?? command.sauce}
          </Text>
        </View>
        <View className="bg-default px-2 py-0.5 rounded-md">
          <Text className="text-xs text-foreground">
            {JUICE_LABELS[command.juice] ?? command.juice}
          </Text>
        </View>
        {garnitures ? (
          <View className="bg-default px-2 py-0.5 rounded-md">
            <Text className="text-xs text-foreground">{garnitures}</Text>
          </View>
        ) : null}
      </View>

      {command.remark ? (
        <Text className="text-muted text-xs mb-3 italic">{command.remark}</Text>
      ) : null}

      <Text className="text-muted text-xs mb-2">
        {SECTION_LABELS[command.section] ?? command.section}
      </Text>

      <Pressable
        onPress={() => onDelete(command.id)}
        className="self-end border border-divider rounded-lg px-3 py-1.5 active:opacity-60"
      >
        <Text className="text-foreground text-xs">Supprimer</Text>
      </Pressable>
    </View>
  );
}

export default function Commandes() {
  const [showForm, setShowForm] = useState(false);
  const { data: session } = authClient.useSession();
  const {
    commands,
    role, setRole,
    email, setEmail,
    section, setSection,
    name, setName,
    sandwichChoice, setSandwichChoice,
    tomato, setTomato,
    lettuce, setLettuce,
    cucumber, setCucumber,
    sauce, setSauce,
    juice, setJuice,
    remark, setRemark,
    payment, setPayment,
    addCommand,
    deleteCommand,
    isAdding,
  } = useCommand(orpc);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session?.user?.email]);

  if (!session?.user) {
    return (
      <Container className="p-6">
        <Text className="text-2xl font-bold text-foreground mb-2">Commandes</Text>
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted text-center mb-2">
            Connecte-toi pour voir et ajouter des commandes.
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container className="p-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-foreground">Commandes</Text>
        <Pressable
          onPress={() => setShowForm(!showForm)}
          className="bg-accent px-4 py-2 rounded-xl active:opacity-80"
        >
          <Text className="text-accent-foreground font-medium text-sm">
            {showForm ? "Fermer" : "+ Ajouter"}
          </Text>
        </Pressable>
      </View>

      {showForm && (
        <Surface variant="secondary" className="p-4 rounded-2xl mb-4">
          <Text className="text-foreground font-semibold mb-4">Nouvelle commande</Text>

          <ErrorView isInvalid={!!commands.error} className="mb-3">
            {commands.error?.message ?? null}
          </ErrorView>

          <View className="gap-3 mb-3">
            <TextField>
              <TextField.Label>Nom</TextField.Label>
              <TextField.Input
                value={name}
                onChangeText={setName}
                placeholder="Nom complet"
                autoCapitalize="words"
              />
            </TextField>
            <TextField>
              <TextField.Label>Email</TextField.Label>
              <TextField.Input
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </TextField>
          </View>

          <OptionPicker label="Rôle" value={role} options={ROLE_OPTIONS} onChange={setRole} />
          <OptionPicker
            label="Section"
            value={section}
            options={SECTION_OPTIONS}
            onChange={setSection}
          />
          <OptionPicker
            label="Sandwich"
            value={sandwichChoice}
            options={SANDWICH_OPTIONS}
            onChange={setSandwichChoice}
          />

          <View className="mb-3">
            <Text className="text-muted-foreground text-xs mb-1.5">Garnitures</Text>
            <View className="flex-row gap-2">
              <ToggleChip label="Tomate" value={tomato} onChange={setTomato} />
              <ToggleChip label="Salade" value={lettuce} onChange={setLettuce} />
              <ToggleChip label="Concombre" value={cucumber} onChange={setCucumber} />
            </View>
          </View>

          <OptionPicker label="Sauce" value={sauce} options={SAUCE_OPTIONS} onChange={setSauce} />
          <OptionPicker label="Jus" value={juice} options={JUICE_OPTIONS} onChange={setJuice} />

          <TextField>
            <TextField.Label>Remarque (optionnel)</TextField.Label>
            <TextField.Input
              value={remark}
              onChangeText={setRemark}
              placeholder="..."
              multiline
            />
          </TextField>

          <View className="mt-3 mb-4">
            <Text className="text-muted-foreground text-xs mb-1.5">Paiement</Text>
            <ToggleChip label="Payé" value={payment} onChange={setPayment} />
          </View>

          <Button
            onPress={addCommand}
            isDisabled={isAdding || !name.trim() || !email.trim()}
          >
            {isAdding ? <Spinner size="sm" color="default" /> : <Button.Label>Ajouter</Button.Label>}
          </Button>
        </Surface>
      )}

      {commands.isLoading && (
        <View className="items-center py-8">
          <Spinner />
        </View>
      )}

      {(commands.data ?? []).map((command: CommandeRecord) => (
        <CommandCard key={command.id} command={command} onDelete={deleteCommand} />
      ))}

      {!commands.isLoading && (commands.data?.length ?? 0) === 0 && (
        <View className="items-center py-12">
          <Text className="text-muted">Aucune commande</Text>
        </View>
      )}
    </Container>
  );
}

