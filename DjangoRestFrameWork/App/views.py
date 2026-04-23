from django.shortcuts import render, get_object_or_404
from .models import Book
from .serializers import BookSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET', 'POST'])
def create_book(request):
    if request.method == 'GET':
        return Response({"message": "Use POST to create a book."})
        
    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def edit_book(request,pk):
    if request.method == 'GET':
        return Response({"message": "Use PUT to edit a book."})
    book = get_object_or_404(Book, pk=pk)
    book.title = request.data.get('title', book.title)
    book.save()
    return Response({'id':book.id, 'author':book.author, 'title':book.title, 'year_released': book.year_released}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def view_books(request):
    books = Book.objects.all()
    serializedData = BookSerializer(books, many=True).data
    return Response(serializedData)


@api_view(['DELETE'])
def delete_books(request, pk):
    book = Book.objects.get(id=pk)
    book.delete()
    return Response("deleted", status=status.HTTP_200_OK)