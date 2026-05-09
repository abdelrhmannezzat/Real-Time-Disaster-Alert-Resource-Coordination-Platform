from fastapi import APIRouter, Depends
from starlette import status

from schema.request.user_login_request import UserLoginRequest
from schema.request.user_registration_request import UserRegistrationRequest
from schema.response.user_login_response import UserLoginResponse
from schema.response.user_registration_response import UserRegistrationResponse
from service.auth_service import AuthService

router = APIRouter()


@router.post(
    '/register',
    response_model=UserRegistrationResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(user: UserRegistrationRequest, auth_service: AuthService = Depends(AuthService)):
    return auth_service.create_user(user)


@router.post(
    '/login',
    response_model=UserLoginResponse,
    status_code=status.HTTP_200_OK
)
def user_login(user: UserLoginRequest, auth_service: AuthService = Depends(AuthService)):
    return auth_service.user_login(user)
