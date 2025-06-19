from django.urls import path
from .views import SupplierRegisterView, SupplierDeleteView, SupplierListView, LoginView, SupplierUpdateView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', SupplierRegisterView.as_view(), name='supplier_register'),
    path('delete/<int:id>/', SupplierDeleteView.as_view(), name='supplier_delete'),
    path('suppliers/', SupplierListView.as_view(), name='supplier_list'),
    path('login/', LoginView.as_view(), name='login_view'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('<int:id>/update/', SupplierUpdateView.as_view(), name='supplier-update'),
]