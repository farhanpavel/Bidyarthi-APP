import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as Location from 'expo-location';
import { url } from 'components/url/page';

const TrashScreen = () => {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [weight, setWeight] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  // Function to get the user's current GPS location and convert it to an address
  const getCurrentLocation = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Get the current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // High accuracy for better results
      });

      const { latitude, longitude } = location.coords;

      // Set latitude and longitude
      setLatitude(latitude);
      setLongitude(longitude);

      // Fetch the address using OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      const address = data.display_name || 'Location not found';
      return address;
    } catch (error) {
      console.error('Error getting location:', error);
      throw new Error('Unable to retrieve your location.');
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (file) => {
    setIsLoading(true);

    try {
      // Get the user's current GPS location and convert it to an address
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      // Prepare the image for upload
      const formData = new FormData();
      formData.append('image', {
        uri: file.uri,
        name: file.fileName || `photo_${Date.now()}.jpg`,
        type: file.type,
      });
      console.warn(formData);
      const response = await fetch(`${url}/api/waste/report`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const { type, weight, description } = data.analysisResult;
        setType(type);
        setWeight(weight);
        setDescription(description);
        setIsAiGenerated(true); // Enable editing after AI generates text
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', error.message || 'Failed to retrieve location.');
    } finally {
      setIsLoading(false);
    }
  };
  // Function to open camera or gallery
  const openImagePicker = () => {
    Alert.alert(
      'Upload Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () =>
            launchCamera({ mediaType: 'photo' }, (response) => handleImageResponse(response)),
        },
        {
          text: 'Gallery',
          onPress: () =>
            launchImageLibrary({ mediaType: 'photo' }, (response) => handleImageResponse(response)),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  // Function to handle image response from camera or gallery
  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      const file = response.assets[0];
      setFiles([file]);
      handleFileUpload(file);
    }
  };

  // Function to handle the submission of the waste report
  const handleSubmitReport = async () => {
    if (files.length === 0) {
      Alert.alert('Error', 'Please upload an image first.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: files[0].uri,
        name: files[0].fileName || `photo_${Date.now()}.jpg`,
        type: files[0].type,
      });
      formData.append('location', location);
      formData.append('description', description);
      formData.append('garbageType', type);
      formData.append('garbageWeight', weight);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);

      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${url}/api/waste/report/data`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        Alert.alert('Success', 'Report submitted successfully!');
        // Reset the form fields
        setFiles([]);
        setDescription('');
        setType('');
        setWeight('');
        setLocation('');
        setIsAiGenerated(false);
      } else {
        Alert.alert('Error', 'Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'An error occurred while submitting the report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="trash-can-outline" size={30} color="#E54981" />
        <Text style={styles.headerText}>আবর্জনা রিপোর্ট</Text>
      </View>
      <Text style={styles.subHeader}>আপনার আশেপাশের আবর্জনা সম্পর্কে রিপোর্ট করুন</Text>

      <Card style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>অবস্থান</Text>
          <TextInput
            style={styles.input}
            placeholder="আবর্জনার অবস্থান লিখুন"
            value={location}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>বিবরণ</Text>
          <TextInput
            style={[styles.input, { height: 120 }]}
            placeholder="আবর্জনার বিস্তারিত বিবরণ লিখুন"
            multiline
            value={description}
            onChangeText={setDescription}
            editable={isAiGenerated}
          />
        </View>

        <View style={styles.grid}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>আবর্জনার ধরন</Text>
            <TextInput
              style={styles.input}
              placeholder="AI দ্বারা নির্ধারিত হবে"
              value={type}
              onChangeText={setType}
              editable={isAiGenerated}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>আনুমানিক ওজন</Text>
            <TextInput
              style={styles.input}
              placeholder="AI দ্বারা নির্ধারিত হবে"
              value={weight}
              onChangeText={setWeight}
              editable={isAiGenerated}
            />
          </View>
        </View>

        {/* File Upload */}
        <TouchableOpacity style={styles.fileUpload} onPress={openImagePicker}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Icon name="upload" size={30} color="gray" />
              <Text style={styles.fileUploadText}>ক্লিক করুন</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Display Selected Files */}
        {files.length > 0 && (
          <View style={styles.fileList}>
            <Text style={styles.fileListHeader}>আপলোডকৃত ফাইল:</Text>
            <Text style={styles.fileListItem}>{files[0].fileName}</Text>
          </View>
        )}

        <Button
          mode="contained"
          style={styles.submitButton}
          onPress={handleSubmitReport}
          disabled={isLoading || isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#fff" /> : 'রিপোর্ট জমা দিন'}
        </Button>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#E54981',
  },
  subHeader: {
    fontSize: 12,
    color: '#4a4a4a',
    borderBottomWidth: 2,
    borderBottomColor: '#E54981',
    paddingBottom: 8,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#f9f9f9',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fileUpload: {
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderStyle: 'dashed',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  fileUploadText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 8,
  },
  fileList: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  fileListHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fileListItem: {
    fontSize: 12,
    color: 'gray',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#E54981',
    borderRadius: 4,
  },
});

export default TrashScreen;
