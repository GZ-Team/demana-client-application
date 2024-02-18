import ContextService from './contextService'

import useLogger from '../utils/loggerUtils'
import { pushEventToProcess } from '../utils/eventUtils'

import type { Channel, ConsumeMessage } from 'amqplib'
import type { Logger } from 'winston'
import type RabbitAmqpClient from '../clients/rabbitAmqpClient'
import type { DemanaService } from '../types'

export default class TicketService implements DemanaService {
    private logger: Logger

    private amqpTicketChannel: Channel | null = null

    constructor() {
        this.logger = useLogger({ service: 'ticket-service' }).logger
    }

    async startListeningForNewTickets(): Promise<void> {
        this.amqpTicketChannel = await ContextService.instance.getClientByName<RabbitAmqpClient>('amqp').registerQueueChannel('tickets')

        await this.amqpTicketChannel.consume('tickets', (message: ConsumeMessage | null): void => {
            this.logger.info('Received a new ticket event!')

            if (message != null) {
                this.logger.info('Processing the message...')
                console.log('Received a new print event', { message })

                message = {
                    ...message,
                    content: JSON.parse(new TextDecoder().decode(message.content))
                }

                pushEventToProcess({name: '@orders:new', value: Buffer.from(message.content.body)}, ContextService.instance.getProcessByName('worker'))

                this.amqpTicketChannel!.ack(message)
            } else {
                this.logger.error('The message was cancelled by the AMQP service.')
            }
        })
    }
}
