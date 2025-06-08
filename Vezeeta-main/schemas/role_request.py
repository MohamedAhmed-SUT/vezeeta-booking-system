from datetime import datetime
from pydantic import BaseModel

from schemas.user import DoctorSchema
from beanie import PydanticObjectId as ObjectId


class RoleRequestSchema(BaseModel):
    request_message: str
    doctor_data: DoctorSchema


class RoleRequestResponseSchema(BaseModel):
    id: ObjectId
    requester_id: ObjectId
    requester_name: str
    request_date: datetime
    doctor_data: DoctorSchema
    request_message: str
