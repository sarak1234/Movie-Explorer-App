import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

const MovieDetails = ({ route }) => {
  const { movie } = route.params; // Get the movie data from navigation params
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image
        source={{
          uri: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/200",
        }}
        style={styles.poster}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{movie.title || movie.name}</Text>
        <Text style={styles.detail}><Text style={styles.bold}>Release Date:</Text> {movie.release_date || movie.first_air_date}</Text>
        <Text style={styles.detail}><Text style={styles.bold}>Rating:</Text> {movie.vote_average}</Text>
        <Text style={styles.detail}><Text style={styles.bold}>Overview:</Text> {movie.overview}</Text>
        <Text style={styles.detail}><Text style={styles.bold}>Type:</Text> {movie.media_type === 'movie' ? 'Movie' : 'Series'}</Text>
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
    alignSelf: "center", // Center the card horizontally
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "Helvetica",
  },
  detail: {
    fontSize: 18,
    color: "#555",
    marginBottom: 8,
    textAlign: "center", // Centered text
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
});

export default MovieDetails;