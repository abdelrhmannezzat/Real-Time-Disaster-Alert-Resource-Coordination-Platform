import reverse_geocode
from fastapi import  HTTPException, status
from geoalchemy2 import WKTElement
from sqlalchemy.orm import Session

from model import Location
from model.enums import UserRole
from repository.interfaces.user_repo_interface import IUserRepository
from schema.request.location_create_request import LocationCreateRequest
from schema.request.user_login_request import UserLoginRequest
from schema.request.user_registration_request import UserRegistrationRequest
from schema.response.user_login_response import UserLoginResponse
from service.location_service import LocationService
from service.volunteer_profile_service import VolunteerProfileService
from utils.hashing import verify_password
from utils.jwt import create_access_token


class AuthService:
    def __init__(self,
                 user_repository: IUserRepository,
                 volunteer_profile_service: VolunteerProfileService,
                 location_service: LocationService,
                 db: Session
    ):
        self.user_repository = user_repository
        self.volunteer_profile_service = volunteer_profile_service
        self.db = db
        self.location_service = location_service

    def create_user(self, user: UserRegistrationRequest):
        if self.user_repository.get_user_by_email(user.email, self.db) is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already exists",
            )
        new_user = self.user_repository.add_user(user, self.db)

        try:
            if user.role == UserRole.VOLUNTEER:
                # Create location
                temp = reverse_geocode.search([(user.latitude, user.longitude)])
                city = temp[0].get('city')
                country = temp[0].get('country')

                loc = Location(
                    longitude=user.longitude,
                    latitude=user.latitude,
                    city=city,
                    country=country,
                    coordinates=WKTElement(f"POINT({user.longitude} {user.latitude})", srid=4326)
                )
                loc = self.location_service.create_location_no_commit(loc, self.db)
                # Create volunteer profile
                self.volunteer_profile_service.create_volunteer_profile(loc.id, new_user.id, self.db)
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e),
            )

        return new_user

    def user_login(self, user_request: UserLoginRequest):
        user = self.user_repository.get_user_by_email(user_request.email, self.db)
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

        payload = {'sub': user.email, 'role': user.role, 'user_id': user.id}

        user_res = UserLoginResponse(
            id=user.id,
            email=user.email,
            access_token=create_access_token(payload),
            type='bearer'
        )

        return user_res

