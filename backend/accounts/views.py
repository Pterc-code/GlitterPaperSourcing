from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import SupplierRegisterSerializer, SupplierListSerializer, CustomTokenObtainPairSerializer, LogoutSerializer, SupplierUpdateSerializer, UserDetailSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from backend.permissions import IsStaffOrAdminRole
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated

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
    lookup_field = 'id'  

# Endpoint for logging in 
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Endpoint for logging out
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Endpoint for updating supplier info
class SupplierUpdateView(RetrieveUpdateAPIView):
    serializer_class = SupplierUpdateSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.filter(role='supplier')
    lookup_field = 'id'  # or 'pk'

    def get_object(self):
        obj = super().get_object()
        request_user = self.request.user

        # Allow supplier to update their own info
        # Allow staff/admin to update any supplier
        if request_user.role == 'supplier' and obj != request_user:
            raise PermissionDenied("您只能更新自己的信息")
        return obj

# Endpoint for viewing user details
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)