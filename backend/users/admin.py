from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'username', 'phone', 'is_verified', 'is_staff']
    list_filter = ['is_verified', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('phone', 'address', 'is_verified', 'profile_image')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Extra Info', {'fields': ('email', 'phone', 'address')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)