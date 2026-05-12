import json

from messaging.rabbitmq_client import RabbitMQClient


class EventPublisher:
    # Exchange name acts like a router insider RabbitMQ
    # Producers publish message to the exchange,
    # then RabbitMQ routes them to the queue
    EXCHANGE_NAME = "disaster_exchange"

    def __init__(self):
        self.client = RabbitMQClient()

    def publish_disaster_created(self, payload: dict):
        # Open connection and channel
        connection, channel = self.client.get_channel()

        # Create exchange if it does not exist.
        # topic exchange allows routing using keys like:
        # disaster.created
        # disaster.updated
        channel.exchange_declare(
            exchange=self.EXCHANGE_NAME,
            exchange_type="topic",
            durable=True
        )

        # Publish message to RabbitMQ
        channel.basic_publish(
            exchange=self.EXCHANGE_NAME,
            routing_key="disaster.created",  # Routing key used by consumers
            body=json.dumps(payload, default=str),  # Convert python to json
            properties=None
        )

        connection.close()
