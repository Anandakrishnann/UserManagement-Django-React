from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomUserSerializer
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CustomUserSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from PIL import Image
from io import BytesIO
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.

User = get_user_model()

class SignupView(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400) 

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)

            if user.check_password(password):
                if not user.is_active:
                    return Response({'error': 'Your account has been blocked.'}, status=status.HTTP_403_FORBIDDEN)

                refresh = RefreshToken.for_user(user)
                print(refresh)
                return Response({
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'phone_number':user.phone_number,
                        'is_admin': user.is_admin,
                    },
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        


class ListUsers(APIView):
    def get(self, request):

        users = User.objects.filter(is_admin=False)

        serializer = CustomUserSerializer(users, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteUser(APIView):
    def post(self, request, id):

        user = get_object_or_404(User, id=id)

        user.is_active = False
        user.save()

        users = User.objects.filter(is_admin=False)

        serializer = CustomUserSerializer(users, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class RestoreUser(APIView):
    def post(self, request, id):

        user = get_object_or_404(User, id=id)

        user.is_active = True
        user.save()

        users = User.objects.filter(is_admin = False)

        serializer = CustomUserSerializer(users, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class EditUser(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def put(self, request, id):
        try:
            user = User.objects.get(id=id) 
            serializer = CustomUserSerializer(user, data=request.data, partial=True) 

            if serializer.is_valid(): 
                serializer.save()  
                return Response(serializer.data)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
        
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
class CreateUser(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400) 


class UploadProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        email = request.user
        user = CustomUser.objects.get(email=email)

        file = request.FILES.get('profile_picture')

        if not file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Open image using Pillow
            image = Image.open(file)
            image_format = image.format.lower()

            # Validate the image format (only allow PNG or JPG)
            if image_format not in ['jpeg', 'png']:
                return Response({'error': 'File must be a PNG or JPG image'}, status=status.HTTP_400_BAD_REQUEST)

        except IOError:
            return Response({'error': 'Invalid image file'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user already has a profile
        try:
            profile = UserProfile.objects.get(user=user)
            profile.profile_picture = file
            profile.save()
            return Response({'message': 'Profile picture updated successfully'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            # If no profile exists, create a new one
            picture = UserProfile.objects.create(user=user, profile_picture=file)
            return Response({'message': 'Profile picture uploaded successfully'}, status=status.HTTP_200_OK)



class UserProfilePicture(APIView):
    def get(self, request):
        try:
            email = request.user.email
            user = CustomUser.objects.get(email=email)
            profile = UserProfile.objects.get(user=user)
            
            if profile.profile_picture:
                picture_url = request.build_absolute_uri(profile.profile_picture.url)
                return Response(
                    {'profile_picture': picture_url, 'message': 'Profile picture fetched successfully'},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'profile_picture': None, 'message': 'No profile picture available'},
                    status=status.HTTP_200_OK
                )
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(str(e))
            return Response({'error': 'An error occurred while fetching profile picture'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
