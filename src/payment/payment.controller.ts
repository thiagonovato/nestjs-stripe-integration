import { Controller, Get, Post, Body, Query, Redirect } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { LinkPortalDto } from './dto/link-portal.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  /**
   * Quando o usuário clicar no botão do frontend, vai acionar essa rota
   * passando os parâmetros contidos no createPaymentDto.
   *
   * Este método vai criar uma session e redirecionar o usuário
   * para o stripe a fim de realizar o pagamento.
   */
  @Post()
  @Redirect('https://docs.nestjs.com', 302)
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const url = await this.paymentService.create(createPaymentDto);

    return { url };
  }

  /**
   * Quando o pagamento é realizado com sucesso, é chamado esta rota de success.
   * Esta rota vai capturar o ID da sessão, consultar na tabela para identificar
   * essa session, consulta no stripe o status atual dessa session e atualiza
   * no banco conforme o último status.
   *
   * Ao final, redireciona para uma url desejada.
   */
  @Get('success')
  @Redirect('https://docs.nestjs.com', 302)
  async paymentSuccess(@Query() query: any) {
    await this.paymentService.successPayment(query.session_id);
    return { url: 'https://tnovato.com' };
  }
  /**
   * Quando o usuário clica no botão de cancelar (voltar), é chamado essa rota
   * de canceled.
   *
   * A regra de negócio varia de projeto para projeto. Mas aqui por exemplo eu
   * posso capturar o sessionId, consultar a session no banco de dados e atualizar
   * seu status para cancelado.
   *
   * Ao final, também é possível redirecionar para uma url do sistema, seja estático
   * ou dinâmico.
   */
  @Get('canceled')
  @Redirect('https://tnovato.com', 302)
  async paymentCanceled(@Query() query: any) {
    return this.paymentService.canceledPayment(query.session_id);
  }

  /**
   * Esta rota recebe o sessionId para gerar o link do portal. Este portal
   * é o responsável pelo gerenciamento da parte financeira, tendo opções de
   * cancelar o plano atual, trocar método de pagamento (cartão), ver todas
   * as cobranças já realizadas etc.
   *
   * O ideal é que seja passado como parâmetro o customerId, onde esse cliente
   * deve ter sido cadastrado anteriormente. Mas a partir da sessionId, é possível
   * recuperar o customerId também.
   */
  @Post('portal')
  @Redirect('https://tnovato.com', 302)
  async generateLinkPortal(@Body() linkPortalDto: LinkPortalDto) {
    const url = await this.paymentService.generateLinkPortal(linkPortalDto);
    return { url };
  }
}
