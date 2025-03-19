import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { HandPlatter, Minus, Plus, ShoppingCart, Trash2, DollarSign } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // For safe area handling
import { useRoute } from '@react-navigation/native'; // To get route params
import AsyncStorage from '@react-native-async-storage/async-storage'; // For token storage
import { url } from 'components/url/page';

const { width, height } = Dimensions.get('window');

export default function PreOrderScreen({ navigation }) {
  const route = useRoute();
  const { id } = route.params; // Get the meal ID from route params

  const [meal, setMeal] = useState(null); // State to store meal data
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(''); // State to handle errors

  // Fetch meal data from the backend
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${url}/api/meal/${id}`, {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch meal data');
        }

        const data = await response.json();
        setMeal(data[0]); // Set meal data

        // Initialize cart items
        setCartItems([
          {
            id: data[0].id,
            name: data[0].mealName,
            price: data[0].price,
            quantity: 1,
            image: data[0].meal_url,
            mealType: data[0].mealType,
          },
        ]);
      } catch (error) {
        console.error('Error fetching meal data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  // Increase quantity
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const deliveryFee = 2.99;
  const tax = calculateSubtotal() * 0.08;

  // Handle preorder payment
  const handlePay = async () => {
    const totalAmount = calculateSubtotal() + deliveryFee + tax;

    const payload = {
      amount: totalAmount,
      menuId: id,
      quantity: cartItems[0].quantity,
    };

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${url}/api/meal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        navigation.goBack(); // Navigate back after successful preorder
      } else {
        console.error('Preorder failed:', result.error);
      }
    } catch (error) {
      console.error('Error during preorder:', error);
    }
  };

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
      <View>
        <ScrollView>
          {/* Meal Card */}
          <Card style={styles.mealCard}>
            <View style={styles.mealContainer}>
              <Image source={{ uri: meal.meal_url }} style={styles.mealImage} />
              <View style={styles.mealDetails}>
                <Text style={styles.mealName}>{meal.mealName}</Text>
                <Text style={styles.mealDescription}>{meal.description}</Text>
                <View style={styles.mealInfo}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoText}>${meal.price}</Text>
                    <DollarSign size={16} color="#1AC84B" />
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoText}>30 mins</Text>
                    <Text style={styles.infoLabel}>Delivery Time</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoText}>{meal.mealType}</Text>
                    <Text style={styles.infoLabel}>Meal Type</Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>

          {/* Cart Section */}
          <Card style={styles.cartCard}>
            <View style={styles.cartHeader}>
              <ShoppingCart size={20} color="#6B7280" />
              <Text style={styles.cartHeaderText}>Your Cart</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItems.length} Items</Text>
              </View>
            </View>
            <View style={styles.cartContent}>
              {cartItems.length === 0 ? (
                <View style={styles.emptyCart}>
                  <ShoppingCart size={48} color="#6B7280" />
                  <Text style={styles.emptyCartText}>Your cart is empty</Text>
                  <Text style={styles.emptyCartSubText}>
                    Add some delicious items to get started
                  </Text>
                </View>
              ) : (
                cartItems.map((item) => (
                  <View key={item.id} style={styles.cartItem}>
                    <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                    <View style={styles.cartItemDetails}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
                      <Text style={styles.cartItemType}>Type: {item.mealType}</Text>
                    </View>
                    <View style={styles.cartItemTotal}>
                      <Text style={styles.totalText}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                      <Button
                        mode="text"
                        onPress={() => removeItem(item.id)}
                        style={styles.removeButton}>
                        <Trash2 size={16} color="#EF4444" />
                      </Button>
                    </View>
                  </View>
                ))
              )}
            </View>
          </Card>

          {/* Order Summary */}
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryHeader}>Order Summary</Text>
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${calculateSubtotal().toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryTotal}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ${(calculateSubtotal() + deliveryFee + tax).toFixed(2)}
                </Text>
              </View>
            </View>
            <Button mode="contained" style={styles.checkoutButton} onPress={handlePay}>
              Proceed to Checkout
            </Button>
          </Card>
        </ScrollView>

        {/* Floating Buttons */}
        {cartItems.length > 0 && (
          <View style={styles.floatingContainer}>
            <View style={styles.floatingButtons}>
              <Button
                mode="contained"
                onPress={() => decreaseQuantity(cartItems[0].id)}
                style={styles.floatingButton}>
                <Minus size={20} color="black" />
              </Button>
              <Text style={styles.floatingQuantity}>{cartItems[0].quantity}</Text>
              <Button
                mode="contained"
                onPress={() => increaseQuantity(cartItems[0].id)}
                style={styles.floatingButton}>
                <Plus size={20} color="black" />
              </Button>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  mealCard: {
    backgroundColor: '#202020',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mealContainer: {
    flexDirection: 'row',
  },
  mealImage: {
    width: width * 0.4,
    height: 220,
  },
  mealDetails: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  mealDescription: {
    fontSize: 14,
    color: '#ccc',
  },
  mealInfo: {
    flexDirection: 'column',
    marginTop: 16,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    marginRight: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  cartCard: {
    marginBottom: 16,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cartHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  badge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#4b5563',
  },
  cartContent: {
    padding: 16,
  },
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emptyCartSubText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#6b7280',
  },
  cartItemType: {
    fontSize: 12,
    color: '#6b7280',
  },
  cartItemTotal: {
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    marginBottom: 44,
  },
  summaryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  summaryContent: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    margin: 16,
    backgroundColor: '#E54981',
  },
  floatingContainer: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  floatingButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E54981',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 4,
  },
  floatingButton: {
    marginHorizontal: 8,
    backgroundColor: '#FFF',
    color: 'black',
  },
  floatingQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginHorizontal: 8,
  },
});
