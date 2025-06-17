from backend.permissions import IsStaffOrAdminRole
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import RFQ_Form, FormRowResponse
from .serializers import RFQFormViewSetSerializer, RFQFormListSerializer, FormRowResponseSerializer
from backend.permissions import IsStaffOrAdminRole


class RFQFormViewSet(viewsets.ModelViewSet):
    queryset = RFQ_Form.objects.all()
    permission_classes = [IsStaffOrAdminRole]
    lookup_field = 'rfq_number'  

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsStaffOrAdminRole()]

    def get_serializer_class(self):
        if self.action == 'list':
            return RFQFormListSerializer
        return RFQFormViewSetSerializer

class FormRowResponseViewSet(viewsets.ModelViewSet):
    queryset = FormRowResponse.objects.all()
    serializer_class = FormRowResponseSerializer
    permission_classes = [IsStaffOrAdminRole]