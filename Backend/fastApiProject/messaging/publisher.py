import json
import pika
from config.settings import settings


def publish_message(payload: dict, queue_name: str = "notification_queue"):
    connection = pika.BlockingConnection(
        pika.URLParameters(settings.RABBITMQ_URL)
    )
    channel = connection.channel()

    channel.basic_publish(
        exchange="",
        routing_key=queue_name,
        body=json.dumps(payload),
        properties=pika.BasicProperties(
            content_type="application/json",
            delivery_mode=2,  # makes the message persistent (survives broker restart)
        ),
    )

    connection.close()