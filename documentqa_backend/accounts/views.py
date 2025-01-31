from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .serializers import RegisterUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.models import User
import os
from dotenv import load_dotenv

load_dotenv()


@api_view(["POST"])
def register_user(request):
    if request.method == "POST":
        serializer = RegisterUserSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            account = serializer.save()
            data["response_message"] = "Account created successfully."
            data["first_name"] = account.first_name
            data["last_name"] = account.last_name
            data["username"] = account.username
            data["email"] = account.email
            refresh = RefreshToken.for_user(account)
            data["token"] = {
                "refresh_token": str(refresh),
                "access_token": str(refresh.access_token)
            }
        else:
            data = serializer.errors
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        return Response(data)


@api_view(["GET"])
def get_current_user(request):
    data = {}
    try:
        data["username"] = request.user.username
        data["email"] = request.user.email
        data["is_staff"] = request.user.is_staff
        return Response(data)
    except Exception as e:
        return Response({"message": "No logged in user found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
def google_login(request):
    token = request.data.get("token")
    if not token:
        return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        # Verify the Google ID token
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), os.getenv("GOOGLE_CLIENT_ID"))

        # Extract user information from Google token
        email = idinfo.get("email")
        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")

        # Use defaults or fallback for required fields
        if not last_name:
            last_name = "N/A"

        # Check if user with then given email already exists
        user, created = User.objects.get_or_create(email=email, defaults={
            "username": email.split("@")[0],
            "first_name": first_name,
            "last_name": last_name
        })

        # generate JWT tokens for the user
        refresh = RefreshToken.for_user(user)
        tokens = {
            "refresh_token": str(refresh),
            "access_token": str(refresh.access_token),
        }

        response_data = {
            "response_message": "Login successful.",
            "username": user.username,
            "email": user.email,
            "tokens": tokens
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except ValueError as e:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
