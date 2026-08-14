import { Restaurant } from "@food-tower/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { api } from "../../../lib/axios";
import { useEffect } from "react";
import { router } from "expo-router";

export default function OwnerHomeScreen() {
  const queryClient = useQueryClient();

  const { data: restaurant, isLoading } = useQuery<Restaurant | null>({
    queryKey: ["my-restaurant"],
    queryFn: () =>
      api.get<Restaurant | null>("/restaurants/mine").then((res) => res.data),
  });

  const { mutate: toggleOpen } = useMutation({
    mutationFn: () =>
      api.patch(`/restaurants/${restaurant?.id}`, {
        isOpen: !restaurant?.isOpen,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["my-restaurant"] }),
  });

  useEffect(() => {
    if (isLoading) return;
    if (!restaurant) {
      router.replace("/(owner)/(index)/create-restaurant");
    }
  }, [restaurant, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{restaurant?.name}</Text>
      <Pressable
        style={[
          styles.toggleButton,
          restaurant?.isOpen ? styles.open : styles.closed,
        ]}
        onPress={() => toggleOpen}
      >
        <Text style={styles.toggleText}>
          {restaurant?.isOpen ? "Open - tap to close" : "Closed - tap to open"}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.editButton]}
        onPress={() => router.push("/(owner)/(index)/edit-restaurant")}
      >
        <Text style={styles.editButtonText}>Edit Restaurant</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    flex: 1,
    width: "100%",
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  name: {
    flex: 1,
    flexShrink: 1,
    fontSize: 20,
    fontWeight: "700",
  },
  toggleButton: {
    flexShrink: 0,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  open: {
    backgroundColor: "#22C55E",
  },
  closed: {
    backgroundColor: "#EF4444",
  },
  toggleText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  editButton: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  list: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  orderCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    marginBottom: 12,
    gap: 6,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 15,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6B35",
  },
  orderAddress: {
    fontSize: 13,
    color: "#666",
  },
  actionButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
