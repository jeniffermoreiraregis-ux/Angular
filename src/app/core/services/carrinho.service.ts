import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, signal, inject, computed } from '@angular/core';
import { ItemCarrinho } from '../models/item-carrinho';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  // PLATFORM_ID permite verificar se o código está rodando no navegador.
  // Isso evita erro com localStorage em ambientes que não possuem browser.
  private platformId = inject(PLATFORM_ID);

  // Chave única usada para salvar e recuperar o carrinho no localStorage.
  private readonly chaveStorage = 'minha-loja-carrinho';

  // O carrinho inicia tentando recuperar os dados salvos no navegador.
  private carrinho = signal<ItemCarrinho[]>(this.carregarCarrinhoSalvo());

  // SELECTORS
  itens = computed(() => this.carrinho());
  quantidade = computed(() => this.carrinho().length);
  total = computed(() => this.carrinho().reduce((total, item) => total + item.preco, 0));
  carrinhoVazio = computed(() => this.carrinho().length === 0);

  constructor() {
    // Sempre que o carrinho mudar, a lista atualizada será persistida.
    effect(() => {
      this.salvarCarrinho(this.carrinho());
    });
  }

  // ACTIONS
  adicionar(produto: ItemCarrinho) {
    this.carrinho.update((lista) => [...lista, produto]);
  }

  // Remove um item específicopeloíndice.
  removerPorIndice(indice: number) {
    this.carrinho.update((listaAtual) => listaAtual.filter((_, index) => index !== indice));
  }

  limpar() {
    this.carrinho.set([]);
  }

  // Método auxiliar para impedir uso de localStorage fora do navegador.
  private estaNoNavegador(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  // Recupera o carrinho salvo, se existir.
  private carregarCarrinhoSalvo(): ItemCarrinho[] {
    if (!this.estaNoNavegador()) {
      return [];
    }
    const dadosSalvos = localStorage.getItem(this.chaveStorage);
    if (!dadosSalvos) {
      return [];
    }
    try {
      return JSON.parse(dadosSalvos) as ItemCarrinho[];
    } catch {
      return [];
    }
  }
  // Salva o carrinho atualizado no navegador.
  private salvarCarrinho(itens: ItemCarrinho[]) {
    if (!this.estaNoNavegador()) {
      return;
    }
    localStorage.setItem(this.chaveStorage, JSON.stringify(itens));
  }
}
