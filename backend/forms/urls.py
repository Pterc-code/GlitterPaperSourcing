from django.urls import path, include
from .views import RFQFormViewSet, FormRowResponseViewSet, SupplierFormRemarkViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'form', RFQFormViewSet, basename='rfq_form')
router.register(r'form-response', FormRowResponseViewSet)
router.register(r'form-remarks', SupplierFormRemarkViewSet)

urlpatterns = [
    path('', include(router.urls)), 
]
