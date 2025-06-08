from typing import Annotated
from beanie import Document, Indexed, PydanticObjectId as ObjectId

from pydantic import Field
from datetime import datetime

from schemas.user import DoctorSchema


class RoleRequest(Document):
    requester_id: Annotated[ObjectId, Indexed()]
    request_date: datetime = Field(default_factory=lambda: datetime.now())
    doctor_data: DoctorSchema

    request_message: str
