from fastapi import APIRouter, HTTPException
from beanie import PydanticObjectId as ObjectId
from models.user import UserModel
from schemas.user import DoctorUserResponse

router = APIRouter()

@router.get("/", response_model=list[DoctorUserResponse])
async def get_all_doctors():
    doctors = await UserModel.find(UserModel.role == "doctor").to_list()
    return [DoctorUserResponse(**doctor.model_dump()) for doctor in doctors]


@router.get("/{doctor_id}", response_model=DoctorUserResponse)
async def get_doctor_by_id(doctor_id: str):
    doctor = await UserModel.get(ObjectId(doctor_id))
    if not doctor or doctor.role != "doctor":
        raise HTTPException(status_code=404, detail="Doctor not found")

    return DoctorUserResponse(**doctor.model_dump())
