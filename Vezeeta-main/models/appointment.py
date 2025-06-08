from beanie import Document, PydanticObjectId as ObjectId
from pydantic import Field


class AppointmentModel(Document):
    patient_id: ObjectId
    doctor_id: ObjectId
    date: str
    status: str = Field(default="pending")  # are you retarded ?
