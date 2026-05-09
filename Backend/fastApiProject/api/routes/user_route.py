from fastapi import APIRouter, Depends
from starlette import status

from dependencies.auth import require_roles
from model import User
from model.enums import UserRole
from service.user_service import UserService

router = APIRouter()


@router.patch(
    '/{user_id}/activate',
    status_code=status.HTTP_204_NO_CONTENT
)
def activate_user(
        user_id: int,
        user_service: UserService = Depends(UserService),
        _: User = Depends(require_roles(UserRole.ADMIN))
):
    user_service.activate_user(user_id)


@router.patch(
    '/{user_id}/deactivate',
    status_code=status.HTTP_204_NO_CONTENT
)
def deactivate_user(
        user_id: int,
        user_service: UserService = Depends(UserService),
        _: User = Depends(require_roles(UserRole.ADMIN))
):
    user_service.deactivate_user(user_id)


