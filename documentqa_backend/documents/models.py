from django.db import models
from django.contrib.auth.models import User


class Document(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to="documents/uploaded_documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    text_content = models.TextField()
    status = models.CharField(max_length=20, default="pending")
