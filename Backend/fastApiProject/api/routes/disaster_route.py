from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from config.database import get_db
from dependencies.auth import require_roles
from dependencies.disaster_dep import get_disaster_service
from model import User
from model.enums import UserRole
from schema.request.disaster_create_request import DisasterCreateRequest
from schema.response.disaster_create_response import DisasterCreateResponse
from schema.response.disaster_fetch_response import DisasterFetchResponse
from service.disaster_service import DisasterService

router = APIRouter()


@router.post(
    path='',
    status_code=status.HTTP_201_CREATED,
    response_model=DisasterCreateResponse
)
def create_disaster_manually(
        disaster: DisasterCreateRequest,
        disaster_service: DisasterService = Depends(get_disaster_service),
        db: Session = Depends(get_db),
        current_user: User = Depends(require_roles(UserRole.COORDINATOR))
):
    return disaster_service.create_disaster_manually(disaster, current_user.id, db)


@router.get(
    path='/{disaster_id}',
    status_code=status.HTTP_200_OK,
    response_model=DisasterFetchResponse
)
def get_disaster(
        disaster_id: int,
        disaster_service: DisasterService = Depends(get_disaster_service),
        db: Session = Depends(get_db),
        _: User = Depends(require_roles(UserRole.COORDINATOR))
):
    return disaster_service.get_disaster(disaster_id, db)
