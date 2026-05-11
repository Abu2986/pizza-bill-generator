import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  Platform, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

type PizzaType = "veg" | "nonveg" | "deluxveg" | "deluxnonveg";

const PIZZA_CONFIG: Record<PizzaType, { name: string; basePrice: number; emoji: string; isDelux: boolean }> = {
  veg:         { name: "Veg Pizza",           basePrice: 300, emoji: "🥦", isDelux: false },
  nonveg:      { name: "Non-Veg Pizza",        basePrice: 400, emoji: "🍗", isDelux: false },
  deluxveg:    { name: "Delux Veg Pizza",      basePrice: 550, emoji: "🌿", isDelux: true  },
  deluxnonveg: { name: "Delux Non-Veg Pizza",  basePrice: 650, emoji: "🥩", isDelux: true  },
};

const EXTRA_CHEESE_PRICE   = 100;
const EXTRA_TOPPINGS_PRICE = 150;
const TAKEAWAY_PRICE       = 20;

export default function BillScreen() {
  const params = useLocalSearchParams<{
    type: PizzaType; extraCheese: string; extraToppings: string; takeaway: string;
  }>();
  const insets = useSafeAreaInsets();
  const type   = (params.type ?? "veg") as PizzaType;
  const config = PIZZA_CONFIG[type];

  const hasExtraCheese   = params.extraCheese   === "1";
  const hasExtraToppings = params.extraToppings === "1";
  const hasTakeaway      = params.takeaway      === "1";

  const total =
    config.basePrice +
    (!config.isDelux && hasExtraCheese   ? EXTRA_CHEESE_PRICE   : 0) +
    (!config.isDelux && hasExtraToppings ? EXTRA_TOPPINGS_PRICE : 0) +
    (hasTakeaway ? TAKEAWAY_PRICE : 0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const lineItems = [
    { label: config.name, amount: `₹${config.basePrice}`, isBase: true, included: false },
    ...(config.isDelux
      ? [
          { label: "Extra Cheese",   amount: "Included", isBase: false, included: true },
          { label: "Extra Toppings", amount: "Included", isBase: false, included: true },
        ]
      : [
          ...(hasExtraCheese   ? [{ label: "Extra Cheese",   amount: `+₹${EXTRA_CHEESE_PRICE}`,   isBase: false, included: false }] : []),
          ...(hasExtraToppings ? [{ label: "Extra Toppings", amount: `+₹${EXTRA_TOPPINGS_PRICE}`, isBase: false, included: false }] : []),
        ]),
    ...(hasTakeaway ? [{ label: "Take Away Pack", amount: `+₹${TAKEAWAY_PRICE}`, isBase: false, included: false }] : []),
  ];

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  return (
    <View style={[styles.root, { paddingTop: topPad, paddingBottom: botPad }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Receipt</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Receipt card */}
        <View style={[styles.receipt, config.isDelux && styles.receiptDelux]}>
          {config.isDelux && (
            <LinearGradient colors={["#1C1600", "#0A0800"]} style={StyleSheet.absoluteFill} borderRadius={24} />
          )}

          {/* Brand header */}
          <LinearGradient
            colors={config.isDelux ? [Colors.gold + "20", "transparent"] : [Colors.primary + "15", "transparent"]}
            style={styles.receiptHeaderGrad}
          >
            <View style={styles.receiptBrandRow}>
              <Text style={styles.receiptBrandEmoji}>🍕</Text>
              <View>
                <Text style={styles.receiptBrandName}>Pizza Mania</Text>
                <Text style={styles.receiptBrandSlogan}>Made fresh, served hot</Text>
              </View>
              <View style={[styles.receiptStatusBadge, config.isDelux && styles.receiptStatusBadgeDelux]}>
                <Text style={[styles.receiptStatusText, config.isDelux && styles.receiptStatusTextDelux]}>
                  CONFIRMED
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.receiptDivider} />

          {/* Ordered pizza */}
          <View style={styles.orderedRow}>
            <View style={[styles.orderedEmojiWrap, config.isDelux && styles.orderedEmojiWrapDelux]}>
              <Text style={styles.orderedEmoji}>{config.emoji}</Text>
            </View>
            <View style={styles.orderedInfo}>
              <Text style={styles.orderedName}>{config.name}</Text>
              {config.isDelux && (
                <View style={styles.orderedDeluxBadge}>
                  <Text style={styles.orderedDeluxBadgeText}>⭐ DELUX</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.receiptDivider} />

          {/* Line items */}
          <View style={styles.lineItems}>
            {lineItems.map((item, i) => (
              <View key={i} style={styles.lineRow}>
                <Text style={[styles.lineLabel, item.isBase && styles.lineLabelBold]}>
                  {item.label}
                </Text>
                {item.included ? (
                  <View style={styles.includedPill}>
                    <Text style={styles.includedPillText}>✓ Included</Text>
                  </View>
                ) : (
                  <Text style={[styles.lineAmount, item.isBase && styles.lineAmountBold]}>
                    {item.amount}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Total */}
          <View style={[styles.totalSection, config.isDelux && styles.totalSectionDelux]}>
            <View>
              <Text style={styles.totalCaption}>TOTAL AMOUNT</Text>
              <Text style={[styles.totalAmount, config.isDelux && styles.totalAmountDelux]}>
                ₹{total}
              </Text>
            </View>
            <LinearGradient colors={config.isDelux ? Colors.gradGold : Colors.gradRed} style={styles.paidBadge}>
              <Text style={[styles.paidText, config.isDelux && styles.paidTextDark]}>PAID ✓</Text>
            </LinearGradient>
          </View>

          {/* Thank you */}
          <View style={styles.thankYouSection}>
            <View style={styles.thankYouDivider} />
            <Text style={styles.thankYouEmoji}>🙏</Text>
            <Text style={styles.thankYouTitle}>Thank You!</Text>
            <Text style={styles.thankYouSub}>We hope to serve you again</Text>
          </View>
        </View>

        {/* Order Again */}
        <TouchableOpacity
          style={styles.newOrderBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.replace("/");
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.newOrderText}>Order Again</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.darkBg },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  backIcon: { fontSize: 18, color: Colors.textPrimary },
  headerTitle: { fontSize: 16, fontWeight: "600" as const, color: Colors.textPrimary, fontFamily: "Inter_600SemiBold" },
  receipt: { borderRadius: 24, borderWidth: 1, borderColor: Colors.borderStrong, backgroundColor: Colors.cardBg, marginBottom: 14, overflow: "hidden" },
  receiptDelux: { borderColor: Colors.gold + "40" },
  receiptHeaderGrad: { padding: 16, paddingBottom: 0 },
  receiptBrandRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingBottom: 16 },
  receiptBrandEmoji: { fontSize: 32 },
  receiptBrandName: { fontSize: 18, fontWeight: "700" as const, color: Colors.textPrimary, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  receiptBrandSlogan: { fontSize: 11, color: Colors.textMuted, fontFamily: "Inter_400Regular", marginTop: 1 },
  receiptStatusBadge: { marginLeft: "auto", backgroundColor: Colors.primary + "25", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.primary + "40" },
  receiptStatusBadgeDelux: { backgroundColor: Colors.gold + "20", borderColor: Colors.gold + "40" },
  receiptStatusText: { fontSize: 10, fontWeight: "700" as const, color: Colors.primary, fontFamily: "Inter_700Bold", letterSpacing: 0.8 },
  receiptStatusTextDelux: { color: Colors.gold },
  receiptDivider: { borderStyle: "dashed", borderTopWidth: 1, borderColor: Colors.border, marginHorizontal: 16, marginVertical: 12 },
  orderedRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 4 },
  orderedEmojiWrap: { width: 52, height: 52, borderRadius: 14, backgroundColor: Colors.surface, alignItems: "center", justifyContent: "center" },
  orderedEmojiWrapDelux: { backgroundColor: "#2A2000" },
  orderedEmoji: { fontSize: 28 },
  orderedInfo: { flex: 1 },
  orderedName: { fontSize: 16, fontWeight: "700" as const, color: Colors.textPrimary, fontFamily: "Inter_700Bold", marginBottom: 5, letterSpacing: -0.2 },
  orderedDeluxBadge: { alignSelf: "flex-start", backgroundColor: Colors.gold + "25", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: Colors.gold + "40" },
  orderedDeluxBadgeText: { fontSize: 10, fontWeight: "700" as const, color: Colors.gold, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  lineItems: { paddingHorizontal: 16, gap: 10 },
  lineRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  lineLabel: { fontSize: 14, color: Colors.textSecondary, fontFamily: "Inter_400Regular" },
  lineLabelBold: { fontWeight: "600" as const, fontFamily: "Inter_600SemiBold", color: Colors.textPrimary },
  lineAmount: { fontSize: 14, color: Colors.textSecondary, fontFamily: "Inter_500Medium" },
  lineAmountBold: { fontWeight: "700" as const, fontFamily: "Inter_700Bold", color: Colors.textPrimary },
  includedPill: { backgroundColor: Colors.success + "20", borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4, borderWidth: 1, borderColor: Colors.success + "40" },
  includedPillText: { fontSize: 11, fontWeight: "600" as const, color: Colors.success, fontFamily: "Inter_600SemiBold" },
  totalSection: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 16, marginTop: 14, padding: 16, backgroundColor: Colors.surface, borderRadius: 16 },
  totalSectionDelux: { backgroundColor: "#1C1600" },
  totalCaption: { fontSize: 10, fontWeight: "700" as const, color: Colors.textMuted, fontFamily: "Inter_700Bold", letterSpacing: 1.5, marginBottom: 4 },
  totalAmount: { fontSize: 38, fontWeight: "700" as const, color: Colors.primary, fontFamily: "Inter_700Bold", letterSpacing: -1.5 },
  totalAmountDelux: { color: Colors.accent },
  paidBadge: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  paidText: { fontSize: 13, fontWeight: "700" as const, color: "#fff", fontFamily: "Inter_700Bold", letterSpacing: 1 },
  paidTextDark: { color: "#000" },
  thankYouSection: { alignItems: "center", paddingBottom: 20, gap: 4 },
  thankYouDivider: { width: "80%", borderStyle: "dashed", borderTopWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  thankYouEmoji: { fontSize: 28, marginBottom: 4 },
  thankYouTitle: { fontSize: 17, fontWeight: "700" as const, color: Colors.textPrimary, fontFamily: "Inter_700Bold" },
  thankYouSub: { fontSize: 13, color: Colors.textMuted, fontFamily: "Inter_400Regular", marginTop: 2 },
  newOrderBtn: { backgroundColor: Colors.surface, borderRadius: 16, paddingVertical: 16, alignItems: "center", borderWidth: 1, borderColor: Colors.border },
  newOrderText: { fontSize: 15, fontWeight: "600" as const, color: Colors.textSecondary, fontFamily: "Inter_600SemiBold" },
});