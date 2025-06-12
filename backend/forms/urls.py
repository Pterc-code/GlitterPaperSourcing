from django.urls import path, include
from .views import RFQFormViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'', RFQFormViewSet, basename='rfq_form')


urlpatterns = [
    path('', include(router.urls)), 
]