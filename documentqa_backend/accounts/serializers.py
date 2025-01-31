from rest_framework import serializers
from django.contrib.auth.models import User


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name",
                  "username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def validate_password(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                "Password must contain atleast 6 characters.")
        return value

    def save(self):
        if User.objects.filter(email=self.validated_data["email"]).exists():
            raise serializers.ValidationError(
                {"error": "User with this email already exists."})
        if User.objects.filter(username=self.validated_data["username"]).exists():
            raise serializers.ValidationError(
                {"error": "User with this username already exists."})
        account = User(
            first_name=self.validated_data["first_name"],
            last_name=self.validated_data["last_name"],
            email=self.validated_data["email"],
            username=self.validated_data["username"]
        )
        account.set_password(self.validated_data["password"])
        account.save()
        return account
