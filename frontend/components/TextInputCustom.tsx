import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "@/constants/Colors";

type Props = React.ComponentProps<typeof TextInput> & {
  label: string;
  errorText?: string | null;
};

const TextField: React.FC<Props> = (props) => {
  const { label, errorText, value, style, onBlur, onFocus, ...restOfProps } =
    props;
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const isActive = isFocused || !!value;

    Animated.timing(focusAnim, {
      toValue: isActive ? 1 : 0,
      duration: 150,
      easing: Easing.bezier(0.1, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [isFocused, value]);

  let borderColor = isFocused ? Colors.main : Colors.border;
  let textColor = Colors.inputInactiveText;
  if (errorText) {
    borderColor = "red";
    textColor = "red";
  } else if (isFocused) {
    textColor = "black";
  }

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: borderColor,
            color: textColor,
          },
          style,
        ]}
        ref={inputRef}
        {...restOfProps}
        value={value}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
      />
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <Animated.View
          style={[
            styles.labelContainer,
            {
              transform: [
                {
                  scale: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.75],
                  }),
                },
                {
                  translateY: focusAnim.interpolate({
                    inputRange: [0, 2],
                    outputRange: [15, -12],
                  }),
                },
                {
                  translateX: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, -38],
                  }),
                },
              ],
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              {
                borderColor: borderColor,
                color: textColor,
              },
            ]}
          >
            {label}
            {errorText ? "*" : ""}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
      {!!errorText && <Text style={styles.error}>{errorText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    paddingLeft: 20,
    borderRadius: 4,
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    height: 50,
    paddingBottom: 5,
    backgroundColor: Colors.primary,
    textAlignVertical: "bottom",
  },
  labelContainer: {
    position: "absolute",
    minWidth: 150,
    paddingLeft: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    minWidth: 160,
    flexShrink: 1,
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
    color: "red",
    fontFamily: "Montserrat-Regular",
  },
});

export default TextField;
