import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, FlatList, Button, TouchableOpacity, TextInput } from "react-native";
import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";

const Home = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchTrending();
    fetchGenres();
  }, [page]);

  const fetchTrending = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=4705d52785ca9b43e39295d4291dd000&page=${page}`);
      const data = await response.json();

      const movies = data.results.filter(item => item.media_type === 'movie').slice(0, 6);
      const series = data.results.filter(item => item.media_type === 'tv').slice(0, 6);

      const combinedItems = [...movies, ...series];
      combinedItems.sort(() => Math.random() - 0.5);

      setItems((prevItems) => (page === 1 ? combinedItems : [...prevItems, ...combinedItems]));
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=4705d52785ca9b43e39295d4291dd000`);
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const handleMoviePress = (item) => {
    navigation.navigate("MovieDetails", { movie: item });
  };

  const handleFavoritePress = (item) => {
    const isFavorite = favorites.some((fav) => fav.id === item.id);
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== item.id));
    } else {
      setFavorites([...favorites, item]);
    }
  };

  const handleGoToFavorites = () => {
    navigation.navigate("FavouriteMovies", { favorites });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearchQuery = (item.title || item.name)?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre ? item.genre_ids.includes(parseInt(selectedGenre)) : true;
    const matchesYear = selectedYear ? item.release_date?.split("-")[0] === selectedYear : true;
    return matchesSearchQuery && matchesGenre && matchesYear;
  });

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Trending Movies & Series</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Movies & Series"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedGenre}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedGenre(itemValue)}
        >
          <Picker.Item label="All Genres" value="" />
          {genres.map((genre) => (
            <Picker.Item key={genre.id} label={genre.name} value={genre.id.toString()} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          <Picker.Item label="All Years" value="" />
          {Array.from(new Set(items.map(item => item.release_date?.split("-")[0]))).map((year) => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        filteredItems.length === 0 ? (
          <Text style={styles.noResultsText}>No Results Available</Text>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleMoviePress(item)}>
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
                      <Text>Year: {item.release_date ? item.release_date.split("-")[0] : "N/A"}</Text>
                      <Text>Type: {item.media_type === 'movie' ? 'Movie' : 'Series'}</Text>
                    </Card.Content>
                    <TouchableOpacity onPress={() => handleFavoritePress(item)}>
                      <View style={styles.favoriteIconContainer}>
                        <Icon
                          name={favorites.some((fav) => fav.id === item.id) ? "heart" : "heart-o"}
                          size={24}
                          color={favorites.some((fav) => fav.id === item.id) ? "red" : "gray"}
                        />
                      </View>
                    </TouchableOpacity>
                  </Card>
                </View>
              </TouchableOpacity>
            )}
            numColumns={3}
            contentContainerStyle={styles.listContainer}
          />
        )
      )}
      <View style={styles.buttonContainer}>
        <Button title="Load More" onPress={handleLoadMore} />
        <Button title="Favourite Movies" onPress={handleGoToFavorites} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center", // Center everything horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  searchContainer: {
    width: "100%",
    alignItems: "center", // Center the search bar
    marginBottom: 20,
  },
  searchBar: {
    width: "80%", // Adjust width for better centering
    height: 50,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 10,
    zIndex: 1, // Ensure dropdowns stay above other content
  },
  picker: {
    width: "40%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    fontSize: 14,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  listContainer: {
    alignItems: "center", // Center the movie cards
    paddingBottom: 120, // Add padding to avoid overlap with bottom buttons
  },
  movieContainer: {
    width: 180,
    margin: 10,
    height: 380,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 30,
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
  favoriteIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f0f0f0",
    elevation: 10, // Ensure buttons stay above other content
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#888",
    marginTop: 20,
  },
});

export default Home;