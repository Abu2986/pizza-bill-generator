import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Platform, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

type PizzaType = "veg" | "nonveg" | "deluxveg" | "deluxnonveg";

const PIZZA_CONFIG: Record<PizzaType, {
  name: string; basePrice: number; emoji: string; isDelux: boolean; tagline: string;
}> = {
  veg:        { name: "Veg Pizza",           basePrice: 300, emoji: "🥦", isDelux: false, tagline: "Garden fresh classics" },
  nonveg:     { name: "Non-Veg Pizza",        basePrice: 400, emoji: "🍗", isDelux: false, tagline: "Loaded with proteins" },
  deluxveg:   { name: "Delux Veg Pizza",      basePrice: 550, emoji: "🌿", isDelux: true,  tagline: "Premium veg with all extras included" },
  deluxnonveg:{ name: "Delux Non-Veg Pizza",  basePrice: 650, emoji: "🥩", isDelux: true,  tagline: "Premium meats with all extras included" },
};

const EXTRA_CHEESE_PRICE   = 100;
const EXTRA_TOPPINGS_PRICE = 150;
const TAKEAWAY_PRICE       = 20;

export default function OrderScreen() {
  const { type } = useLocalSearchParams<{ type: PizzaType }>();
  const insets   = useSafeAreaInsets();
  const config   = PIZZA_CONFIG[type ?? "veg"];

  const [extraCheese,   setExtraCheese]   = useState(false);
  const [extraToppings, setExtraToppings] = useState(false);
  const [takeaway,      setTakeaway]      = useState(false);

  const cheesePrice   = !config.isDelux && extraCheese   ? EXTRA_CHEESE_PRICE   : 0;
  const toppingsPrice = !config.isDelux && extraToppings ? EXTRA_TOPPINGS_PRICE : 0;
  const totalPrice    = config.basePrice + cheesePrice + toppingsPrice + (takeaway ? TAKEAWAY_PRICE : 0);

  function toggle(setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(!current);
  }

  function goToBill() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push({
      pathname: "/bill",
      params: {
        type,
        extraCheese:   (config.isDelux || extraCheese)   ? "1" : "0",
        extraToppings: (config.isDelux || extraToppings) ? "1" : "0",
        takeaway:      takeaway ? "1" : "0",
      },
    });
  }

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom + 12;

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topPad, paddingBottom: 110 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customize Order</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Pizza hero card */}
        <View style={[styles.heroCard, config.isDelux && styles.heroCardDelux]}>
          {config.isDelux ? (
            <LinearGradient colors={[Colors.gold + "15", "transparent"]} style={StyleSheet.absoluteFill} borderRadius={22} />
          ) : (
            <LinearGradient colors={[Colors.primary + "10", "transparent"]} style={StyleSheet.absoluteFill} borderRadius={22} />
          )}
          <View style={[styles.heroEmojiWrap, config.isDelux && styles.heroEmojiWrapDelux]}>
            <Text style={styles.heroEmoji}>{config.emoji}</Text>
          </View>
          <View style={styles.heroMeta}>
            <View style={styles.heroNameRow}>
              <Text style={styles.heroName}>{config.name}</Text>
              {config.isDelux && (
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>DELUX</Text>
                </View>
              )}
            </View>
            <Text style={styles.heroTagline}>{config.tagline}</Text>
          </View>
          <Text style={[styles.heroPrice, config.isDelux && styles.heroPriceDelux]}>
            ₹{config.basePrice}
          </Text>
        </View>

        {/* Delux: show "all included" notice instead of toggles */}
        {config.isDelux && (
          <View style={styles.includedNotice}>
            <LinearGradient colors={["#0D2010", "#071508"]} style={StyleSheet.absoluteFill} borderRadius={14} />
            <Text style={styles.includedIcon}>✓</Text>
            <View>
              <Text style={styles.includedTitle}>All extras included</Text>
              <Text style={styles.includedSub}>Extra Cheese & Extra Toppings are part of this pizza</Text>
            </View>
          </View>
        )}

        {/* Classic: show add-on toggles */}
        {!config.isDelux && (
          <>
            <Text style={styles.sectionLabel}>Add-ons</Text>
            <ToggleRow emoji="🧀" title="Extra Cheese"   sub="Rich extra mozzarella layer"         price={EXTRA_CHEESE_PRICE}   enabled={extraCheese}   onToggle={() => toggle(setExtraCheese, extraCheese)} />
            <ToggleRow emoji="🌶️" title="Extra Toppings" sub="More veggies and premium toppings"   price={EXTRA_TOPPINGS_PRICE} enabled={extraToppings} onToggle={() => toggle(setExtraToppings, extraToppings)} />
          </>
        )}

        <Text style={[styles.sectionLabel, !config.isDelux && { marginTop: 20 }]}>Packaging</Text>
        <ToggleRow emoji="🎒" title="Take Away" sub="Insulated carry-out packaging" price={TAKEAWAY_PRICE} enabled={takeaway} onToggle={() => toggle(setTakeaway, takeaway)} />

        {/* Order summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Base price</Text>
            <Text style={styles.summaryValue}>₹{config.basePrice}</Text>
          </View>
          {!config.isDelux && extraCheese && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Extra Cheese</Text>
              <Text style={styles.summaryValue}>+₹{EXTRA_CHEESE_PRICE}</Text>
            </View>
          )}
          {!config.isDelux && extraToppings && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Extra Toppings</Text>
              <Text style={styles.summaryValue}>+₹{EXTRA_TOPPINGS_PRICE}</Text>
            </View>
          )}
          {takeaway && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Take Away</Text>
              <Text style={styles.summaryValue}>+₹{TAKEAWAY_PRICE}</Text>
            </View>
          )}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>Total</Text>
            <Text style={[styles.summaryTotalPrice, config.isDelux && styles.summaryTotalPriceDelux]}>
              ₹{totalPrice}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Generate Bill CTA */}
      <View style={[styles.ctaWrap, { paddingBottom: botPad }]}>
        <TouchableOpacity onPress={goToBill} activeOpacity={0.88} style={styles.ctaTouchable}>
          <LinearGradient
            colors={config.isDelux ? Colors.gradGold : Colors.gradRed}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.ctaText, config.isDelux && styles.ctaTextDark]}>
              Generate Bill  →
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ToggleRow({ emoji, title, sub, price, enabled, onToggle }: {
  emoji: string; title: string; sub: string;
  price: number; enabled: boolean; onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.toggleRow, enabled && styles.toggleRowOn]}
      onPress={onToggle} activeOpacity={0.8}
    >
      {enabled && (
        <LinearGradient colors={[Colors.primary + "15", "transparent"]} style={StyleSheet.absoluteFill} borderRadius={16} />
      )}
      <View style={[styles.toggleEmojiWrap, enabled && styles.toggleEmojiWrapOn]}>
        <Text style={styles.toggleEmoji}>{emoji}</Text>
      </View>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleSub}>{sub}</Text>
      </View>
      <View style={styles.toggleRight}>
        <Text style={[styles.togglePrice, enabled && styles.togglePriceOn]}>+₹{price}</Text>
        <View style={[styles.track, enabled && styles.trackOn]}>
          <View style={[styles.thumb, enabled && styles.thumbOn]} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.darkBg },
  scroll: { paddingHorizontal: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14 },
  backBtn: {
    width: 40, height: 40, borderRadius: 13,
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border,
    alignItems: "center", justifyContent: "center",
  },
  backIcon: { fontSize: 18, color: Colors.textPrimary },
  headerTitle: { fontSize: 16, fontWeight: "600" as const, color: Colors.textPrimary, fontFamily: "Inter_600SemiBold", letterSpacing: -0.2 },
  heroCard: {
    flexDirection: "row", alignItems: "center", borderRadius: 22, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.cardBg, gap: 12, overflow: "hidden",
  },
  heroCardDelux: { borderColor: Colors.gold + "40", backgroundColor: "#120E00" },
  heroEmojiWrap: { width: 60, height: 60, borderRadius: 16, backgroundColor: Colors.surface, alignItems: "center", justifyContent: "center" },
  heroEmojiWrapDelux: { backgroundColor: "#2A2000" },
  heroEmoji: { fontSize: 32 },
  heroMeta: { flex: 1 },
  heroNameRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 4 },
  heroName: { fontSize: 16, fontWeight: "700" as const, color: Colors.textPrimary, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  heroBadge: { backgroundColor: Colors.gold, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  heroBadgeText: { fontSize: 8, fontWeight: "700" as const, color: "#000", fontFamily: "Inter_700Bold", letterSpacing: 1 },
  heroTagline: { fontSize: 12, color: Colors.textMuted, fontFamily: "Inter_400Regular" },
  heroPrice: { fontSize: 24, fontWeight: "700" as const, color: Colors.primary, fontFamily: "Inter_700Bold" },
  heroPriceDelux: { color: Colors.accent },
  includedNotice: {
    flexDirection: "row", alignItems: "center", borderRadius: 14, padding: 14,
    marginBottom: 22, borderWidth: 1, borderColor: "#1A4020", gap: 12, overflow: "hidden",
  },
  includedIcon: { fontSize: 20, color: Colors.success },
  includedTitle: { fontSize: 14, fontWeight: "600" as const, color: Colors.success, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  includedSub: { fontSize: 12, color: Colors.success + "99", fontFamily: "Inter_400Regular" },
  sectionLabel: { fontSize: 10, fontWeight: "700" as const, color: Colors.textMuted, fontFamily: "Inter_700Bold", letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 10 },
  toggleRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: Colors.cardBg,
    borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: Colors.border, gap: 12, overflow: "hidden",
  },
  toggleRowOn: { borderColor: Colors.primary + "60" },
  toggleEmojiWrap: { width: 46, height: 46, borderRadius: 13, backgroundColor: Colors.surface, alignItems: "center", justifyContent: "center" },
  toggleEmojiWrapOn: { backgroundColor: "#250C0A" },
  toggleEmoji: { fontSize: 22 },
  toggleInfo: { flex: 1 },
  toggleTitle: { fontSize: 14, fontWeight: "600" as const, color: Colors.textPrimary, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  toggleSub: { fontSize: 11, color: Colors.textMuted, fontFamily: "Inter_400Regular" },
  toggleRight: { alignItems: "flex-end", gap: 7 },
  togglePrice: { fontSize: 13, fontWeight: "600" as const, color: Colors.textMuted, fontFamily: "Inter_600SemiBold" },
  togglePriceOn: { color: Colors.accent },
  track: { width: 44, height: 25, borderRadius: 13, backgroundColor: Colors.surface2, justifyContent: "center", paddingHorizontal: 3 },
  trackOn: { backgroundColor: Colors.primary },
  thumb: { width: 19, height: 19, borderRadius: 10, backgroundColor: Colors.textMuted },
  thumbOn: { backgroundColor: "#fff", alignSelf: "flex-end" },
  summaryCard: { backgroundColor: Colors.cardBg, borderRadius: 16, padding: 16, marginTop: 18, borderWidth: 1, borderColor: Colors.border, gap: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: 13, color: Colors.textSecondary, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 13, fontWeight: "500" as const, color: Colors.textSecondary, fontFamily: "Inter_500Medium" },
  summaryDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 2 },
  summaryTotal: { fontSize: 15, fontWeight: "700" as const, color: Colors.textPrimary, fontFamily: "Inter_700Bold" },
  summaryTotalPrice: { fontSize: 26, fontWeight: "700" as const, color: Colors.primary, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  summaryTotalPriceDelux: { color: Colors.accent },
  ctaWrap: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 12, backgroundColor: Colors.darkBg, borderTopWidth: 1, borderTopColor: Colors.border },
  ctaTouchable: { borderRadius: 16, overflow: "hidden" },
  ctaGradient: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  ctaText: { fontSize: 16, fontWeight: "700" as const, color: "#fff", fontFamily: "Inter_700Bold", letterSpacing: 0.2 },
  ctaTextDark: { color: "#000" },
});