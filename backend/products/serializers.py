from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def validate(self, data):
        name = data.get('product_name')
        desc = data.get('product_description')

        # When updating, self.instance is the current product object
        existing = Product.objects.filter(product_name=name, product_description=desc)
        if self.instance:
            existing = existing.exclude(pk=self.instance.pk)

        if existing.exists():
            raise serializers.ValidationError("A product with this name and description already exists.")
        
        return data
