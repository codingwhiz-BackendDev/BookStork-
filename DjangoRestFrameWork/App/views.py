from django.shortcuts import render, get_object_or_404
from .models import Book
from .serializers import BookSerializer, UserRegistrationSerializer, UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status 
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
) 

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        return Response({
            "access": response.data["access"],
            "refresh": response.data["refresh"],
        })

@api_view(['POST'])
def logout(request):
    return Response({"success": True})


# =======================
# REGISTER
# =======================
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "success": True,
            "user": UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)
    return Response({
        "success": False,
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


# =======================
# BOOKS
# =======================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_books(request):
    user = request.user
    books = Book.objects.filter(author=user)
    serializedData = BookSerializer(books, many=True).data
    return Response(serializedData)


@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def create_book(request):
    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_book(request, pk):
    book = get_object_or_404(Book, pk=pk, author=request.user)
    serializer = BookSerializer(book, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_books(request, pk):
    book = get_object_or_404(Book, pk=pk, author=request.user)
    book.delete()
    return Response({"message": "deleted"}, status=status.HTTP_200_OK)