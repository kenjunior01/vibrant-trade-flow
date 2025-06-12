from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('trader', 'Trader'),
        ('manager', 'Manager'),
        ('admin', 'Admin'),
        ('superadmin', 'Superadmin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='trader')

    def __str__(self):
        return f"{self.username} ({self.role})"

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = 'superadmin'
        super().save(*args, **kwargs)
