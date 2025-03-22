import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { Mail, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from 'components/url/page';

export default function EmailScreen() {
  const [showCompose, setShowCompose] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    body: '',
  });
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${url}/api/mail/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setInbox(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await fetch(`${url}/api/mail/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          email: emailData.to,
          subject: emailData.subject,
          message: emailData.body,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Email sent successfully!');
        setShowCompose(false);
        setEmailData({ to: '', subject: '', body: '' });
        await fetchMessages();
      } else {
        alert(`Failed to send email: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred while sending the email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Mail size={24} color="#E54981" />
        <Text style={styles.headerText}>বার্তা আদান প্রদান</Text>
      </View>
      <Text style={styles.subHeader}>আপনার পাঠানো এবং প্রাপ্ত বার্তাগুলো এখানে পাবেন</Text>

      {/* Main Content */}
      <ScrollView style={styles.scrollContainer}>
        {/* Compose Button */}
        <TouchableOpacity onPress={() => setShowCompose(true)} style={styles.composeButton}>
          <Mail size={20} color="#fff" />
          <Text style={styles.composeText}>লিখুন</Text>
        </TouchableOpacity>

        {/* Compose Email Form */}
        {showCompose && (
          <Card style={styles.card}>
            <Card.Title
              title="ইমেইল লিখুন"
              titleStyle={styles.cardTitle}
              right={(props) => (
                <IconButton
                  icon={() => <X size={24} color="#000" />}
                  onPress={() => setShowCompose(false)}
                />
              )}
            />
            <Card.Content>
              <TextInput
                placeholder="ব্যক্তির ইমেইল"
                placeholderTextColor="#4a4a4a"
                value={emailData.to}
                onChangeText={(text) => setEmailData({ ...emailData, to: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="বিষয়"
                placeholderTextColor="#4a4a4a"
                value={emailData.subject}
                onChangeText={(text) => setEmailData({ ...emailData, subject: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="বার্তা"
                placeholderTextColor="#4a4a4a"
                value={emailData.body}
                onChangeText={(text) => setEmailData({ ...emailData, body: text })}
                multiline
                numberOfLines={6}
                style={[styles.input, styles.bodyInput]}
              />
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <TouchableOpacity onPress={() => setShowCompose(false)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>বাদ দিন</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} disabled={loading} style={styles.sendButton}>
                <Text style={styles.sendText}>{loading ? 'পাঠানো হচ্ছে...' : 'পাঠান'}</Text>
              </TouchableOpacity>
            </Card.Actions>
          </Card>
        )}

        {/* Inbox Content */}
        <View style={styles.inboxContainer}>
          <Text style={styles.inboxTitle}>ইনবক্স</Text>
          {inbox.length === 0 ? (
            <Text style={styles.emptyText}>কোনো বার্তা নেই</Text>
          ) : (
            inbox.map((message) => (
              <Card key={message.id} style={styles.inboxCard}>
                <Card.Title
                  title={message.subject}
                  subtitle={`প্রেরক: ${message.from.name}`}
                  titleStyle={styles.inboxTitleStyle}
                  subtitleStyle={styles.inboxSubtitleStyle}
                />
                <Card.Content>
                  <Text style={styles.inboxMessage}>{message.message}</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light gray background from ClubScreen
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E54981', // Black text from ClubScreen
    marginLeft: 8,
  },
  subHeader: {
    fontSize: 14,
    color: '#4a4a4a', // Dark gray from ClubScreen
    borderBottomWidth: 2,
    borderBottomColor: '#E54981',
    // Black border from ClubScreen
    paddingBottom: 8,
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  composeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E54981', // Pink from ClubScreen
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  composeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text from ClubScreen button
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff', // White card from ClubScreen
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2, // Subtle shadow from ClubScreen
  },
  cardTitle: {
    color: '#000', // Black text from ClubScreen
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff', // White input background
    borderWidth: 2,
    borderColor: '#E54981', // Pink border for consistency
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#000', // Black text
  },
  bodyInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  cardActions: {
    justifyContent: 'flex-end',
    padding: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0', // Light gray for cancel
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelText: {
    color: '#000', // Black text
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#E54981', // Pink from ClubScreen
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendText: {
    color: '#fff', // White text from ClubScreen button
    fontSize: 14,
    fontWeight: 'bold',
  },
  inboxContainer: {
    marginTop: 16,
  },
  inboxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // Black text
    marginBottom: 16,
  },
  emptyText: {
    color: '#4a4a4a', // Dark gray from ClubScreen
    fontSize: 16,
  },
  inboxCard: {
    backgroundColor: '#fff', // White card from ClubScreen
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  inboxTitleStyle: {
    color: '#000', // Black text
    fontSize: 16,
    fontWeight: 'bold',
  },
  inboxSubtitleStyle: {
    color: '#E54981', // Pink for subtitle like ClubScreen description
    fontSize: 14,
  },
  inboxMessage: {
    color: '#000', // Black text
    fontSize: 14,
  },
});
