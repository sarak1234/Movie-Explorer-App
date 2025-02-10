import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const MovieDetails = ({ route }) => {
  const { movie } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image
        source={{
          uri: movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200",
        }}
        style={styles.poster}
      />
      <View style={styles.detailsContainer}>
        <Text style={[styles.title, styles.centerText]}>{movie.Title}</Text>
        <Text style={[styles.detail, styles.centerText]}>
          <Text style={styles.bold}>Year:</Text> {movie.Year}
        </Text>
        <Text style={[styles.detail, styles.centerText]}>
          <Text style={styles.bold}>Type:</Text> {movie.Type}
        </Text>
        <Text style={[styles.detail, styles.centerText]}>
          <Text style={styles.bold}>IMDb ID:</Text> {movie.imdbID}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingBottom: 20,
  },
  poster: {
    width: "80%",
    height: 300,
    resizeMode: "contain",
    borderRadius: 10,
    marginVertical: 20,
    alignSelf: "center",
  },
  detailsContainer: {
    backgroundColor: "#F1F1F1",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  detail: {
    fontSize: 18,
    color: "#555",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  centerText: {
    textAlign: "center",
  },
});

export default MovieDetails;
