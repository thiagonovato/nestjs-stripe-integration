import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

import Stripe from 'stripe';
import { LinkPortalDto } from './dto/link-portal.dto';
const stripe = new Stripe('SUA_KEY', { apiVersion: '2022-11-15' });

const YOUR_DOMAIN = 'http://localhost:3000';

@Injectable()
export class PaymentService {
  async create(createPaymentDto: CreatePaymentDto) {
    const session = await stripe.checkout.sessions.create({
      customer_email: createPaymentDto.email,
      billing_address_collection: 'auto',
      line_items: [
        {
          price: createPaymentDto.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${YOUR_DOMAIN}/payment/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/payment/canceled?canceled=true&session_id={CHECKOUT_SESSION_ID}`,
    });

    // Aqui você salva no banco de dados a intensão de pagamento
    const intentPaymanet = {
      user: createPaymentDto.email,
      price: createPaymentDto.priceId,
      session: session.id,
      status: session.status,
    };

    return session.url;
  }

  async successPayment(sessionId: string) {
    /**
     * Aqui você consulta a session salva no banco quando foi gerado o link,
     * após é consultado o status atual e atualiza no banco conforme o novo status.
     *
     * Aqui também é possível implementar regras de negócio, como liberação de
     * funcionalidades, enviar notificação etc.
     */

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(
      '🚀 ~ file: payment.service.ts:51 ~ PaymentService ~ successPayment ~ session',
      session,
    );

    // Update no banco passando o novo status.

    return session;
  }

  async canceledPayment(sessionId: string) {
    /**
     * Aqui você consulta a session salva no banco quando foi gerado o link,
     * após é consultado o status atual e atualiza no banco conforme o novo status.
     *
     * Aqui também é possível implementar regras de negócio, como liberação de
     * funcionalidades etc.
     */
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Update no banco passando o novo status.

    return session;
  }

  async generateLinkPortal(dto: LinkPortalDto) {
    /**
     * Aqui você consulta a session salva no banco quando foi gerado o link,
     * após é consultado, é gerado um link a partir do customerId.
     */
    const session = await stripe.checkout.sessions.retrieve(dto.sessionId);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: session.customer.toString(),
      return_url: 'http://tnovato.com',
    });

    return portalSession.url;
  }
}
