import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { Map, Users, DollarSign } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // For safe area handling
import AsyncStorage from '@react-native-async-storage/async-storage'; // For token storage
import { url } from 'components/url/page';

const { width, height } = Dimensions.get('window');

export default function RequestScreen() {
  const [meals, setMeals] = useState([]); // State to store meal data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(''); // State to handle errors

  // Fetch meals from the backend
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        // Get token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        console.warn(token);
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${url}/api/meal/data/end`, {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch meal data');
        }

        const data = await response.json();
        setMeals(data); // Set fetched data to state
      } catch (error) {
        console.error('Error fetching meal data:', error);
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchMeals();
  }, []);

  // Display loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Display error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Text className="mx-auto mt-2 w-1/2 border-b-4 border-gray-500 text-center text-2xl font-bold">
            অনুরোধকৃত অর্ডার
          </Text>
        </View>
        {meals.map((meal) => (
          <Card key={meal.id} style={styles.card}>
            <View style={styles.landscapeContainer}>
              {/* Image on the left */}
              <Image source={{ uri: meal.menu.meal_url }} style={styles.landscapeImage} />

              {/* Text and details on the right */}
              <View style={styles.landscapeDetails}>
                {/* Title and Description */}
                <View style={styles.mealDetails}>
                  <Text style={styles.mealName}>{meal.menu.mealName}</Text>
                  <Text style={styles.mealDescription}>{meal.menu.description}</Text>
                </View>

                {/* Meal Type and Price */}
                <View style={styles.mealInfo}>
                  <Text style={styles.mealType}>{meal.menu.mealType}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                      ${(meal.menu.price * meal.quantity).toFixed(2)}
                    </Text>
                    <DollarSign size={16} color="#EF4444" />
                  </View>
                </View>

                {/* Location and Quantity */}
                <View style={styles.locationQuantity}>
                  <View style={styles.location}>
                    <Map size={16} color="#EF4444" />
                    <Text style={styles.locationText}>
                      {meal.menu.user.chefAssignment.restaurant.name}
                    </Text>
                  </View>
                  <View style={styles.quantity}>
                    <Users size={16} color="#EF4444" />
                    <Text style={styles.quantityText}>{meal.quantity}</Text>
                  </View>
                </View>

                {/* Status Badges */}
                <View style={styles.badges}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: meal.status ? '#10B981' : '#EF4444' },
                    ]}>
                    <Text style={styles.badgeText}>{meal.status ? 'Taken' : 'Pending'}</Text>
                  </View>
                  <View
                    style={[styles.badge, { backgroundColor: meal.paid ? '#3B82F6' : '#EF4444' }]}>
                    <Text style={styles.badgeText}>
                      {meal.paid ? 'Online Payment' : 'Preorder'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  card: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  landscapeContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  landscapeImage: {
    width: width * 0.4, // 40% of screen width for the image
    height: 'auto', // Fixed height for the image
  },
  landscapeDetails: {
    flex: 1, // Takes the remaining space
    padding: 16,
  },
  mealDetails: {
    marginBottom: 12,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  mealDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  mealInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealType: {
    fontSize: 14,
    color: '#6b7280',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  locationQuantity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  badges: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
  },
});
