import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, StyleSheet } from "react-native";
import Home from "./screens/Home";
import Login from "./screens/Login";
import MovieDetails from "./screens/MovieDetails";
import FavouriteMovies from "./screens/FavouriteMovies";
import UpcomingReleases from "./screens/UpcomingReleases";
import DiscoverMovies from "./screens/DiscoverMovies";

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Login"
          screenOptions={({ route }) => ({
            drawerType: route.name === "Login" ? "front" : "slide", 
            drawerStyle: route.name === "Login" ? { display: "none" } : {},
            drawerLabel: route.name === "MovieDetails" || route.name === "FavouriteMovies" ? () => null : undefined, // Hide in the drawer
          })}
        >
          <Drawer.Screen name="Login" component={Login} />
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Discover Movies" component={DiscoverMovies} />
          <Drawer.Screen name="Upcoming Releases" component={UpcomingReleases} />
          
          {/* MovieDetails and FavouriteMovies are part of the navigator but hidden in the drawer */}
          <Drawer.Screen name="MovieDetails" component={MovieDetails} />
          <Drawer.Screen name="FavouriteMovies" component={FavouriteMovies} />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
