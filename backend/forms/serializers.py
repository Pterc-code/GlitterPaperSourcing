from rest_framework import serializers
from products.models import Product
from .models import RFQ_Form, FormHeader, FormRowTemplate, FormRowResponse, SupplierFormRemark
import json

class FormHeaderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormHeader
        exclude = ['rfq_form']

class FormRowTemplateCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormRowTemplate
        exclude = ['rfq_form']

class RFQFormViewSetSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True)
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    product_description = serializers.CharField(source='product.product_description', read_only=True)
    headers = FormHeaderCreateSerializer(many=True, required=False)
    row_templates = FormRowTemplateCreateSerializer(many=True, required=False)

    class Meta:
        model = RFQ_Form
        fields = [
            'id', 'rfq_number', 'product_name', 'product', 'product_id', 'product_description',
            'creation_date', 'closing_date', 'sourcing_status',
            'pdf_file', 'remarks', 'headers', 'row_templates'
        ]

    def create(self, validated_data):
        request = self.context.get('request')

        # Extract direct fields
        rfq_number = validated_data.pop('rfq_number', None)
        product = validated_data.pop('product')
        closing_date = request.data.get('closing_date')
        remarks = request.data.get('remarks', '')
        sourcing_status = request.data.get('sourcing_status', True)
        pdf_file = request.FILES.get('pdf_file')

        # Parse JSON strings from multipart FormData
        headers_raw = request.data.getlist('headers')
        row_templates_raw = request.data.getlist('row_templates')

        try:
            headers_data = [json.loads(item) for item in headers_raw]
            row_templates_data = [json.loads(item) for item in row_templates_raw]
        except json.JSONDecodeError:
            raise serializers.ValidationError("Headers or row_templates contain invalid JSON.")

        # Create RFQ_Form
        rfq = RFQ_Form.objects.create(
            rfq_number=rfq_number,
            product=product,
            closing_date=closing_date,
            sourcing_status=sourcing_status,
            remarks=remarks,
            pdf_file=pdf_file
        )

        for header in headers_data:
            FormHeader.objects.create(rfq_form=rfq, **header)

        for row in row_templates_data:
            FormRowTemplate.objects.create(rfq_form=rfq, **row)

        return rfq

class RFQFormListSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.SerializerMethodField()
    product_description = serializers.SerializerMethodField()

    class Meta:
        model = RFQ_Form
        fields = [
            'id', 'rfq_number', 'product_id', 'product_name', 'product_description',
            'creation_date', 'closing_date', 'sourcing_status'
        ]

    def get_product_name(self, obj):
        return obj.product.product_name if obj.product else None

    def get_product_description(self, obj):
        return obj.product.product_description if obj.product else None

class FormRowResponseSerializer(serializers.ModelSerializer):
    supplier_name = serializers.SerializerMethodField()
    supplier_representative = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()
    remark = serializers.SerializerMethodField()

    class Meta:
        model = FormRowResponse
        fields = [
            'id',
            'row_template',
            'supplier_user',
            'data',
            'submitted_at',
            'supplier_name',
            'supplier_representative',
            'phone_number',
            'remark'
        ]
        read_only_fields = ['id', 'submitted_at', 'supplier_user']

    def get_supplier_name(self, obj):
        if hasattr(obj.supplier_user, 'supplier_profile'):
            return obj.supplier_user.supplier_profile.supplier_name
        return '内部账号'

    def get_supplier_representative(self, obj):
        if hasattr(obj.supplier_user, 'supplier_profile'):
            return obj.supplier_user.supplier_profile.supplier_representative
        return '内部账号'

    def get_phone_number(self, obj):
        if hasattr(obj.supplier_user, 'supplier_profile'):
            return obj.supplier_user.supplier_profile.phone_number
        return '内部账号'

    def get_remark(self, obj):
        try:
            remark_obj = SupplierFormRemark.objects.get(
                rfq_form=obj.row_template.rfq_form,
                supplier_user=obj.supplier_user
            )
            return remark_obj.remark
        except SupplierFormRemark.DoesNotExist:
            return ''
        
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['supplier_user'] = request.user
        return super().create(validated_data)

    
from rest_framework import serializers
from .models import SupplierFormRemark

class SupplierFormRemarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierFormRemark
        fields = '__all__'
        read_only_fields = ['supplier_user', 'submitted_at']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['supplier_user'] = request.user

        # Check if a remark already exists for this supplier + form
        existing = SupplierFormRemark.objects.filter(
            rfq_form=validated_data['rfq_form'],
            supplier_user=request.user
        ).first()

        if existing:
            # Update existing remark
            existing.remark = validated_data.get('remark', existing.remark)
            existing.save()
            return existing

        # Create new remark if none exists
        return super().create(validated_data)
