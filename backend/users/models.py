from django.contrib.auth.models import AbstractUser
from django.db import models
import random
import string

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)

    # ← These 2 lines fix the clash error
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def generate_verification_code(self):
        code = ''.join(random.choices(string.digits, k=6))
        self.verification_code = code
        self.save()
        return code

    def __str__(self):
        return self.email