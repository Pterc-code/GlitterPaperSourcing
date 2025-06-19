from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordResetForm

User = get_user_model()

class EmailBasedPasswordResetForm(PasswordResetForm):
    def get_users(self, email):
        active_users = User._default_manager.filter(email__iexact=email, is_active=True)
        return (user for user in active_users if user.has_usable_password())