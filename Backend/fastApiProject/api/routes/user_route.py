from fastapi import APIRouter, Depends
from starlette import status

from service.user_service import UserService

router = APIRouter()


@router.patch(
    '/{user_id}/activate',
    status_code=status.HTTP_204_NO_CONTENT
)
def activate_user(user_id: int, user_service: UserService = Depends(UserService)):
    user_service.activate_user(user_id)


