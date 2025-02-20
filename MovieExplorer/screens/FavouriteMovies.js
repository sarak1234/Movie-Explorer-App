import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { Card } from "react-native-paper";

const FavouriteMovies = ({ route, navigation }) => {
  // Getting the favorites list passed from Home.js
  const { favorites } = route.params;

  // Render each movie item
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
      <View style={styles.movieContainer}>
        <Card style={styles.card}>
          <Image
            source={{
              uri: item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : "https://via.placeholder.com/200",
            }}
            style={styles.image}
          />
          <Card.Content>
            <Text style={styles.movieTitle}>{item.title || item.name}</Text>
            <Text>Type: {item.media_type === 'movie' ? 'Movie' : 'Series'}</Text>
            <Text>Year: {item.release_date ? item.release_date.split("-")[0] : "N/A"}</Text>
          </Card.Content>
        </Card>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Movies & Series</Text>
      {favorites.length === 0 ? (
        <Text style={styles.noFavoritesText}>You have no favorite movies yet!</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={3} // Keep 3 movies per row
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  noFavoritesText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 80,
    alignItems: "center",
  },
  movieContainer: {
    width: 180, // Keep the same width
    margin: 10, // Keep the same margin
  },
  card: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 250, // Adjusted height for better proportions
    resizeMode: "cover",
    borderTopLeftRadius: 16, // Rounded corners for the top of the image
    borderTopRightRadius: 16,
  },
  movieTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
  },
});

export default FavouriteMovies;