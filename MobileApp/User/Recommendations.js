import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { AuthContext } from '../AuthContext';
import { handleGetPharmacies } from '../services/handlegetpharamcies';
import { Button } from '../components/ui';
import LoadingModal from '../components/LoadingModal';

const Recommendations = () => {
  const { user } = useContext(AuthContext);
  const [pharmacies, setPharmacies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPharmacies();
  }, [user, searchTerm]);

  const fetchPharmacies = async () => {
    try {
      setIsLoading(true);
      if (user && user.token) {
        const response = await handleGetPharmacies(user.token);
        setPharmacies(response);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching pharmacies:', error.message);
      setIsLoading(false);
    }
  };

  const searchByName = () => {
    const filteredPharmacies = pharmacies.filter((pharmacy) =>
      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPharmacies(filteredPharmacies);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Image source={{ uri: item.picture_url }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>Location: {item.location}</Text>
        <Text>Specialization: {item.specialization}</Text>
        <Text>Added by: {item.added_by}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
        
        <Button title="Search" onPress={searchByName} style={styles.searchButton} />

      </View>
      <FlatList
        data={pharmacies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {isLoading && <LoadingModal />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 50, // Adjust the marginTop value to bring the search bar down
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
  },
  item: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
});

export default Recommendations;
