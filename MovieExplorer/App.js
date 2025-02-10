import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, StyleSheet } from "react-native";
import Home from "./screens/Home";
import Login from "./screens/Login";
import MovieDetails from "./screens/MovieDetails";

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator
          // initialRouteName="Login"
          // screenOptions={({ route }) => ({
          //   drawerType: route.name === "Login" ? "front" : "slide", // Adjust drawer type based on route
          //   drawerStyle: route.name === "Login" ? { display: "none" } : {}, // Hide drawer on Login screen
          // })}
        >
          {/* <Drawer.Screen name="Login" component={Login} /> */}
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="MovieDetails" component={MovieDetails} />
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