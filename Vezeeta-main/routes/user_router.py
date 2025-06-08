from typing import Dict
from fastapi import APIRouter, Depends
from core.exceptions import InvalidCredentialsException, DuplicateCredentialsException, NotFoundException, HTTPException
from models.user import UserModel, DoctorModel
from schemas.user import UserSchema, UserResponse, LoginUserSchema, DoctorSchema
from beanie import PydanticObjectId as ObjectId

from core.security import (
    OAUTH2_SCHEME,
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_user_instance,
    get_password_hash,
    add_token_to_blacklist,
    verify_token_contents,
)

router = APIRouter()

# add sth status of doctor request that an admin accept to switch man to doctor
# TODO: add rating thingy for doctors that takes 
@router.post("/register", response_model=UserResponse)
async def register_user(
    user: UserSchema,
):
    user_instance = UserModel(
        **user.model_dump(),
        hashed_password=get_password_hash(user.password.get_secret_value())
    )
    existing_user = await UserModel.find_one(UserModel.email == user.email)
    if existing_user:
        raise DuplicateCredentialsException()

    await UserModel.insert_one(user_instance)
    token = create_access_token(user_instance)
    return UserResponse(token=token, **user_instance.model_dump())


@router.post("/login", response_model=UserResponse)
async def login_user(user_input: LoginUserSchema):
    user_instance = await authenticate_user(
        user_input.email, user_input.password.get_secret_value()
    )
    if user_instance is None:
        raise InvalidCredentialsException()

    token = create_access_token(user_instance)
    return UserResponse(token=token, **user_instance.model_dump())


@router.post("/logout", response_model=Dict[str, str])
async def logout_user(
    user_instance: UserModel = Depends(get_current_user_instance),
    token: str = Depends(OAUTH2_SCHEME),
):
    await add_token_to_blacklist(token)
    return {"message": "Successfully logged out"}


@router.get("/", response_model=UserResponse)
async def current_user(
    current_user: UserResponse = Depends(get_current_user),
):
    return current_user


@router.get("/verify-token", response_model=Dict[str, bool])
async def verify_token(token: str, role: str):
    try:
        result = await verify_token_contents(token, role)
        return {"status": result}
    except Exception as _:
        return {"status": False}
    
@router.put("/{user_id}/make-doctor", response_model=UserResponse)
async def make_user_doctor(
    user_id: str,
    doctor_data: DoctorSchema,
    user_instance: UserModel = Depends(get_current_user_instance),
):
    user_to_update = await UserModel.get(ObjectId(user_id))
    if not user_to_update:
        raise NotFoundException("User not found")

    user_to_update.role = "doctor"
    user_to_update.doctor_information = DoctorModel(**doctor_data.dict())
    
    await user_to_update.save()
    
    token = create_access_token(user_to_update)
    return UserResponse(token=token, **user_to_update.model_dump())
