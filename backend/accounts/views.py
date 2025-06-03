from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import SupplierRegisterSerializer, SupplierListSerializer, CustomTokenObtainPairSerializer 
from rest_framework_simplejwt.views import TokenObtainPairView
from backend.permissions import IsStaffOrAdminRole


# Endpoint for supplier account creation
class SupplierRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SupplierRegisterSerializer
    permission_classes = [AllowAny]

# Endpoint for listing all supplier accounts & info
class SupplierListView(generics.ListAPIView):
    queryset = User.objects.filter(role='supplier')
    serializer_class = SupplierListSerializer
    permission_classes = [IsStaffOrAdminRole]

# Endpoint for deleting supplier accounts 
class SupplierDeleteView(generics.DestroyAPIView):
    queryset = User.objects.filter(role='supplier')
    serializer_class = SupplierListSerializer 
    permission_classes = [IsStaffOrAdminRole]
    lookup_field = 'email'  

# Endpoint for logging in 
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer