import type { Channel, Connection } from 'amqplib'
import amqp from 'amqplib'

import useLogger from '../utils/loggerUtils'
import type { Logger } from 'winston'
import type { DemanaClient } from '../types'

type RabbitAmqpClientQueueName = 'tickets'

type RabbitAmqpClientConnectionOptions = {
    connection: {
        host: string
        port: string
        username: string
        password: string
    }
}

export default class RabbitAmqpClient implements DemanaClient {
    private logger: Logger

    private channels: Channel[] = []

    private amqpConnection: Connection | null = null

    constructor() {
        this.logger = useLogger({ service: 'RabbitAmqpClient' }).logger
    }

    private async createChannel(): Promise<Channel> {
        try {
            if (!this.amqpConnection) {
                throw new Error('not connected to the AMQP service.')
            }

            return await this.amqpConnection.createChannel()
        } catch (exception) {
            throw new Error(`Failed to create a new channel: ${(exception as Error).message}`, { cause: exception })
        }
    }

    async connect(options: RabbitAmqpClientConnectionOptions): Promise<this> {
        const { host, port, username, password } = options.connection

        this.amqpConnection = await amqp.connect({
            hostname: host,
            port,
            username,
            password
        })

        this.logger.info('Connected to the AMQP service!')

        return this
    }

    async registerQueueChannel(queueName: RabbitAmqpClientQueueName): Promise<Channel> {
        try {
            const channel = await this.createChannel()
            await channel.assertQueue(queueName)

            this.channels.push(channel)

            this.logger.info(`Created a queue channel with the name '${queueName}'.`)

            return channel
        } catch (exception) {
            throw new Error(`Failed to register a new queue channel: ${(exception as Error).message}`, { cause: exception })
        }
    }

    async closeAllQueueChannels(): Promise<void> {
        await Promise.all(this.channels.map(channel => channel.close()))
        this.logger.info('All channels are closed.')
    }
}
