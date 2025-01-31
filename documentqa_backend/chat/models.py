from django.db import models
from django.contrib.auth.models import User
from documents.models import Document


class ChatHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name="chat_histories")
    query = models.TextField()
    response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat by {self.user.username} on {self.document.id} at {self.timestamp}"
