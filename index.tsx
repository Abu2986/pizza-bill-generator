import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

const PIZZAS = [
  {
    type: "veg",
    name: "Veg Pizza",
    tagline: "Garden-fresh toppings",
    price: 300,
    emoji: "🥦",
    isDelux: false,
  },
  {
    type: "nonveg",
    name: "Non-Veg Pizza",
    tagline: "Loaded with proteins",
    price: 400,
    emoji: "🍗",
    isDelux: false,
  },
  {
    type: "deluxveg",
    name: "Delux Veg",
    tagline: "Cheese & toppings included",
    price: 550,
    emoji: "🌿",
    isDelux: true,
  },
  {
    type: "deluxnonveg",
    name: "Delux Non-Veg",
    tagline: "Cheese & toppings included",
    price: 650,
    emoji: "🥩",
    isDelux: true,
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom + 24;

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: topPad, paddingBottom: botPad }}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={["#FF3B3020", "#FF950010", "transparent"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeEmoji}>🍕</Text>
          </View>
          <Text style={styles.heroTitle}>Pizza Mania</Text>
          <Text style={styles.heroSub}>Craft your perfect slice</Text>
          <View style={styles.heroPills}>
            <View style={styles.pill}><Text style={styles.pillText}>🔥 Hot & Fresh</Text></View>
            <View style={styles.pill}><Text style={styles.pillText}>⚡ Quick Order</Text></View>
            <View style={styles.pill}><Text style={styles.pillText}>✨ Premium Quality</Text></View>
          </View>
        </View>

        {/* Classic Pizzas */}
        <Text style={styles.sectionLabel}>Classic Pizzas</Text>
        <View style={styles.cardRow}>
          {PIZZAS.filter((p) => !p.isDelux).map((p) => (
            <RegularCard key={p.type} pizza={p} />
          ))}
        </View>

        {/* Premium divider */}
        <View style={styles.premiumDivider}>
          <LinearGradient
            colors={["transparent", Colors.gold + "40", "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.premiumDividerInner}>
            <Text style={styles.premiumDividerText}>⭐  Premium Selection</Text>
          </View>
        </View>

        {/* Delux Pizzas */}
        {PIZZAS.filter((p) => p.isDelux).map((p) => (
          <DeluxCard key={p.type} pizza={p} />
        ))}
      </ScrollView>
    </View>
  );
}

function RegularCard({ pizza }: { pizza: typeof PIZZAS[0] }) {
  return (
    <TouchableOpacity
      style={styles.regularCard}
      onPress={() => router.push({ pathname: "/order", params: { type: pizza.type } })}
      activeOpacity={0.8}
    >
      <View style={styles.regularEmojiWrap}>
        <Text style={styles.regularEmoji}>{pizza.emoji}</Text>
      </View>
      <Text style={styles.regularName}>{pizza.name}</Text>
      <Text style={styles.regularTagline}>{pizza.tagline}</Text>
      <View style={styles.regularBottom}>
        <Text style={styles.regularPrice}>₹{pizza.price}</Text>
        <LinearGradient colors={Colors.gradRed} style={styles.orderBtn}>
          <Text style={styles.orderBtnText}>Order</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

function DeluxCard({ pizza }: { pizza: typeof PIZZAS[0] }) {
  return (
    <TouchableOpacity
      style={styles.deluxCard}
      onPress={() => router.push({ pathname: "/order", params: { type: pizza.type } })}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={["#1C1600", "#0F0B00"]}
        style={StyleSheet.absoluteFill}
        borderRadius={20}
      />
      <LinearGradient
        colors={[Colors.gold + "20", "transparent"]}
        style={styles.deluxGlow}
      />
      <View style={styles.deluxLeft}>
        <View style={styles.deluxEmojiWrap}>
          <Text style={styles.deluxEmoji}>{pizza.emoji}</Text>
        </View>
        <View>
          <View style={styles.deluxNameRow}>
            <Text style={styles.deluxName}>{pizza.name}</Text>
            <View style={styles.deluxBadge}>
              <Text style={styles.deluxBadgeText}>DELUX</Text>
            </View>
          </View>
          <Text style={styles.deluxTagline}>{pizza.tagline}</Text>
        </View>
      </View>
      <View style={styles.deluxRight}>
        <Text style={styles.deluxPrice}>₹{pizza.price}</Text>
        <LinearGradient colors={Colors.gradGold} style={styles.deluxOrderBtn}>
          <Text style={styles.deluxOrderBtnText}>Order →</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.darkBg },
  hero: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
    overflow: "hidden",
  },
  heroBadge: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: Colors.cardBg,
    borderWidth: 1, borderColor: Colors.borderStrong,
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20,
  },
  heroBadgeEmoji: { fontSize: 44 },
  heroTitle: {
    fontSize: 34, fontWeight: "700" as const,
    color: Colors.textPrimary, fontFamily: "Inter_700Bold",
    letterSpacing: -1, marginBottom: 6,
  },
  heroSub: {
    fontSize: 15, color: Colors.textSecondary,
    fontFamily: "Inter_400Regular", marginBottom: 20,
  },
  heroPills: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  pill: {
    backgroundColor: Colors.surface, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  pillText: { fontSize: 12, color: Colors.textSecondary, fontFamily: "Inter_500Medium" },
  sectionLabel: {
    fontSize: 11, fontWeight: "700" as const,
    color: Colors.textMuted, fontFamily: "Inter_700Bold",
    letterSpacing: 1.6, textTransform: "uppercase",
    marginBottom: 12, marginHorizontal: 16,
  },
  cardRow: { flexDirection: "row", paddingHorizontal: 12, gap: 10, marginBottom: 6 },
  regularCard: {
    flex: 1, backgroundColor: Colors.cardBg,
    borderRadius: 18, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  regularEmojiWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  regularEmoji: { fontSize: 28 },
  regularName: {
    fontSize: 15, fontWeight: "700" as const,
    color: Colors.textPrimary, fontFamily: "Inter_700Bold",
    marginBottom: 4, letterSpacing: -0.3,
  },
  regularTagline: {
    fontSize: 11, color: Colors.textMuted,
    fontFamily: "Inter_400Regular", lineHeight: 15, marginBottom: 14,
  },
  regularBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  regularPrice: {
    fontSize: 20, fontWeight: "700" as const,
    color: Colors.primary, fontFamily: "Inter_700Bold",
  },
  orderBtn: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  orderBtnText: { fontSize: 12, fontWeight: "700" as const, color: "#fff", fontFamily: "Inter_700Bold" },
  premiumDivider: {
    height: 40, alignItems: "center", justifyContent: "center",
    marginVertical: 8, overflow: "hidden",
  },
  premiumDividerInner: {
    backgroundColor: Colors.darkBg, paddingHorizontal: 16, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.gold + "50",
  },
  premiumDividerText: {
    fontSize: 12, fontWeight: "600" as const,
    color: Colors.gold, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5,
  },
  deluxCard: {
    marginHorizontal: 12, marginBottom: 10, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: Colors.gold + "30",
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", overflow: "hidden",
  },
  deluxGlow: { position: "absolute", top: 0, left: 0, right: 0, height: 60 },
  deluxLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  deluxEmojiWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: "#2A2000", alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: Colors.gold + "30",
  },
  deluxEmoji: { fontSize: 26 },
  deluxNameRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  deluxName: {
    fontSize: 15, fontWeight: "700" as const,
    color: Colors.textPrimary, fontFamily: "Inter_700Bold", letterSpacing: -0.2,
  },
  deluxBadge: {
    backgroundColor: Colors.gold, borderRadius: 5,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  deluxBadgeText: {
    fontSize: 8, fontWeight: "700" as const,
    color: "#000", fontFamily: "Inter_700Bold", letterSpacing: 1,
  },
  deluxTagline: { fontSize: 11, color: Colors.textMuted, fontFamily: "Inter_400Regular" },
  deluxRight: { alignItems: "flex-end", gap: 8 },
  deluxPrice: {
    fontSize: 22, fontWeight: "700" as const,
    color: Colors.accent, fontFamily: "Inter_700Bold",
  },
  deluxOrderBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  deluxOrderBtnText: {
    fontSize: 12, fontWeight: "700" as const,
    color: "#000", fontFamily: "Inter_700Bold",
  },
});