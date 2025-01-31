from django.urls import path
from .views import upload_document, delete_document, get_documents_by_user

urlpatterns = [
    path("upload_documents/", upload_document, name="upload_document"),
    path("delete_document/<int:document_id>/",
         delete_document, name="delete_document"),
    path("user-documents/", get_documents_by_user, name="get_documents_by_user")
]
