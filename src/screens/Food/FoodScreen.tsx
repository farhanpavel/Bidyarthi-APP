import { useNavigation } from '@react-navigation/native';
import { DollarSignIcon, Map, Users } from 'lucide-react-native';
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Card, IconButton, Button } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';

const data = [
  {
    id: '1',
    image: require('../../../assets/meal.png'),
    title: 'নাস্তা',
    description: 'সকালের প্রয়োজনীয় শক্তির উৎস',
  },
  {
    id: '2',
    image: require('../../../assets/meal2.jpg'),
    title: 'মধ্যাহ্নভোজ',
    description: 'একটি স্বাস্থ্যকর এবং পুষ্টিকর খাবার',
  },
  {
    id: '3',
    image: require('../../../assets/breakfast.png'),
    title: 'রাতের খাবার',
    description: 'স্বাস্থ্যকর ও পরিপূর্ণ রাতের খাবার',
  },
];

const { width, height } = Dimensions.get('window');

export default function MealPage() {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation(); // Use the useNavigation hook
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        let nextIndex = (activeIndex + 1) % data.length;
        setActiveIndex(nextIndex);
        carouselRef.current.snapToItem(nextIndex);
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={item.image} style={styles.carouselImage} resizeMode="cover" />
      <View style={styles.overlay} />
      <Text className="text-xl text-white">{item.title}</Text>
      <Text className="mt-2 text-3xl text-white">{item.description}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={data}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        loop={true}
        autoplay={false} // Handled manually using useEffect
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <View>
        <Text className="mx-auto mt-2 w-1/4 border-b-4 border-gray-500 text-center text-2xl font-bold">
          মেনু
        </Text>
      </View>
      <View className="mx-4 mt-4">
        <View className="flex flex-row overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {/* Image Section */}
          <View className="flex-none">
            <Image
              source={require('../../../assets/meal.png')}
              className="h-60 w-56 rounded-l-lg"
              resizeMode="cover"
            />
          </View>

          {/* Content Section */}
          <View className="flex-1 justify-between p-4">
            {/* Title and Description */}
            <View>
              <Text className="text-xl font-bold text-gray-800">Fried Rice</Text>
              <Text className="mt-1 text-sm text-gray-600">Fried Rice With Chicken</Text>
            </View>

            {/* Meal Type and Price */}
            <View className="mt-3 flex flex-row items-center justify-between">
              <Text className="text-sm text-gray-700">Lunch</Text>
              <View className="flex flex-row items-center">
                <Text className="mr-1 text-lg font-bold text-gray-800">130</Text>
                <DollarSignIcon size={16} color="#EF4444" />
              </View>
            </View>

            {/* Location and Quantity */}
            <View className="mt-3 flex flex-row items-center justify-between">
              <View className="flex flex-row items-center">
                <Map size={16} color="#EF4444" />
                <Text className="ml-1 text-sm text-gray-700">Akm</Text>
              </View>
              <View className="flex flex-row items-center">
                <Users size={16} color="#EF4444" />
                <Text className="ml-1 text-sm text-gray-700">Hello</Text>
              </View>
            </View>

            {/* Buttons at the Bottom */}
            <View className="mt-4 flex flex-row justify-center gap-x-2">
              <Button
                mode="text"
                buttonColor="red" // Changes to flat button style
                labelStyle={{ color: 'white', fontSize: 14 }} // Text color and font size
                onPress={() => navigation.navigate('OrderScreen')}
                className="rounded-none"
                style={{ borderRadius: 5 }} // Remove rounded corners
              >
                Order
              </Button>
              <Button
                mode="text"
                buttonColor="green" // Changes to flat button style
                labelStyle={{ color: 'white', fontSize: 14 }} // Text color and font size
                onPress={() => navigation.navigate('OrderScreen')}
                className="rounded-none"
                style={{ borderRadius: 5 }} // Remove rounded corners
              >
                Preorder
              </Button>
            </View>
          </View>
        </View>
      </View>

      {/* New Card with Background [#E54981] */}
      <View className="mx-4 mb-4 mt-4 rounded-lg" style={{ backgroundColor: '#E54981' }}>
        <View className="p-4">
          <Text className="text-center text-xl font-bold text-white">
            আপনার অনুরোধকৃত আইটেম দেখতে চান?
          </Text>
          <View className="mt-4 flex flex-row justify-center">
            <Button
              mode="contained"
              style={{ backgroundColor: 'white' }}
              labelStyle={{ color: '#E54981', fontSize: 14 }}
              contentStyle={{ paddingVertical: 4 }}
              onPress={() => navigation.navigate('ReqScreen')}>
              দেখুন
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
  },
  carouselItem: {
    width: width,
    height: height * 0.5, // Adjust height as needed
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
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity here
  },
  carouselText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
});
