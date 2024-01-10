import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Button, Input } from '../components/ui';
import logo from '../assets/cancerlogo.png';
import handleGetPrediction from '../services/handleGetPrediction';
import { handleAddLog } from '../services/handleAddLog';
import { useNavigation } from '@react-navigation/native'; 
import { AuthContext } from '../AuthContext';
import LoadingModal from '../components/LoadingModal';
export default function UploadPhotoPage() {
  const navigation = useNavigation();  // Get the navigation prop
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const getPermission = async (permissionType) => {
    const { status } = await Permissions.askAsync(permissionType);
    if (status !== 'granted') {
      alert('Sorry, we need permissions to make this work!');
      return false;
    }
    return true;
  };
  

  const takeImage = async () => {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setSelectedImage(result.uri);
    }
  };
  
  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setSelectedImage(result.uri);
    }
  };


  const analyzeImage = async () => {
    if (selectedImage) {
      setLoading(true); // Show loading modal
      try {
        // Call the handleGetPrediction function with the selected image
        const result = await handleGetPrediction(selectedImage);
        // Update state with the prediction result
        console.log(result);
        setPredictionResult(result);
        setLoading(false); // Hide loading modal
        // Show the modal
        setModalVisible(true);
  
        // Construct a log message
        const highestResult = result[0];
        const action = `User uploaded an image and received a prediction ${highestResult.label} with a score of ${highestResult.score}`;
        console.log(action);
        // Call the handleAddLog function to log this action
        await handleAddLog(action, user.token);
      } catch (error) {
        console.error('Error analyzing image:', error.message);
      }
      
    } else {
      console.warn('Please select an image before analyzing.');
    }
  };

  

  const closeModal = () => {
    // Close the modal and reset the prediction result
    setModalVisible(false);
    setPredictionResult(null);
  };
  const viewRecommendations = () => {
    // Navigate to the Recommendations page
    navigation.navigate('Recommendations');
    closeModal();
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.title}>Upload Photo Page</Text>
        <View style={{ marginBottom: 20 }}>
          <Button title="Take an Image" onPress={takeImage} style={styles.button} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Button title="Upload an Image" onPress={uploadImage} style={styles.button} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Button title="Logout" onPress={logout} style={styles.button} />
        </View>
        {selectedImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <Button title="Analyze" onPress={analyzeImage} style={styles.button} />
          </View>
        )}

        {/* Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                <Text style={styles.modalText}>
                  {predictionResult && `You most likely have ${predictionResult[0].label}`}
                </Text>
                {predictionResult &&
                  predictionResult.map((item, index) => (
                    <Text key={index} style={styles.modalText}>
                      {`${item.label}: ${Math.round(item.score * 100)}%`}
                    </Text>
                  ))}

                {/* Warning message */}
                <View style={styles.warningContainer}>
                  <Text style={styles.warningText}>
                    Warning: Please consult a doctor for an accurate diagnosis.
                  </Text>
                </View>

                <Button title="View Recommendations" onPress={viewRecommendations} style={styles.modalButton} />
                    <View style={{ marginBottom: 20 }}/>
                <Button title="Close" onPress={closeModal} style={styles.modalButton} />
              </View>
            </View>
          </Modal>
        <LoadingModal visible={isLoading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    warningContainer: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    
    warningText: {
      color: 'white',
      textAlign: 'center',
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
        width: '80%',
        maxWidth: 400,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 20,
    },
    logo: {
        width: 200,
        height: 100,
    },
    button: {
        marginBottom: 20,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Updated background color
    },
      modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
      },
      modalImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
      },
      modalText: {
        fontSize: 16,
        marginBottom: 10,
      },
      modalButton: {
        marginTop: 10, 
      },
      modalButtonText: {
        color: '#fff',
        fontSize: 16,
      },
});
