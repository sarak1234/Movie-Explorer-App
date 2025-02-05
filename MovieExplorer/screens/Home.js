import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, FlatList } from "react-native";
import { Card } from "react-native-paper";

const Home = () => {
  const [items, setItems] = useState([]); // Holds both movies and series
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      // Fetch 6 movies and 6 series from OMDb
      const movieResponse = await fetch(`http://www.omdbapi.com/?s=movie&type=movie&apikey=617e1d0c`);
      const seriesResponse = await fetch(`http://www.omdbapi.com/?s=series&type=series&apikey=617e1d0c`);

      const movieData = await movieResponse.json();
      const seriesData = await seriesResponse.json();

      // Get exactly 6 movies and 6 series
      const movies = movieData.Search ? movieData.Search.slice(0, 6) : [];
      const series = seriesData.Search ? seriesData.Search.slice(0, 6) : [];

      // Mix movies and series together
      const mixedItems = [...movies, ...series].sort(() => Math.random() - 0.5);

      setItems(mixedItems);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
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
  );

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Trending Movies & Series</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.imdbID}
          renderItem={renderItem}
          numColumns={3} // Display 3 items per row
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
    alignItems: "center", // Keeps everything centered
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listContainer: {
    alignItems: "center", // Centering items
  },
  movieContainer: {
    width: 180, // Set a fixed width
    margin: 10, // Adds space between items
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
    width: "110%",  // Ensures the image takes up the full container width
    height: 250, // Adjust the height to your preferred size
    resizeMode: "cover", // Ensures the image covers the container area without distortion
  },  
  movieTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
});


export default Home;
