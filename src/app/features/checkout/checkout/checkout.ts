import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { ItemCarrinho } from '../../../core/models/item-carrinho';

type PedidoFinalizado = {
  codigo: number;
  cliente: string;
  quantidadeItens: number;
  total: number;
  itens: ItemCarrinho[];
};

function nomeSemNumeros(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;
  if (/\d/.test(valor)) {
    return { numeroInvalido: true };
  }
  return null;
}

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  // Checkout usaa facade apenas para ler resumo, validar carrinho vazio e limpar após compra.
  carrinhoFacade = inject(CarrinhoFacade);
  pedidoFinalizado = signal<PedidoFinalizado | null>(null);
  formulario = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3), nomeSemNumeros]),
    email: new FormControl('', [Validators.required, Validators.email]),
    endereco: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });

  finalizar() {
    this.pedidoFinalizado.set(null);
    if (this.carrinhoFacade.carrinhoVazio()) {
      console.log('Nãoépossívelfinalizarumacompracom o carrinhovazio.');
      return;
    }
    if (this.formulario.invalid) {
      console.log('Formulárioinválido');
      this.formulario.markAllAsTouched();
      return;
    }

    const dados = this.formulario.value;
    const itens = this.carrinhoFacade.itens();
    const total = this.carrinhoFacade.total();
    const pedido: PedidoFinalizado = {
      codigo: Date.now(),
      cliente: dados.nome ?? '',
      quantidadeItens: itens.length,
      total,
      itens,
    };
    console.log('Comprafinalizadacom sucesso!');
    console.log('Pedido:', pedido);
    console.log('Dados do formulário:', dados);
    // Após finalizar, o carrinho global é limpo.
    this.carrinhoFacade.limparCarrinho();
    this.formulario.reset();
    this.pedidoFinalizado.set(pedido);
  }
}
