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
    backgroundColor: "#121212",
    alignItems: "center",
    paddingBottom: 20,
  },
  poster: {
    width: "80%", // 80% of the screen width
    height: 300, // Reduced height to avoid zoom-in
    resizeMode: "contain", // Prevents image stretching or cropping
    borderRadius: 10,
    marginVertical: 20,
    alignSelf: "center", // Centers the image
  },
  detailsContainer: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  detail: {
    fontSize: 18,
    color: "#ccc",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
    color: "#fff",
  },
  centerText: {
    textAlign: "center", // Centers the text horizontally
  },
});

export default MovieDetails;
