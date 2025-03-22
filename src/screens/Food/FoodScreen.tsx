import { useNavigation } from '@react-navigation/native';
import { url } from 'components/url/page';
import { DollarSign, Map, Users } from 'lucide-react-native';
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';

const { width, height } = Dimensions.get('window');

export default function MealPage() {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [meals, setMeals] = useState([]); // State to store meal data
  const navigation = useNavigation();

  // Fetch meals from the backend
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`${url}/api/meal/all/user/data`);
        if (!response.ok) {
          throw new Error('Failed to fetch meals');
        }
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    fetchMeals();
  }, []);

  // Carousel data
  const carouselData = [
    {
      id: '1',
      image: require('../../../assets/meal.png'),
      title: 'নাস্তা',
      description: 'দিনের শুরুতে পুষ্টিকর নাস্তা আপনাকে সারাদিন কর্মক্ষম রাখবে।',
    },
    {
      id: '2',
      image: require('../../../assets/meal2.jpg'),
      title: 'মধ্যাহ্নভোজ',
      description: 'সঠিক পুষ্টি ও শক্তির জন্য স্বাস্থ্যকর মধ্যাহ্নভোজ উপভোগ করুন।',
    },
    {
      id: '3',
      image: require('../../../assets/breakfast.png'),
      title: 'রাতের খাবার',
      description: 'সুস্থ ও প্রশান্ত ঘুমের জন্য হালকা ও পুষ্টিকর রাতের খাবার খান।',
    },
  ];

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        let nextIndex = (activeIndex + 1) % carouselData.length;
        setActiveIndex(nextIndex);
        carouselRef.current.snapToItem(nextIndex);
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Render carousel item
  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={item.image} style={styles.carouselImage} resizeMode="cover" />
      <View style={styles.overlay} />
      <Text style={styles.carouselTitle}>{item.title}</Text>
      <Text style={styles.carouselDescription}>{item.description}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Carousel */}
      <Carousel
        ref={carouselRef}
        data={carouselData}
        renderItem={renderCarouselItem}
        sliderWidth={width}
        itemWidth={width}
        loop={true}
        autoplay={false} // Handled manually using useEffect
        onSnapToItem={(index) => setActiveIndex(index)}
      />

      {/* Menu Title */}
      <View style={styles.menuTitleContainer}>
        <Text style={styles.menuTitle}>মেনু</Text>
      </View>

      {/* Meal List */}
      <View style={styles.mealListContainer}>
        {meals.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            {/* Meal Image */}
            <Image source={{ uri: meal.meal_url }} style={styles.mealImage} resizeMode="cover" />

            {/* Meal Details */}
            <View style={styles.mealDetails}>
              <Text style={styles.mealName}>{meal.mealName}</Text>
              <Text style={styles.mealDescription}>{meal.description}</Text>

              {/* Meal Type and Price */}
              <View style={styles.mealInfo}>
                <Text style={styles.mealType}>{meal.mealType}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{meal.price}</Text>
                  <DollarSign size={16} color="#1AC84B" />
                </View>
              </View>

              {/* Location and Quantity */}
              <View style={styles.mealInfo}>
                <View style={styles.locationContainer}>
                  <Map size={16} color="#FC8019" />
                  <Text style={styles.locationText}>
                    {meal.user.chefAssignment.restaurant.name}
                  </Text>
                </View>
                <View style={styles.quantityContainer}>
                  <Users size={16} color="#FC8019" />
                  <Text style={styles.quantityText}>{meal.quantity}</Text>
                </View>
              </View>

              {/* Order and Preorder Buttons */}
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  style={styles.orderButton}
                  labelStyle={styles.buttonLabel}
                  onPress={() => navigation.navigate('OrderScreen', { id: meal.id })}
                  disabled={meal.quantity <= 0}>
                  Order
                </Button>
                <Button
                  mode="contained-tonal"
                  style={[styles.preorderButton, meal.quantity > 0 && styles.disabledButton]}
                  labelStyle={styles.buttonLabel}
                  onPress={() => navigation.navigate('PreOrderScreen', { id: meal.id })}
                  disabled={meal.quantity > 0}>
                  Preorder
                </Button>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Requested Items Card */}
      <View style={styles.requestCard}>
        <Text style={styles.requestCardTitle}>আপনার অনুরোধকৃত আইটেম দেখতে চান?</Text>
        <Button
          mode="contained"
          style={styles.requestButton}
          labelStyle={styles.requestButtonLabel}
          onPress={() => navigation.navigate('ReqScreen')}>
          দেখুন
        </Button>
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
  },
  carouselItem: {
    width: width,
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  disabledButton: {
    backgroundColor: '#D3D3D3', // Gray background for disabled button
    opacity: 0.6, // Make the disabled button look faded
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  carouselTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  carouselDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    marginTop: 8,
    width: '80%',
  },
  menuTitleContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#4a4a4a',
  },
  mealListContainer: {
    paddingHorizontal: 16,
  },
  mealCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  mealImage: {
    width: '100%',
    height: 200,
  },
  mealDetails: {
    padding: 16,
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mealDescription: {
    fontSize: 14,
    color: '#4a4a4a',
    marginTop: 8,
  },
  mealInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  orderButton: {
    backgroundColor: '#1AC84B',
    flex: 1,
    marginRight: 8,
    borderRadius: 4,
  },
  preorderButton: {
    backgroundColor: '#EF4444',
    flex: 1,
    marginLeft: 8,
    borderRadius: 4,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 14,
  },
  requestCard: {
    backgroundColor: '#E54981',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    alignItems: 'center',
  },
  requestCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  requestButton: {
    backgroundColor: 'white',
    marginTop: 16,
    borderRadius: 4,
  },
  requestButtonLabel: {
    color: '#E54981',
    fontSize: 14,
  },
});
