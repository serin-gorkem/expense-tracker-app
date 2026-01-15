import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    padding: 14,
    overflow: "hidden",
  },

  cardTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 12,
  },

  label: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "rgba(255,255,255,0.92)",
    marginBottom: 12,
  },

  kindRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  kindPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  kindPillActive: {
    backgroundColor: "rgba(99,102,241,0.28)",
    borderColor: "rgba(99,102,241,0.5)",
  },

  kindText: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "800",
    fontSize: 12,
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  category: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  categoryActive: {
    backgroundColor: "rgba(91,124,255,0.22)",
    borderColor: "rgba(91,124,255,0.35)",
  },

  categoryText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "800",
  },

  boostCard: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  boostCardActive: {
    borderColor: "#22c55e",
    backgroundColor: "rgba(34,197,94,0.18)",
  },

  boostTitle: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "800",
    fontSize: 13,
  },

  boostSub: {
    marginTop: 4,
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "600",
  },

  boostHint: {
    marginTop: 6,
    color: "#22c55e",
    fontSize: 11,
    fontWeight: "700",
  },

  btn: {
    marginTop: 4,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  btnText: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "900",
  },

  /* ---------- Modal ---------- */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalCard: {
    width: "80%",
    borderRadius: 18,
    padding: 16,
    backgroundColor: "rgba(17,24,39,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  modalTitle: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 6,
  },

  modalText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 12,
  },
  boostTitleHint: {
    marginTop: -6,
    marginBottom: 6,
    fontSize: 11,
    color: "#22c55e",
    fontWeight: "700",
  },
  modalBtn: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  modalBtnText: {
    color: "rgba(255,255,255,0.95)",
    fontWeight: "800",
  },
  inputError: {
    borderColor: "rgba(239,68,68,0.6)",
  },

  categoryRowError: {
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.5)",
  },

  errorText: {
    color: "rgba(239,68,68,0.9)",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
  },
});
