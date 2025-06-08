from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from beanie import PydanticObjectId as ObjectId


class AppointmentSchema(BaseModel):
    doctor_id: ObjectId
    date: str
    status: Optional[str] = "pending"


class AppointmentResponseSchema(BaseModel):
    id: ObjectId
    patient_id: ObjectId
    patient_name: str
    date: str
    status: Optional[str] = "pending"

class PatientAppointmentResponseSchema(BaseModel):
    id: ObjectId
    patient_id: ObjectId
    patient_name: str
    doctor_id: ObjectId
    doctor_name: str
    date: str
    status: Optional[str] = "pending"


class AppointmentPatchSchema(BaseModel):
    status: Optional[str]
