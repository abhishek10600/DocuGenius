from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def api_test(request):
    return Response({"success": True, "message": "Api is working."})
