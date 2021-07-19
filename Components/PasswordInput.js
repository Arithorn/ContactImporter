import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";

const PasswordInput = (props) => {
  const [password, setPassword] = useState("");
  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={(password) => props.onChange(password)}
        defaultValue={password}
        placeholder="Please Enter Your Password."
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});

export default PasswordInput;
