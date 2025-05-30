from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager


class User(AbstractUser):
    ROLE_CHOICES = (
        ('supplier', 'Supplier'),
        ('staff', 'Staff'),
        ('admin', 'Admin'),
    )
    email = models.EmailField(unique=True)
    username = None

    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES, 
        default='supplier'
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

class SupplierProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='supplier_profile')
    supplier_name = models.CharField(max_length=255)
    supplier_representative = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    products = models.ManyToManyField("products.Product", blank=True)
    
class StaffProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')

