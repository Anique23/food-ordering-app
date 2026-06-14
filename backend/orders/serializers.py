from rest_framework import serializers
from .models import Order, OrderItem
from menu.serializers import FoodItemSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    food_item_detail = FoodItemSerializer(source='food_item', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'food_item', 'food_item_detail', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'user_email', 'status', 'total_price', 'address', 'items', 'created_at']
        read_only_fields = ['user', 'total_price']

class PlaceOrderSerializer(serializers.Serializer):
    address = serializers.CharField()
    items = serializers.ListField(
        child=serializers.DictField()
    )