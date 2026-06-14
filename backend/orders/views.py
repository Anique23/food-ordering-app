from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Order, OrderItem
from .serializers import OrderSerializer, PlaceOrderSerializer
from menu.models import FoodItem


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    @action(detail=False, methods=['post'], url_path='place_order')
    def place_order(self, request):
        try:
            address = request.data.get('address')
            items_data = request.data.get('items', [])

            if not address:
                return Response({'error': 'Address is required'}, status=status.HTTP_400_BAD_REQUEST)

            if not items_data:
                return Response({'error': 'No items in order'}, status=status.HTTP_400_BAD_REQUEST)

            order = Order.objects.create(
                user=request.user,
                address=address
            )

            total = 0
            for item in items_data:
                food = FoodItem.objects.get(id=item['food_id'])
                quantity = int(item['quantity'])
                OrderItem.objects.create(
                    order=order,
                    food_item=food,
                    quantity=quantity,
                    price=food.price
                )
                total += food.price * quantity

            order.total_price = total
            order.save()

            return Response(
                OrderSerializer(order).data,
                status=status.HTTP_201_CREATED
            )
        except FoodItem.DoesNotExist:
            return Response({'error': 'Food item not found'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            order.save()
            return Response({'message': f'Order status updated to {new_status}'})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)