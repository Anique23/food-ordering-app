from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, FoodItem
from .serializers import CategorySerializer, FoodItemSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]

class FoodItemViewSet(viewsets.ModelViewSet):
    queryset = FoodItem.objects.filter(is_available=True)
    serializer_class = FoodItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['name', 'description']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]