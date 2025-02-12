import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { Card } from "react-native-paper";

const FavouriteMovies = ({ route, navigation }) => {
  const { favorites } = route.params;  // Only receive the favorites list, no setFavorites needed

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("MovieDetails", { movie: item })}>
      <View style={styles.movieContainer}>
        <Card style={styles.card}>
          <Image
            source={{
              uri: item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/200",
            }}
            style={styles.image}
          />
          <Card.Content>
            <Text style={styles.movieTitle}>{item.Title}</Text>
            <Text>Year: {item.Year}</Text>
            <Text>Type: {item.Type}</Text>
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
          keyExtractor={(item) => item.imdbID}
          renderItem={renderItem}
          numColumns={3}
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
    width: 180,
    margin: 10,
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
    width: "110%",
    height: 250,
    resizeMode: "cover",
  },
  movieTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
  },
});

export default FavouriteMovies;
