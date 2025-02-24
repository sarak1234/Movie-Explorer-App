import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button, ActivityIndicator } from "react-native";
import { Card } from "react-native-paper";

const UpcomingReleases = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Add a page state

  const fetchUpcomingMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=4705d52785ca9b43e39295d4291dd000&page=${page}`
      );
      const data = await response.json();
      if (data.results) {
        setMovies((prevMovies) => (page === 1 ? data.results : [...prevMovies, ...data.results]));
      } else {
        throw new Error("No upcoming movies found.");
      }
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingMovies();
  }, [page]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("MovieDetails", { movie: item })}>
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
          <Text style={styles.movieTitle}>{item.title}</Text>
          <Text>Type: {item.media_type === 'movie' ? 'Movie' : 'Series'}</Text>
          <Text>Release Date: {item.release_date}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007acc" />
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
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Releases</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.loadMoreButtonContainer}>
        <Button
          title="Load More"
          onPress={handleLoadMore}
          color="#007acc"
        />
      </View>
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
  listContainer: {
    paddingBottom: 80,
    alignItems: "center",
  },
  card: {
    width: 160,
    height: 300,
    margin: 8,
    borderRadius: 16,
    backgroundColor: "white",
    overflow: "hidden",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  movieTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
  },
  loadMoreButtonContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
});

export default UpcomingReleases;
