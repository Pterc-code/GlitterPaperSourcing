from django.urls import path
from .views import (
    ProductListCreateView,
    ProductRetrieveUpdateDeleteView,
)

urlpatterns = [
    path('', ProductListCreateView.as_view(), name='product_list_create'),
    path('<str:product_name>/<str:product_description>/', ProductRetrieveUpdateDeleteView.as_view(),name='product_detail')
]
