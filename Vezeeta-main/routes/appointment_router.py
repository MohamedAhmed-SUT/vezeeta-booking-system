from fastapi import APIRouter, Depends
from beanie import PydanticObjectId as ObjectId
from models.appointment import AppointmentModel
from schemas.appointment import (
    AppointmentSchema,
    AppointmentPatchSchema,
    AppointmentResponseSchema,
    PatientAppointmentResponseSchema,
)
from core.exceptions import NotFoundException, UnprocessableEntityException
from models.user import UserModel
from core.security import get_current_user_instance, RoleChecker

router = APIRouter()


# TODO pls use correct user instance and get id, ensuring role is correct
@router.post("/", response_model=AppointmentModel)
async def create_appointment(
    appointment: AppointmentSchema,
    user_instance: UserModel = Depends(get_current_user_instance),
    authorized: bool = Depends(RoleChecker(["patient"])),
):
    appointment_instance = AppointmentModel(
        **appointment.model_dump(), patient_id=user_instance.id
    )
    await appointment_instance.insert()
    return appointment_instance

@router.get("/by-patient", response_model=list[PatientAppointmentResponseSchema])
async def list_appointments_by_patient(
    user_instance: UserModel = Depends(get_current_user_instance),
    authorized: bool = Depends(RoleChecker(["patient"])),
):
    if not authorized:
        raise UnprocessableEntityException("Only patients can access this resource.")

    appointments = []
    appointment_models = await AppointmentModel.find(
        AppointmentModel.patient_id == user_instance.id
    ).to_list()

    for appointment in appointment_models:
        doctor = await UserModel.get(appointment.doctor_id)
        if not doctor:
            continue
        appointments.append(
            PatientAppointmentResponseSchema(
                **appointment.model_dump(),
                patient_name=f"{user_instance.first_name} {user_instance.last_name}",
                doctor_name=f"{doctor.first_name} {doctor.last_name}",
            )
        )

    return appointments


@router.get("/{appointment_id}", response_model=AppointmentModel)
async def get_appointment(appointment_id: ObjectId):
    appointment = await AppointmentModel.get(appointment_id)
    if not appointment:
        raise NotFoundException("Appointment")
    return appointment


@router.get("/", response_model=list[AppointmentResponseSchema])
async def list_appointments(
    user_instance: UserModel = Depends(get_current_user_instance),
    authorized: bool = Depends(RoleChecker(["doctor", "admin",])),
):
    appointments = []
    appointment_models = await AppointmentModel.find(
        AppointmentModel.doctor_id == user_instance.id
    ).to_list()
    for appointment in appointment_models:
        user = await UserModel.get(appointment.patient_id)
        if not user:
            continue
        appointments.append(
            AppointmentResponseSchema(
                **appointment.model_dump(),
                patient_name=f"{user.first_name} {user.last_name}",
            )
        )

    return appointments


@router.put("/{appointment_id}", response_model=AppointmentModel)
async def update_appointment(
    appointment_id: ObjectId, update_data: AppointmentPatchSchema
):
    appointment = await AppointmentModel.get(appointment_id)
    if not appointment:
        raise NotFoundException("Appointment")
    update_data_dict = update_data.dict(exclude_unset=True)
    for key, value in update_data_dict.items():
        setattr(appointment, key, value)
    await appointment.save()
    return appointment


@router.delete("/{appointment_id}", response_model=dict)
async def delete_appointment(appointment_id: ObjectId):
    appointment = await AppointmentModel.get(appointment_id)
    if not appointment:
        raise NotFoundException("Appointment")
    await appointment.delete()
    return {"message": "Appointment deleted successfully"}



