import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Card } from "react-native-paper";

// Helper function to shuffle the movies
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // Fetch 2 movies from each genre
      const comedyResponse = await fetch(
        `http://www.omdbapi.com/?s=comedy&type=movie&apikey=617e1d0c`
      );
      const actionResponse = await fetch(
        `http://www.omdbapi.com/?s=action&type=movie&apikey=617e1d0c`
      );
      const sciFiResponse = await fetch(
        `http://www.omdbapi.com/?s=sci-fi&type=movie&apikey=617e1d0c`
      );
      const dramaResponse = await fetch(
        `http://www.omdbapi.com/?s=drama&type=movie&apikey=617e1d0c`
      );
      const horrorResponse = await fetch(
        `http://www.omdbapi.com/?s=horror&type=movie&apikey=617e1d0c`
      );

      // Parse responses
      const comedyData = await comedyResponse.json();
      const actionData = await actionResponse.json();
      const sciFiData = await sciFiResponse.json();
      const dramaData = await dramaResponse.json();
      const horrorData = await horrorResponse.json();

      let allMovies = [];

      // Add 2 movies from each genre to the allMovies array
      if (comedyData.Search) allMovies = [...allMovies, ...comedyData.Search.slice(0, 2)];
      if (actionData.Search) allMovies = [...allMovies, ...actionData.Search.slice(0, 2)];
      if (sciFiData.Search) allMovies = [...allMovies, ...sciFiData.Search.slice(0, 2)];
      if (dramaData.Search) allMovies = [...allMovies, ...dramaData.Search.slice(0, 2)];
      if (horrorData.Search) allMovies = [...allMovies, ...horrorData.Search.slice(0, 2)];

      // Shuffle the movies array to mix them up
      shuffleArray(allMovies);

      setMovies(allMovies); // Set mixed list of movies
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Trending Movies</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <View style={styles.movieGrid}>
            {movies.map((movie) => (
              <View key={movie.imdbID} style={styles.movieContainer}>
                <Card style={styles.card}>
                  <Image
                    source={{ uri: movie.Poster }}
                    style={styles.image}
                  />
                  <Card.Content>
                    <Text style={styles.movieTitle}>{movie.Title}</Text>
                    <Text>Year: {movie.Year}</Text>
                    <Text>Genres: {movie.Genre || 'N/A'}</Text>
                  </Card.Content>
                </Card>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    minHeight: Dimensions.get('window').height, // Set minimum height to screen height
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  movieGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  movieContainer: {
    width: "30%", // Each movie takes up 30% of the container width (3 per row)
    marginBottom: 16, // Add margin to separate movie cards
  },
  card: {
    overflow: "hidden",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    padding: 10,
    backgroundColor: "white",
  },
  image: {
    width: "100%", // Make the image take up the full width of the card
    height: 200,
    resizeMode: "contain", // Fit the image within the container without cropping
  },
  movieTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  scrollContainer: {
    flexGrow: 1, // Ensures the content takes up enough space for scrolling
  },
});

export default Home;
