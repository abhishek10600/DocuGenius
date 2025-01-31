from django.urls import path
from .views import query_document, get_older_chats

urlpatterns = [
    path("query/<int:document_id>/", query_document, name="query_document"),
    path("chat_history/<int:document_id>/",
         get_older_chats, name="get_older_chats")
]
