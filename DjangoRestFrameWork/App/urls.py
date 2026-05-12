from django.urls import path 
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
 
urlpatterns = [ 
    path('books/', views.view_books, name='view_books'),
    path('books/create/', views.create_book, name='create_book'),
    path('books/<int:pk>/edit/', views.edit_book, name='edit_book'),
    path('books/<int:pk>/delete/', views.delete_books, name='delete_books'),
    
    path('api/token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register'), 
]

 