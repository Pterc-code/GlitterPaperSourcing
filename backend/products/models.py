from django.db import models

class Product(models.Model):
    product_name = models.CharField(max_length=100, default="")
    product_icon = models.CharField(max_length=100, default="fa-box")
    product_description = models.TextField(null=True, blank=True)