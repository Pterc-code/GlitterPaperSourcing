from django.db import models
from django.utils.timezone import now
from products.models import Product 
from django.conf import settings

class RFQ_Form(models.Model):
    rfq_number = models.CharField(max_length=100, unique=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='forms')
    creation_date = models.DateField(auto_now_add=True)
    closing_date = models.DateField(null=True, blank=True)
    sourcing_status = models.BooleanField(default=True)
    pdf_file = models.FileField(upload_to='pdfs/', null=True, blank=True)
    remarks = models.TextField(blank=True)


    def save(self, *args, **kwargs):
        if not self.rfq_number:
            today_str = now().strftime('%Y%m%d')
            base_rfq = f"RFQ-{today_str}"
            count = RFQ_Form.objects.filter(rfq_number__startswith=base_rfq).count() + 1
            self.rfq_number = f"{base_rfq}-{count:03d}"
        super().save(*args, **kwargs)

class FormHeader(models.Model):
    rfq_form = models.ForeignKey(RFQ_Form, on_delete=models.CASCADE, related_name='headers')
    name = models.CharField(max_length=100)
    is_fixed = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

class FormRowTemplate(models.Model):
    rfq_form = models.ForeignKey(RFQ_Form, on_delete=models.CASCADE, related_name='row_templates')
    data = models.JSONField() 
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

class FormRowResponse(models.Model):
    row_template = models.ForeignKey(FormRowTemplate, on_delete=models.CASCADE, related_name='responses')
    supplier_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    data = models.JSONField()  
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('row_template', 'supplier_user') 