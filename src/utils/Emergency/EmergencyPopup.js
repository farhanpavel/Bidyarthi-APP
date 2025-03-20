import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
const EmergencyPopup = ({
  message,
  overlayText,
  instructions,
  onClose,
  emergencyLevel,
  isVisible,
}) => {
  // Function to determine chip styles based on emergency level
  const getChipStyles = (level) => {
    switch (level) {
      case 'HIGH':
        return { backgroundColor: '#dc2626', color: 'white' }; // Red
      case 'MEDIUM':
        return { backgroundColor: '#facc15', color: 'black' }; // Yellow
      case 'LOW':
        return { backgroundColor: '#16a34a', color: 'white' }; // Green
      default:
        return { backgroundColor: '#6b7280', color: 'white' }; // Gray
    }
  };

  return (
    <Modal isVisible={isVisible} animationIn="zoomIn" animationOut="zoomOut" backdropOpacity={0.7}>
      <View style={styles.container}>
        {/* Emergency Level Chip */}
        <View style={[styles.chip, getChipStyles(emergencyLevel)]}>
          <Text style={[styles.chipText, { color: getChipStyles(emergencyLevel).color }]}>
            {emergencyLevel}
          </Text>
        </View>

        {/* Header */}
        <Text style={styles.title}>🚨 Emergency Alert!</Text>
        <Text style={styles.message}>{message}</Text>

        {/* Emergency Area Map */}
        <View style={styles.imageContainer}>
          <Image source={require('../../../assets/map_with_pin.png')} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>{overlayText}</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>📢 Instructions:</Text>
          <Text style={styles.instructions}>{instructions}</Text>
        </View>

        {/* Acknowledge Button */}
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Acknowledge</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  chip: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  chipText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(220, 38, 38, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  overlayText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  instructionsContainer: {
    marginTop: 15,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  instructions: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  button: {
    marginTop: 15,
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmergencyPopup;
