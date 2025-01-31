from django.urls import path, include
from .views import register_user, get_current_user, google_login
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [

    path("register/", register_user, name="register"),
    path("token/", TokenObtainPairView.as_view(), name="login"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="new_access_token"),
    path("current_user/", get_current_user, name="get_current_user"),
    path("google-login/", google_login, name="google_login")
]
