from typing import Optional
from beanie import Document, PydanticObjectId as ObjectId
from pydantic import Field


class Review(Document):
    patient_id: ObjectId
    doctor_id: ObjectId
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str]
    angry: Optional[bool]
