# Generated by Django 5.2.1 on 2025-05-26 03:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_alter_user_managers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(blank=True, choices=[('supplier', 'Supplier'), ('staff', 'Staff'), ('admin', 'Admin')], default=None, max_length=10, null=True),
        ),
    ]
