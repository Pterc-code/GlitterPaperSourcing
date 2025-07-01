from backend.permissions import IsStaffOrAdminRole
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import RFQ_Form, FormRowResponse, SupplierFormRemark
from .serializers import RFQFormViewSetSerializer, RFQFormListSerializer, FormRowResponseSerializer, SupplierFormRemarkSerializer
from backend.permissions import IsStaffOrAdminRole
from rest_framework.response import Response
from rest_framework import status

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

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        return [IsStaffOrAdminRole()]

    def get_queryset(self):
        form_param = self.request.query_params.get('form')
        queryset = FormRowResponse.objects.all()

        if form_param:
            queryset = queryset.filter(row_template__rfq_form__rfq_number=form_param)

        return queryset

    def create(self, request, *args, **kwargs):
        supplier_user = request.user
        row_template_id = request.data.get('row_template')

        existing_response = FormRowResponse.objects.filter(
            row_template_id=row_template_id,
            supplier_user=supplier_user
        ).first()

        if existing_response:
            serializer = self.get_serializer(existing_response, data=request.data, partial=True)
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK if existing_response else status.HTTP_201_CREATED)

    
class SupplierFormRemarkViewSet(viewsets.ModelViewSet):
    queryset = SupplierFormRemark.objects.all()
    serializer_class = SupplierFormRemarkSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        serializer.save(supplier_user=self.request.user)    