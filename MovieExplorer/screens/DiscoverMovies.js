import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Picker } from "react-native";
import { Card, Button } from "react-native-paper";

const DiscoverMovies = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const fetchGenres = async () => {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list?api_key=4705d52785ca9b43e39295d4291dd000"
      );
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const fetchDiscoverMovies = async (page = 1) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=4705d52785ca9b43e39295d4291dd000&sort_by=vote_average.desc&vote_count.gte=1000&include_adult=false&page=${page}`
      );
      const data = await response.json();
      if (data.results) {
        setMovies((prevMovies) => (page === 1 ? data.results : [...prevMovies, ...data.results]));
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
    fetchGenres();
    fetchDiscoverMovies(page);
  }, [page]);

  const loadMore = async () => {
    if (loading) return;  // Prevent multiple load requests when still loading
    setLoading(true);  // Set loading to true when fetching more movies
    setPage((prevPage) => prevPage + 1);  // Increment the page number
  };

  const handleGenreChange = (value) => {
    setSelectedGenre(value);
    filterMovies(value, selectedYear);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    filterMovies(selectedGenre, value);
  };

  const filterMovies = (genre, year) => {
    let filtered = movies;

    if (genre) {
      filtered = filtered.filter((movie) => movie.genre_ids.includes(parseInt(genre)));
    }

    if (year) {
      filtered = filtered.filter((movie) => movie.release_date?.split("-")[0] === year);
    }

    setFilteredMovies(filtered);
  };

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

  if (loading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
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

  const years = Array.from(
    new Set(
      movies
        .map((movie) => movie.release_date?.split("-")[0])
        .filter((year) => year)
    )
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Movies</Text>
      <View style={styles.pickerRowContainer}>
        <View style={styles.pickerContainer}>
          <Text>All Genres</Text>
          <Picker
            selectedValue={selectedGenre}
            style={styles.picker}
            onValueChange={handleGenreChange}
          >
            <Picker.Item label="All Genres" value="" />
            {genres.map((genre) => (
              <Picker.Item key={genre.id} label={genre.name} value={genre.id.toString()} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text>All Years</Text>
          <Picker
            selectedValue={selectedYear}
            style={styles.picker}
            onValueChange={handleYearChange}
          >
            <Picker.Item label="All Years" value="" />
            {years.map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>
        </View>
      </View>
      <FlatList
        data={filteredMovies.length > 0 ? filteredMovies : movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.loadMoreButtonContainer}>
        <Button
          onPress={loadMore}
          mode="contained"
          style={[styles.loadMoreButton, { backgroundColor: "#0088cc" }]}
        >
          LOAD MORE
        </Button>
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
  loadMoreButton: {
    width: "20%", 
    borderRadius: 25, 
    height: 50, 
  },
  pickerRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  pickerContainer: {
    width: "45%",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default DiscoverMovies;
