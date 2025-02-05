import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, StyleSheet } from "react-native";
import Home from "./screens/Home";

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
          <Drawer.Screen name="Home" component={Home} />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the full-screen height is used
  },
});

export default App;
