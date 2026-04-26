from django.urls import path 
from . import views
 
urlpatterns = [ 
    path('', views.view_books, name='view_books'),
    path('create/', views.create_book, name ='create_book'),
    path('edit_book/<str:pk>/', views.edit_book, name='edit_book'),
    path('delete/<str:pk>/', views.delete_books, name ='delete_books'),
    path('api/token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register'), 
]
 