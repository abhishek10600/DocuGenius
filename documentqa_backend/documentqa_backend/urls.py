from django.contrib import admin
from django.urls import path, include
from .views import api_test

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api-test/", api_test, name="api_test"),
    path("api/accounts/", include('accounts.urls')),
    path("api/documents/", include('documents.urls')),
    path("api/chats/", include("chat.urls"))
]
