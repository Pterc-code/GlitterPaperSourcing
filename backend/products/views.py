from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer
from backend.permissions import IsStaffOrAdminRole

# Endpoint for product create and product list
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsStaffOrAdminRole]  

# Endpoint for product retrieval, update, and delete
class ProductRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsStaffOrAdminRole]

    def get_object(self):
        product_name = self.kwargs.get('product_name')
        product_description = self.kwargs.get('product_description')
        return Product.objects.get(
            product_name=product_name,
            product_description=product_description
        )