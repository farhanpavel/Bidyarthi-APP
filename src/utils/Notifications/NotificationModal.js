import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { useNotificationModalStore } from './store';
import { url } from 'components/url/page';

export default function NotificationModal() {
  const { isNotificationModalOpen, closeNotificationModal } = useNotificationModalStore();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isNotificationModalOpen) {
      fetchNotifications();
    }
  }, [isNotificationModalOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}//api/emergency`);
      const json = await response.json();
      if (response.ok) {
        setNotifications(json);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Modal
      isVisible={isNotificationModalOpen}
      onBackdropPress={closeNotificationModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      style={styles.modal}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🔔 নোটিফিকেশন প্যানেল</Text>
          <TouchableOpacity onPress={closeNotificationModal}>
            <Text style={styles.closeButton}>✖</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.notificationItem}>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.location}>📍 অবস্থান: {item.location}</Text>
                <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
                {item.type === 'EMERGENCY' && (
                  <Text style={styles.emergencyLevel}>🚨 জরুরি স্তর: {item.emergencyLevel}</Text>
                )}
              </View>
            )}
          />
        ) : (
          <Text style={styles.noNotifications}>কোনো নোটিফিকেশন পাওয়া যায়নি।</Text>
        )}

        {/* Footer */}
        <TouchableOpacity style={styles.closeModalButton} onPress={closeNotificationModal}>
          <Text style={styles.closeModalText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 22,
    color: 'red',
  },
  notificationItem: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  message: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  emergencyLevel: {
    fontSize: 12,
    color: 'red',
    fontWeight: 'bold',
  },
  noNotifications: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
  },
  closeModalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
