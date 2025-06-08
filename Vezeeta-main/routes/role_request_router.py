from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from beanie import PydanticObjectId as ObjectId
from core.exceptions import NotFoundException
from schemas.role_request import RoleRequestResponseSchema, RoleRequestSchema
from models.user import DoctorModel, UserModel
from models.role_request import RoleRequest
from core.security import get_current_user_instance, RoleChecker

router = APIRouter()


@router.post("", response_model=RoleRequest)
async def make_request(
    request: RoleRequestSchema,
    current_user: UserModel = Depends(get_current_user_instance),
):
    role_request = RoleRequest(
        **request.model_dump(exclude={"requester_id"}),
        request_date=datetime.now(),
        requester_id=current_user.id,
    )

    return await role_request.insert()


@router.get("", response_model=list[RoleRequestResponseSchema])
async def get_all_requests():
    final_requests = []
    role_requests = await RoleRequest.find().to_list()

    for request in role_requests:
        user = await UserModel.get(request.requester_id)
        final_requests.append(
            RoleRequestResponseSchema(
                **request.model_dump(),
                requester_name=f"{user.first_name} {user.last_name}",
            )
        )

    return final_requests


@router.put("/approve/{request_id}", response_model=dict)
async def approve_request(
    request_id: ObjectId,
    authorized: bool = Depends(RoleChecker(["admin"])),
):
    request = await RoleRequest.get(request_id)
    if request is None:
        raise HTTPException(404, "Request not found")

    user_to_update = await UserModel.get(ObjectId(request.requester_id))
    if not user_to_update:
        raise NotFoundException("User not found")

    user_to_update.role = "doctor"
    user_to_update.doctor_information = DoctorModel(**request.doctor_data.model_dump())

    await user_to_update.save()

    await RoleRequest.delete(request)
    return {"message": "Request approved"}


@router.put("/deny/{request_id}", response_model=dict)
async def deny_request(
    request_id: ObjectId,
    authorized: bool = Depends(RoleChecker(["admin"])),
):
    request = await RoleRequest.get(request_id)
    if request is None:
        raise HTTPException(404, "Request not found")
    await RoleRequest.delete(request)
    return {"message": "Request denied"}
