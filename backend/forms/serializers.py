from rest_framework import serializers
from products.models import Product
from .models import RFQ_Form, FormHeader, FormRowTemplate
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

    headers = FormHeaderCreateSerializer(many=True, required=False)
    row_templates = FormRowTemplateCreateSerializer(many=True, required=False)

    class Meta:
        model = RFQ_Form
        fields = [
            'id', 'rfq_number', 'product', 'product_id',
            'creation_date', 'closing_date', 'sourcing_status',
            'pdf_file', 'remarks', 'headers', 'row_templates'
        ]

    def create(self, validated_data):
        request = self.context.get('request')

        # Extract direct fields
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
