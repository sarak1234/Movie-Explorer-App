import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, FlatList, Button, TouchableOpacity, TextInput } from "react-native";
import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

const Home = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchTrending();
  }, [page]);

  const fetchTrending = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=4705d52785ca9b43e39295d4291dd000&page=${page}`);
      const data = await response.json();

      // Separate the movies and series
      const movies = data.results.filter(item => item.media_type === 'movie').slice(0, 6);  // Get 6 movies
      const series = data.results.filter(item => item.media_type === 'tv').slice(0, 6);   // Get 6 series

      // Combine both in random order
      const combinedItems = [...movies, ...series];
      combinedItems.sort(() => Math.random() - 0.5); // Shuffle the array

      // Append the new items to the existing ones (if it's not the first page)
      setItems((prevItems) => (page === 1 ? combinedItems : [...prevItems, ...combinedItems]));
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    } finally {
      setLoading(false);
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

  const filteredItems = items.filter((item) =>
    (item.title || item.name)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Trending Movies & Series</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Movies & Series"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {loading ? (
        <Text>Loading...</Text>
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
                    <Text>Year: {item.release_date?.split("-")[0]}</Text>
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
          numColumns={3} // Display 3 items per row
          contentContainerStyle={styles.listContainer}
        />
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
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    paddingBottom: 100,
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
  searchBar: {
    width: "35%",
    height: 50,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 8,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  favoriteIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "25%",
    alignItems: "center",
  },
});

export default Home;
