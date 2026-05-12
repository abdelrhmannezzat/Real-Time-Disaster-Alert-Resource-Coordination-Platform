import json
import aio_pika
from config.settings import settings
from websocket.websocket_manager import manager


async def consume_disaster_events():

    connection = await aio_pika.connect_robust(settings.RABBITMQ_URL)

    channel = await connection.channel()

    exchange = await channel.declare_exchange(
        "disaster_exchange",
        aio_pika.ExchangeType.TOPIC,
        durable=True
    )

    queue = await channel.declare_queue(
        "notification_queue",
        durable=True
    )

    await queue.bind(exchange, routing_key="disaster.created")

    print("RabbitMQ consumer started")

    async with queue.iterator() as queue_iter:

        async for message in queue_iter:

            try:
                async with message.process():

                    event = json.loads(message.body)

                    print(event)

                    await manager.broadcast(event)

            except Exception as e:
                print("Consumer error:", e)
