import os
import openai
from dotenv import load_dotenv
from pymongo import MongoClient
from django.conf import settings
from .models import Document
from .helpers import split_text_to_chunks
from documentqa_backend.celery import app

load_dotenv()

client = MongoClient(os.getenv("MONGODB_CONNECTION_STRING"))
db = client["documentqa_saas"]
collection = db["papers"]


@app.task
def generate_embeddings(document_id):
    try:
        document = Document.objects.get(id=document_id)
        document.status = "processing"
        document.save()
        text = document.text_content
        text_chunks = split_text_to_chunks(text)
        for i, chunk in enumerate(text_chunks):
            # existing_doc = collection.find_one({"text": chunk})
            # if not existing_doc:
            #     response = openai.embeddings.create(
            #         model="text-embedding-3-small",
            #         input=chunk
            #     )
            #     embedding = response.data[0].embedding
            #     collection.insert_one({
            #         "text": chunk,
            #         "embedding": embedding,
            #         "document_id": document_id
            #     })
            response = openai.embeddings.create(
                model="text-embedding-3-small",
                input=chunk
            )
            embedding = response.data[0].embedding
            collection.insert_one({
                "text": chunk,
                "embedding": embedding,
                "document_id": document_id
            })
        document.status = "completed"
        document.save()
        return f"Embeddings for document {document_id} generated successfully."
    except Exception as e:
        document.status = "failed"
        document.save()
        return f"Error in generating embeddings for document {document_id}: {str(e)}"
