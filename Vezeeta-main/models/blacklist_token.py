from typing import Annotated
from beanie import Document, Indexed

from datetime import datetime, timedelta
from config import JWT_TOKEN_EXPIRY
import pymongo


class BlacklistToken(Document):
    token: Annotated[str, Indexed(unique=True)]
    expiry: datetime

    model_config = {
        "collection": "blacklist",
        "indexes": lambda: [
            pymongo.IndexModel(
                [("expiry", pymongo.ASCENDING)],
                expireAfterSeconds=int(
                    timedelta(hours=JWT_TOKEN_EXPIRY).total_seconds()
                ),
            ),
        ],
    }
