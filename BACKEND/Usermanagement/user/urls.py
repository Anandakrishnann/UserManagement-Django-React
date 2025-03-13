from django.urls import path, include
from .views import *

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', ListUsers.as_view(), name='list_users'),
    path('create/', CreateUser.as_view(), name='create'),
    path('delete/<int:id>/', DeleteUser.as_view(), name='delete-user'),
    path('restore/<int:id>/', RestoreUser.as_view(), name='restore-user'),
    path('edit/<int:id>/', EditUser.as_view(), name='edit-user'),
    path('upload-profile-picture/', UploadProfilePictureView.as_view(), name='upload-profile-picture'),
    path('profile-picture/', UserProfilePicture.as_view(), name='profile-picture'),
     path('update-profile/', EditUserProfileView.as_view(), name='edit-profile'),
]