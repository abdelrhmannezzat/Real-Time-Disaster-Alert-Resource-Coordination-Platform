import json

from messaging.rabbitmq_client import RabbitMQClient

# Exchange name that matches the publisher's exchange name
EXCHANGE_NAME = "disaster_exchange"

# Queue that stores messages for this worker
QUEUE_NAME = "notification_queue"

# Listen only to this topic
ROUTING_KEY = "disaster.created"

# Create connection and open channel
client = RabbitMQClient()
connection, channel = client.get_channel()

# Create exchange if not existing
channel.exchange_declare(
    exchange=EXCHANGE_NAME,
    exchange_type="topic",
    durable=True
)

# Create queue if not existing
channel.queue_declare(
    queue=QUEUE_NAME,
    durable=True
)

# Connect queue to exchange.
# Any event with routing key disaster.created
# will be sent to this queue.
channel.queue_bind(
    exchange=EXCHANGE_NAME,
    queue=QUEUE_NAME,
    routing_key=ROUTING_KEY
)


print("Waiting for events...")


# Callback function runs whenever
# a message is received.
def callback(ch, method, properties, body):
    event = json.loads(body)

    print("Received event:")
    print(event)

    


# Register callback function
channel.basic_consume(
    queue=QUEUE_NAME,
    on_message_callback=callback,
    auto_ack=True  # Doesn't need ACKs
)


channel.start_consuming()
