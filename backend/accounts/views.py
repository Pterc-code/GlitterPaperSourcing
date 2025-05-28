from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import SupplierRegisterSerializer, SupplierListSerializer, SupplierTokenObtainPairSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView


class SupplierRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SupplierRegisterSerializer
    permission_classes = [AllowAny]

class SupplierListView(generics.ListAPIView):
    queryset = User.objects.filter(role='supplier')
    serializer_class = SupplierListSerializer
    permission_classes = [IsAdminUser]

class SupplierDeleteView(generics.DestroyAPIView):
    queryset = User.objects.filter(role='supplier')
    serializer_class = SupplierListSerializer 
    permission_classes = [IsAdminUser]
    lookup_field = 'email'  # delete by email
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        email = instance.email
        self.perform_destroy(instance)
        return Response(
            {"message": f"Supplier with email '{email}' was deleted."},
            status=status.HTTP_200_OK
        )

class LoginView(TokenObtainPairView):
    serializer_class = SupplierTokenObtainPairSerializer