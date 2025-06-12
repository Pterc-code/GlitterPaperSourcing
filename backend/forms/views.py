from backend.permissions import IsStaffOrAdminRole
from rest_framework import viewsets
from .models import RFQ_Form
from .serializers import RFQFormViewSetSerializer, RFQFormListSerializer

class RFQFormViewSet(viewsets.ModelViewSet):
    queryset = RFQ_Form.objects.all()
    permission_classes = [IsStaffOrAdminRole]
    lookup_field = 'rfq_number'  

    def get_serializer_class(self):
        if self.action == 'list':
            return RFQFormListSerializer
        return RFQFormViewSetSerializer
