import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, FlatList, Button, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";

const Home = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async (page = 1) => {
    try {
      const movieResponse = await fetch(`http://www.omdbapi.com/?s=movie&type=movie&page=${page}&apikey=617e1d0c`);
      const seriesResponse = await fetch(`http://www.omdbapi.com/?s=series&type=series&page=${page}&apikey=617e1d0c`);

      const movieData = await movieResponse.json();
      const seriesData = await seriesResponse.json();

      const movies = movieData.Search ? movieData.Search.slice(0, 6) : [];
      const series = seriesData.Search ? seriesData.Search.slice(0, 6) : [];

      const mixedItems = [...movies, ...series].sort(() => Math.random() - 0.5);

      if (page === 1) {
        setItems(mixedItems);
      } else {
        setItems((prevItems) => [...prevItems, ...mixedItems]);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMedia(nextPage);
  };

  const handleMoviePress = (item) => {
    navigation.navigate("MovieDetails", { movie: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMoviePress(item)}>
      <View style={styles.movieContainer}>
        <Card style={styles.card}>
          <Image
            source={{ uri: item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/200" }}
            style={styles.image}
          />
          <Card.Content>
            <Text style={styles.movieTitle}>{item.Title}</Text>
            <Text>Year: {item.Year}</Text>
            <Text>Type: {item.Type}</Text>
          </Card.Content>
        </Card>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Trending Movies & Series</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.imdbID}
            renderItem={renderItem}
            numColumns={4} // Adjusted to 2 columns for better spacing
            contentContainerStyle={styles.listContainer}
          />
          <Button title="Load More" onPress={handleLoadMore} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 80,
    alignItems: "center",
  },
  movieContainer: {
    width: 180,
    margin: 10,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
});

export default Home;