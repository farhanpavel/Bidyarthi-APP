import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { Appbar, Card, Avatar, IconButton } from 'react-native-paper';
import { Mail, Send, X } from 'lucide-react-native'; // Assuming you have lucide-react-native installed

export default function EmailScreen() {
  const [showCompose, setShowCompose] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    body: '',
  });
  const [inbox, setInbox] = useState([
    {
      id: 1,
      from: { name: 'John Doe', email: 'john@example.com' },
      subject: 'Meeting Reminder',
      message: "Don't forget the meeting at 10 AM tomorrow.",
    },
    {
      id: 2,
      from: { name: 'Jane Smith', email: 'jane@example.com' },
      subject: 'Project Update',
      message: "Here's the latest update on the project.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const newEmail = {
        id: inbox.length + 1,
        from: { name: 'You', email: 'you@example.com' },
        subject: emailData.subject,
        message: emailData.body,
      };
      setInbox([newEmail, ...inbox]); // Add new email to the top of the inbox
      setShowCompose(false); // Close the compose form
      setEmailData({ to: '', subject: '', body: '' }); // Clear the form
      setLoading(false);
    }, 1000);
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
                placeholderTextColor="#9CA3AF" // Gray color for placeholder
                value={emailData.to}
                onChangeText={(text) => setEmailData({ ...emailData, to: text })}
                className="mb-4 rounded-lg border border-gray-300 p-2"
                style={{ fontSize: 16 }} // Custom font size
              />
              <TextInput
                placeholder="বিষয়"
                placeholderTextColor="#9CA3AF" // Gray color for placeholder
                value={emailData.subject}
                onChangeText={(text) => setEmailData({ ...emailData, subject: text })}
                className="mb-4 rounded-lg border border-gray-300 p-2"
                style={{ fontSize: 16 }} // Custom font size
              />
              <TextInput
                placeholder="বার্তা"
                placeholderTextColor="#9CA3AF"
                value={emailData.body}
                onChangeText={(text) => setEmailData({ ...emailData, body: text })}
                multiline
                numberOfLines={6}
                className="mb-4 rounded-lg border border-gray-300 p-2"
                style={{ fontSize: 16, textAlignVertical: 'top', minHeight: 120 }} // Set minHeight
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
