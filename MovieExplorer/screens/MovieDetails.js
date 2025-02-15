import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

const HomeScreen = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Default page number

  useEffect(() => {
    fetchTrendingMovies(page);
  }, [page]);

  const fetchTrendingMovies = async (page) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/all/week?api_key=4705d52785ca9b43e39295d4291dd000&page=${page}`
      );

      console.log("TMDb API Response Status:", response.status); // Log the status code
      const responseText = await response.text(); // Get the raw response text
      console.log("TMDb API Raw Response:", responseText); // Log the raw response

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data;
      try {
        data = JSON.parse(responseText); // Manually parse the JSON
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error("Invalid data received from the server.");
      }

      console.log("TMDb API Parsed Data:", data); // Log the parsed data

      // Check if the API returned results
      if (!data.results || data.results.length === 0) {
        throw new Error("No trending movies found.");
      }

      // Update the state with the fetched movies
      setTrendingMovies(data.results);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      setError(error.message); // Set error state for user feedback
    } finally {
      setLoading(false); // Stop loading
    }
  };

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
      <Text style={styles.title}>Trending Movies</Text>
      {trendingMovies.map((movie) => (
        <View key={movie.id} style={styles.movieContainer}>
          <Image
            source={{
              uri: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/200",
            }}
            style={styles.poster}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.movieTitle}>{movie.title || movie.name}</Text>
            <Text style={styles.movieOverview}>{movie.overview}</Text>
            <Text style={styles.movieReleaseDate}>
              Release Date: {movie.release_date || movie.first_air_date}
            </Text>
            <Text style={styles.movieRating}>Rating: {movie.vote_average}</Text>
          </View>
        </View>
      ))}
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
  ratingsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  streamingContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  link: {
    color: "#1E90FF",
    textDecorationLine: "underline",
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

export default HomeScreen;