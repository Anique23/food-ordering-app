from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import RegisterSerializer, UserSerializer
from django.core.mail import send_mail
from django.conf import settings


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            code = user.generate_verification_code()
            try:
                send_mail(
                    'Verify Your Email - Food App',
                    f'Your verification code is: {code}',
                    settings.EMAIL_HOST_USER,
                    [user.email],
                    fail_silently=True,
                )
            except:
                pass
            return Response({
                'message': 'Registration successful!',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        try:
            user = CustomUser.objects.get(email=email, verification_code=code)
            user.is_verified = True
            user.verification_code = ''
            user.save()
            return Response({'message': 'Email verified successfully!'})
        except CustomUser.DoesNotExist:
            return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user_obj = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)

        if not user_obj.check_password(password):
            return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)

        if not user_obj.is_active:
            return Response({'error': 'Account is not active'}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user_obj)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user_obj).data
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user