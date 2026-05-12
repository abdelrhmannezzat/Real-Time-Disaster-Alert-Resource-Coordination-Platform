import pika

from config.settings import settings


class RabbitMQClient:
    def __init__(self):
        self.params = pika.URLParameters(settings.RABBITMQ_URL)

    def get_channel(self):
        connection = pika.BlockingConnection(self.params)

        channel = connection.channel()

        return connection, channel
