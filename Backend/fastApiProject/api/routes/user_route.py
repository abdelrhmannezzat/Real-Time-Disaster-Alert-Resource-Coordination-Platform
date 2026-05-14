from fastapi import APIRouter, Depends
from fastapi_pagination import Page
from starlette import status

from dependencies.auth import require_roles
from dependencies.user_dep import get_user_service
from model import User
from model.enums import UserRole
from schema.response.user_paginated_response import UserPaginatedResponse
from service.user_service import UserService

router = APIRouter()


@router.patch(
    '/{user_id}/activate',
    status_code=status.HTTP_204_NO_CONTENT
)
def activate_user(
        user_id: int,
        user_service: UserService = Depends(get_user_service),
        _: User = Depends(require_roles(UserRole.ADMIN))
):
    user_service.activate_user(user_id)


@router.patch(
    '/{user_id}/deactivate',
    status_code=status.HTTP_204_NO_CONTENT
)
def deactivate_user(
        user_id: int,
        user_service: UserService = Depends(get_user_service),
        _: User = Depends(require_roles(UserRole.ADMIN))
):
    user_service.deactivate_user(user_id)


@router.get(
    '',
    status_code=status.HTTP_200_OK,
    response_model=Page[UserPaginatedResponse]
)
def get_users(
        user_service: UserService = Depends(get_user_service),
        _: User = Depends(require_roles(UserRole.ADMIN))
):
    return user_service.get_users()

