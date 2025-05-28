from django.db import models

class Product(models.Model):
    product_name = models.CharField(max_length=10)
    product_description = models.CharField(max_length=10)
    product_icon = models.CharField(max_length=50) 
