from fastapi import Depends, HTTPException, status

from repository.user_repo import UserRepository
from schema.request.user_login_request import UserLoginRequest
from schema.request.user_registration_request import UserRegistrationRequest
from schema.response.user_login_response import UserLoginResponse
from utils.hashing import hash_password, verify_password
from utils.jwt import create_access_token


class AuthService:
    def __init__(self, user_repository: UserRepository = Depends(UserRepository)):
        self.user_repository = user_repository

    def create_user(self, user: UserRegistrationRequest):
        if self.user_repository.get_user_by_email(user.email) is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already exists",
            )
        return self.user_repository.add_user(user)

    def user_login(self, user_request: UserLoginRequest):
        user = self.user_repository.get_user_by_email(user_request.email)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invalid email or password",
            )

        if not verify_password(user_request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not user.approved:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User is not approved"
            )

        payload = {'sub': user.email, 'role': user.role}

        user_res = UserLoginResponse(
            id=user.id,
            email=user.email,
            access_token=create_access_token(payload),
            type='bearer'
        )

        return user_res

