import { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

/* =========================
   Types
========================= */

type Props = {
  value: number | null;
  onChange(value: number): void;
} & Omit<TextInputProps, "value" | "onChangeText" | "onChange">;

/* =========================
   Helpers
========================= */

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

function formatTrIntFromDigits(digits: string) {
  if (!digits) return "";
  const n = Number(digits);
  if (Number.isNaN(n)) return "";
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(n);
}

function countDigitsBeforeCaret(formatted: string, caret: number) {
  let count = 0;
  for (let i = 0; i < Math.min(caret, formatted.length); i++) {
    if (/\d/.test(formatted[i])) count++;
  }
  return count;
}

function caretIndexForDigitCount(formatted: string, digitCount: number) {
  if (digitCount <= 0) return 0;
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      count++;
      if (count === digitCount) return i + 1;
    }
  }
  return formatted.length;
}

/* =========================
   Component
========================= */

export default function CurrencyInput({
  value,
  onChange,
  style,
  ...props
}: Props) {
  const [text, setText] = useState("");
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const lastTextRef = useRef(text);

  useEffect(() => {
    lastTextRef.current = text;
  }, [text]);

  // dışarıdan value değişirse sync
  useEffect(() => {
    const digits = value != null ? String(Math.max(0, Math.floor(value))) : "";
    const formatted = formatTrIntFromDigits(digits);
    setText(formatted);
    setSelection({ start: formatted.length, end: formatted.length });
  }, [value]);

  function handleChange(rawInput: string) {
    const prevText = lastTextRef.current;
    const prevCaret = selection.start;

    const prevDigits = digitsOnly(prevText);
    const nextDigitsRaw = digitsOnly(rawInput).replace(/^0+(?=\d)/, "");

    // kaç digit eklenmiş / silinmiş?
    const diff = nextDigitsRaw.length - prevDigits.length;

    // caret’ten önceki digit sayısı
    let digitsBefore = countDigitsBeforeCaret(prevText, prevCaret);

    // kullanıcı digit sildiyse caret’i geri al
    if (diff < 0) {
      digitsBefore += diff; // diff negatif
    }

    digitsBefore = Math.max(0, digitsBefore);

    const formatted = formatTrIntFromDigits(nextDigitsRaw);
    setText(formatted);

    const num = Number(nextDigitsRaw || "0");
    onChange(Number.isNaN(num) ? 0 : num);

    const nextCaret = caretIndexForDigitCount(formatted, digitsBefore);
    setSelection({ start: nextCaret, end: nextCaret });
  }
  return (
    <TextInput
      {...props}
      keyboardType="numeric"
      value={text}
      onChangeText={handleChange}
      selection={selection}
      onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
      style={[styles.input, style]}
      placeholderTextColor="rgba(255,255,255,0.45)"
    />
  );
}

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
  },
});
