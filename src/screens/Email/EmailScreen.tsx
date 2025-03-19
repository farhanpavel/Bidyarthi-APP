import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { Appbar, Card, Avatar, IconButton } from 'react-native-paper';
import { Mail, Send, X } from 'lucide-react-native'; // Assuming you have lucide-react-native installed
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing token
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

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Function to fetch messages
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

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setInbox(data); // Update inbox state with fetched messages
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Handle form submission
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
        await fetchMessages(); // Refetch messages after sending
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
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Appbar.Header className="bg-white shadow">
        <Appbar.Content
          title="বার্তা আদান প্রদান"
          subtitle="আপনার পাঠানো এবং প্রাপ্ত বার্তাগুলো এখানে পাবেন"
        />
      </Appbar.Header>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        {/* Compose Button */}
        <TouchableOpacity
          onPress={() => setShowCompose(true)}
          className="mb-4 flex-row items-center justify-center rounded-lg bg-blue-600 p-3">
          <Mail className="mr-2 text-white" />
          <Text className="font-bold text-white">লিখুন</Text>
        </TouchableOpacity>

        {/* Compose Email Form */}
        {showCompose && (
          <Card className="mb-4">
            <Card.Title
              title="ইমেইল লিখুন"
              right={(props) => <IconButton icon="close" onPress={() => setShowCompose(false)} />}
            />
            <Card.Content>
              <TextInput
                placeholder="ব্যক্তির ইমেইল"
                placeholderTextColor="#9CA3AF"
                value={emailData.to}
                onChangeText={(text) => setEmailData({ ...emailData, to: text })}
                className="mb-4 rounded-lg border border-gray-300 p-2"
                style={{ fontSize: 16 }}
              />
              <TextInput
                placeholder="বিষয়"
                placeholderTextColor="#9CA3AF"
                value={emailData.subject}
                onChangeText={(text) => setEmailData({ ...emailData, subject: text })}
                className="mb-4 rounded-lg border border-gray-300 p-2"
                style={{ fontSize: 16 }}
              />
              <TextInput
                placeholder="বার্তা"
                placeholderTextColor="#9CA3AF"
                value={emailData.body}
                onChangeText={(text) => setEmailData({ ...emailData, body: text })}
                multiline
                numberOfLines={6}
                className="mb-4 rounded-lg border border-gray-300 p-2"
                style={{ fontSize: 16, textAlignVertical: 'top', minHeight: 120 }}
              />
            </Card.Content>
            <Card.Actions className="justify-end">
              <TouchableOpacity
                onPress={() => setShowCompose(false)}
                className="mr-2 rounded-lg bg-gray-100 px-4 py-2">
                <Text>বাদ দিন</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2">
                {loading ? (
                  <Text className="text-white">পাঠানো হচ্ছে...</Text>
                ) : (
                  <Text className="text-white">পাঠান</Text>
                )}
              </TouchableOpacity>
            </Card.Actions>
          </Card>
        )}

        {/* Inbox Content */}
        <View className="mt-4">
          <Text className="mb-4 text-xl font-bold">ইনবক্স</Text>
          {inbox.length === 0 ? (
            <Text className="text-gray-500">কোনো বার্তা নেই</Text>
          ) : (
            inbox.map((message) => (
              <Card key={message.id} className="mb-4">
                <Card.Title
                  title={message.subject}
                  subtitle={`প্রেরক: ${message.from.name}`}
                  left={(props) => (
                    <Avatar.Text size={40} label={message.from.name[0]} className="bg-blue-600" />
                  )}
                />
                <Card.Content>
                  <Text>{message.message}</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
