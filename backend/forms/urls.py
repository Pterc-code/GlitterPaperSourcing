from django.urls import path, include
from .views import RFQFormViewSet, FormRowResponseViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'form', RFQFormViewSet, basename='rfq_form')
router.register(r'form-response', FormRowResponseViewSet)

urlpatterns = [
    path('', include(router.urls)), 
]
