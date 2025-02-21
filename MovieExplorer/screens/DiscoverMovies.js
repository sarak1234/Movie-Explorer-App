import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Card } from "react-native-paper";

const DiscoverMovies = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiscoverMovies = async () => {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/discover/movie?api_key=4705d52785ca9b43e39295d4291dd000&sort_by=vote_average.desc&vote_count.gte=1000&include_adult=false"
      );
      const data = await response.json();
      if (data.results) {
        setMovies(data.results);
      } else {
        throw new Error("No movies found.");
      }
    } catch (error) {
      console.error("Error fetching discover movies:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscoverMovies();
  }, []);

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
          <Text>Rating: {item.vote_average}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

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
    <View style={styles.container}>
      <Text style={styles.title}>Discover  Movies</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
      />
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
});

export default DiscoverMovies;