// addpharmacy.js
import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, StyleSheet, Text, Image, Modal, TouchableOpacity, FlatList, Alert, Platform } from 'react-native';
import { Button, Input } from '../components/ui';
import logo from '../assets/cancerlogo.png';
import { handleGetPharmacies } from '../services/handlegetpharamcies';
import { AuthContext } from '../AuthContext';
import { handleAddPharmacy } from '../services/handleAddPharmacy';
import * as ImagePicker from 'expo-image-picker';
import { handleDeletePharmacy } from '../services/handleDeletePharmacy';
import LoadingModal from '../components/LoadingModal';
const AddPharamcyPage = () => {
  const [pharmacy, setPharmacy] = useState({
    name: '',
    location: '',
    picture_url: '',
    specialization: '',
    added_by: ''
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const [pharmacies, setPharmacies] = useState([]); // State to store pharmacies
  const { user } = useContext(AuthContext); // Get user token from context

  useEffect(() => {
    if (isModalVisible && user && user.token) {
      fetchPharmacies();
    }
  }, [isModalVisible, user]); // Dependency array includes isModalVisible and user

  const fetchPharmacies = async () => {
    try {
      const response = await handleGetPharmacies(user.token);
      // Filter pharmacies where added_by matches user.username
      const filteredPharmacies = response.filter(pharmacy => pharmacy.added_by === user.username);
      setPharmacies(filteredPharmacies);
    } catch (error) {
      console.error('Error fetching pharmacies:', error.message);
    }
  };
  

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleDelete = async (pharmacyId) => {
    setIsLoading(true); // Show loading modal
    try {
      
      await handleDeletePharmacy(pharmacyId, user.token);
      setIsLoading(false); // Hide loading modal
      Alert.alert("Success", "Pharmacy deleted successfully");
      fetchPharmacies(); // Refresh the list after successful deletion
    } catch (error) {
      setIsLoading(false); // Hide loading modal
      console.error("Error deleting pharmacy:", error.message);
      Alert.alert("Error", "Failed to delete pharmacy");
    }
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Image source={{ uri: item.picture_url }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.itemText}>Location: {item.location}</Text>
        <Text style={styles.itemText}>Specialization: {item.specialization}</Text>
        <Text style={styles.itemText}>Added by: {item.added_by}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      // Assuming the first selected image is the one we need
      const selectedImage = result.assets[0];
      setPharmacy({ ...pharmacy, picture: selectedImage.uri });
      setIsImageSelected(true); 
    }
  };

  const handleSubmit = async () => {
    if (!pharmacy.name || !pharmacy.location || !pharmacy.picture || !pharmacy.specialization) {
      Alert.alert("Error", "Please fill all the fields and upload a picture.");
      return;
    }

    const formData = new FormData();
    formData.append('name', pharmacy.name);
    formData.append('location', pharmacy.location);
    formData.append('specialization', pharmacy.specialization);
    formData.append('added_by', user.username);
    const localUri = pharmacy.picture;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('image', { uri: localUri, name: filename, type });
    setIsLoading(true); // Show loading modal
    try {
      
      await handleAddPharmacy(formData, user.token);
      setIsLoading(false); // Hide loading modal
      Alert.alert("Success", "Pharmacy added successfully");
      // Reset the form or navigate as needed
    } catch (error) {
      console.error("Error adding pharmacy:", error.message);
      Alert.alert("Error", "Failed to add pharmacy");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
     <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <View style={{marginBottom: 100}}>

          </View>
          <FlatList
            data={pharmacies}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </Modal>
      <View style={styles.container}>
        <View style={styles.card}>
        <View style={styles.logoContainer}>
                        <Image source={logo} style={styles.logo} resizeMode="contain" />
                    </View>
          <Text style={styles.title}>Add Pharmacy</Text>
          <View style={[styles.inputContainer, { marginBottom: 10 }]}>
            <Input
              placeholder="Name"
              value={pharmacy.name}
              onChangeText={text => setPharmacy({ ...pharmacy, name: text })}
            />
          </View>
          <View style={[styles.inputContainer, { marginBottom: 10 }]}>
            <Input
              placeholder="Location"
              value={pharmacy.location}
              onChangeText={text => setPharmacy({ ...pharmacy, location: text })}
            />
          </View>
          <View style={styles.inputContainer}>
      <Button title="Select Pharmacy Image" onPress={handleImageUpload} />
      {isImageSelected && <Text style={styles.selectedText}>Image selected</Text>}
    </View>

          <View style={[styles.inputContainer, { marginBottom: 10 }]}>
            <Input
              placeholder="Specialization"
              value={pharmacy.specialization}
              onChangeText={text => setPharmacy({ ...pharmacy, specialization: text })}
            />
          </View>
          <Button title="Add Pharmacy" onPress={handleSubmit} />
          <View style={{marginBottom: 10}}>

          </View>
          <Button title="View My Pharamcies" onPress={toggleModal} />

        </View>
      </View>
      <LoadingModal visible={isLoading} />
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    padding: 15, // Increased padding for a larger touch area
    zIndex: 1, // Ensure it's above other items
    backgroundColor: 'lightblue', // Optional: add a background color
    borderRadius: 20, // Optional: round the corners for a circular button
    alignItems: 'center', // Center the 'X' text horizontally
    justifyContent: 'center', // Center the 'X' text vertically
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Center the title text
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    width: '80%', // Set the width to 80% of the screen
    maxWidth: 400, // Set the maximum width to 400
  },
  inputContainer: {
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: 'center', // Center-align the logo
    marginBottom: 10, // Updated marginBottom
    marginTop: 20, // Updated marginTop
},
logo: {
  width: 200, // Set the width of the logo
  height: 100, // Set the height of the logo
},
item: {
  flexDirection: 'row',
  marginBottom: 20,
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
  maxHeight: 100,
},
image: {
  width: 50,
  height: 50,
  marginRight: 10,
},
infoContainer: {
  justifyContent: 'center',
  width: 200
  
},
name: {
  fontWeight: 'bold',
  fontSize: 16,
  marginBottom: 8,
},
});

export default AddPharamcyPage;
