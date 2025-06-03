from rest_framework import serializers
from .models import User, SupplierProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

class SupplierRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    supplier_name = serializers.CharField(write_only=True)
    supplier_representative = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 
            'password', 
            'supplier_name', 
            'supplier_representative', 
            'phone_number'
        ]

    def create(self, validated_data):
        # Extract profile fields
        supplier_name = validated_data.pop('supplier_name')
        supplier_representative = validated_data.pop('supplier_representative')
        phone_number = validated_data.pop('phone_number')

        # Create user with role = 'supplier'
        user = User.objects.create(
            email=validated_data['email'],
            role='supplier'
        )
        user.set_password(validated_data['password'])
        user.save()

        # Create supplier profile
        SupplierProfile.objects.create(
            user=user,
            supplier_name=supplier_name,
            supplier_representative=supplier_representative,
            phone_number=phone_number
        )

        return user

class SupplierListSerializer(serializers.ModelSerializer):
    supplier_name = serializers.SerializerMethodField()
    supplier_representative = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'supplier_name', 
            'supplier_representative', 
            'phone_number'
            ]

    def get_supplier_name(self, obj):
        return obj.supplier_profile.supplier_name 

    def get_supplier_representative(self, obj):
        return obj.supplier_profile.supplier_representative 

    def get_phone_number(self, obj):
        return obj.supplier_profile.phone_number

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )

        if user is None:
            raise AuthenticationFailed("Invalid email or password.")

        refresh = self.get_token(user)

        # Add custom claims to the access token
        access = refresh.access_token
        access['role'] = user.role  # ✅ Add role to token payload

        data = {
            'refresh': str(refresh),
            'access': str(access),
        }

        return data
    
