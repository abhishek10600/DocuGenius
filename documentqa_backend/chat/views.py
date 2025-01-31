import os
from dotenv import load_dotenv
import numpy as np
import openai
from pymongo import MongoClient
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from documents.models import Document
from .models import ChatHistory
from .serializers import ChatHistorySerializer
from django.shortcuts import get_object_or_404

load_dotenv()

client = MongoClient(os.getenv("MONGODB_CONNECTION_STRING"))
db = client["documentqa_saas"]
collection = db["papers"]


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def query_document(request, document_id):
    query = request.data["query"]
    document = Document.objects.get(id=document_id)

    # create query embedding
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    query_embedding = response.data[0].embedding

    search_pipeline = [
        {
            "$vectorSearch": {
                "index": "documentqa_papers_28125",
                "queryVector": query_embedding,
                "path": "embedding",
                "k": 3,
                "numCandidates": 100,
                "limit": 3,
                "filter": {
                    "document_id": document_id
                }
            },
        },

    ]

    results = list(collection.aggregate(search_pipeline))

    # print("results: ", results)
    # print("resuts-text: ", results["text"])

    if not results:
        data = {
            "user": request.user.id,
            "document": document.id,
            "query": query,
            "response": "Could not find the related informaton."
        }
        chat_history_serializer = ChatHistorySerializer(data=data, many=False)
        if chat_history_serializer.is_valid():
            chat_history_serializer.save()
            return Response({"success": True, "data": chat_history_serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "error_message": chat_history_serializer.error_messages}, status=status.HTTP_400_BAD_REQUEST)

    top_documents = [result["text"] for result in results]

    context = "\n\n".join(top_documents)

    answer = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            # {"role": "system", "content": "You are a helpful assistant with high intelligence. Your primary role is to read the documents and answer the questions from the user based on the knowledge you aquired from the document. Do not answer any question that is not related to the document and refuse to answer the question which is not related to the document politely."},
            # {"role": "user", "content": f"\n{context}\n\nQuestion:{query}\nAnswer:"}

            # PROMPT1
            {"role": "system", "content": """You are an advanced AI assistant trained to analyze documents and provide accurate, comprehensive, and contextually relevant answers based on the document's content. Your task is to help the user by understanding the uploaded document, which has been processed into embeddings, and answering any questions they may have related to its content.

            Here are your instructions:

            1. Understand Context: Use the document embeddings to thoroughly understand the content, including its structure, key points, and nuances.
            2. Answer Precisely: When the user asks a question, identify the most relevant information from the document to provide a clear, concise, and accurate response.
            3. Context Preservation: Maintain the context of the user's previous questions to provide coherent and consistent answers if they ask follow-up questions.
            4. Stay Document-Centric: Base all your answers strictly on the content of the document. If the user asks something outside the scope of the document, politely inform them that your answers are limited to the uploaded content.
            5. Clarity: Avoid technical jargon unless the user specifies otherwise. Provide explanations or elaborations if needed to make the answer understandable.
            Examples:

            1. If the document is a research paper and the user asks about the results or methodology, summarize the relevant section in detail.
            1. If the document is a legal agreement, answer questions about specific clauses or terms accurately.
            1. If the document is a manual or guide, explain the procedures or details based on the user's query.
            Always aim to provide helpful, relevant, and user-friendly answers, ensuring your responses are grounded in the document content."""},
            {"role": "user", "content": f"\n{context}\n\nQuestion:{query}\nAnswer:"}

            # PROMPT 2
            #             {"role": "system", "content": """"You are an AI document analysis assistant designed to provide accurate and detailed answers to user questions based on the content of a given document. Below are the steps to follow:

            # 1. Document Analysis: You are provided with an embedding of the document. Treat this embedding as your sole source of knowledge. Focus only on the information contained within the document. Do not infer beyond its content.

            # 2. Context Understanding: Before answering a question, thoroughly analyze the document's context to ensure your responses are relevant and accurate.

            # 3. Answer Format: Provide answers in clear, concise, and natural language. If the question asks for specifics, provide only the necessary details.

            # 4. Uncertainty: If the answer to a question is not explicitly found within the document, respond with: 'The document does not provide information on this topic.' Do not attempt to guess or provide fabricated responses.

            # 5. Citation: When applicable, refer to specific sections or content of the document to back your answer.

            # 6. Error Handling: If the question is ambiguous, vague, or lacks sufficient context, politely request clarification from the user.

            # 7. Out of Context Question: If the user asks a question that is not related to the document, politely decline to answer that question.

            # Sample Input:

            # Document: [Document content or embeddings]
            # Question: "What is the main topic discussed in the document?"
            # Sample Output:

            # "The main topic discussed in the document is [topic], as mentioned in [specific section/paragraph]."
            # Your role is to enhance the user's understanding of the document while maintaining precision and professionalism."""},
            #             {"role": "user", "content": f"\n{context}\n\nQuestion:{query}\nAnswer:"}
        ],
        temperature=0.2,
        max_tokens=500
    ).choices[0].message.content.strip()

    # save query and response
    data = {
        "user": request.user.id,
        "document": document.id,
        "query": query,
        "response": answer
    }
    chat_history_serializer = ChatHistorySerializer(data=data, many=False)
    if chat_history_serializer.is_valid():
        chat_history_serializer.save()
        return Response({"success": True, "data": chat_history_serializer.data}, status=status.HTTP_201_CREATED)
    else:
        return Response({"success": False, "error_message": chat_history_serializer.error_messages}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_older_chats(request, document_id):
    chat_history = ChatHistory.objects.filter(
        document_id=document_id, user_id=request.user.id)
    serializer = ChatHistorySerializer(chat_history, many=True)
    return Response({
        "success": True,
        "chat_history_data": serializer.data
    })
