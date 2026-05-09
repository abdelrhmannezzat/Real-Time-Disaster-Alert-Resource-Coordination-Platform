from fastapi import APIRouter, status, Depends

from dependencies.auth import require_roles
from model import User
from model.enums import UserRole
from schema.request.disaster_create_request import DisasterCreateRequest
from schema.response.disaster_create_response import DisasterCreateResponse
from service.disaster_service import DisasterService

router = APIRouter()


@router.post(
    path='',
    status_code=status.HTTP_201_CREATED,
    response_model=DisasterCreateResponse
)
def create_disaster_manually(
        disaster: DisasterCreateRequest,
        disaster_service: DisasterService = Depends(DisasterService),
        current_user: User = Depends(require_roles(UserRole.COORDINATOR))
):
    return disaster_service.create_disaster_manually(disaster, current_user.id)
