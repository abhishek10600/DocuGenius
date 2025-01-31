import os
from rest_framework.response import Response
from .models import Document
from .tasks import generate_embeddings
from .serializers import DocumentSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import PyPDF2


# upload document view
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_document(request):
    user = request.user
    file = request.FILES.get('file')

    # save the document
    document = Document(user=user, file=file)
    document.save()

    try:
        with open(document.file.path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            extracted_text = " ".join([page.extract_text()
                                      for page in reader.pages])
            cleaned_text = extracted_text.replace("\x00", "")
            document.text_content = cleaned_text
            document.save()
    except Exception as e:
        document.status = "failed"
        document.text_content = ""
        document.save()
        return Response({"success": False, "message": "Failed to process the document", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    generate_embeddings.delay(document.id)

    return Response({"success": True, "message": "Document Uploaded successfully"})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_document(request, document_id):
    try:
        document = Document.objects.get(id=document_id, user=request.user)
        file_path = document.file.path
        if os.path.exists(file_path):
            os.remove(file_path)
        document.delete()
        return Response({"success": True, "message": "Document deleted successfully"}, status=status.HTTP_200_OK)
    except Document.DoesNotExist:
        return Response({"message": "Document not found or you do not have the permission to delete this document."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_documents_by_user(request):
    documents = Document.objects.filter(user_id=request.user.id)
    serializer = DocumentSerializer(documents, many=True)
    return Response({"success": True, "document_data": serializer.data})
