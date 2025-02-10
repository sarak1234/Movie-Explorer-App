import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const Handle = async () => {
    try {
      const response = await fetch("https://reqres.in/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        navigation.navigate("Home", {
          username: username,
        });
      } else {
        console.log("Response Status:", response.status);
        console.log("Response Data:", data);
        Alert.alert("Login Failed", data.message || "Invalid username or password.");
      }
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Movie Explorer App</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={Handle} color="#6200ee" /> {/* Default button color */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef1ec", // Light background color
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // Dark text color
  },
  formContainer: {
    width: "100%",
    maxWidth: 400, // Limit form width for better readability
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff", // White background for inputs
    fontSize: 16,
  },
  buttonContainer: {
    borderRadius: 8,
    overflow: "hidden", // Ensures the button respects the border radius
  },
});

export default Login;