import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function AppButton({
  title,
  onPress,
  onPressIn,
  onPressOut,
  style,
  textStyle,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  activeOpacity = 0.9,
}) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={[
  styles.base,
  style,
  {
    borderColor: colors.buttonOutline,
    borderWidth: 2,
    opacity: disabled ? 0.6 : 1,
  },
]}
    >
      {leftIcon}
      <Text style={[styles.text, textStyle]}>{title}</Text>
      {rightIcon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  text: {
    letterSpacing: 2,
  },
});