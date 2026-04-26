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
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_tokens = tokens['access']
            refresh_tokens = tokens['refresh']
            
            res = Response()

            res.data = {"success": True}
            
            res.set_cookie(
                key = "access_tokens",
                value = access_tokens,
                httponly = True, 
                secure = True,
                samesite = 'None',
                path = "/"
            )
            
            res.set_cookie(
                key = "refresh_tokens",
                value = refresh_tokens,
                httponly = True,
                secure = True,
                samesite = 'None',
                path = "/"
            )
            return res

        except:
            return Response({"success":False})

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_tokens')
            request.data['refresh'] = refresh_token
            
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_tokens = tokens['access']
            res = Response()
            res.data = {'refreshed':True}
            
            res.set_cookie(
                key="access_tokens",
                value=access_tokens,
                httponly=True,
                secure=True,
                samesite='None',
                path="/"
            )
            return res

        except:
            return Response({"refreshed": False})


@api_view(['POST'])
def logout(request):
    try:
        res = Response()
        res.data = {"success": True}
        res.delete_cookie('access_tokens', path="/", samesite='None')
        res.delete_cookie('refresh_tokens', path="/", samesite='None')
        return res
    except:
        return Response({"success": False})

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"success": True, "user": UserSerializer(user).data})
        return Response({"success": False, "errors": serializer.errors})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_books(request):
    print(request.headers)
    user = request.user
    books = Book.objects.filter(author=user)
    serializedData = BookSerializer(books, many=True).data
    return Response(serializedData)

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
    serializer = BookSerializer(book, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save() 
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['DELETE'])
def delete_books(request, pk):
    book = get_object_or_404(Book, pk=pk, author=request.user)
    book.delete()
    return Response("deleted", status=status.HTTP_200_OK)