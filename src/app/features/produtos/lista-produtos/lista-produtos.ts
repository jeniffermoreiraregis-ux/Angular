import { Component, signal, computed, effect, inject } from '@angular/core';
import { Produto } from '../produto/produto';
import { ProdutosService } from '../produtos.service';

@Component({
  selector: 'app-lista-produtos',
  imports: [Produto],
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.css',
})
export class ListaProdutos {
  private produtoService = inject(ProdutosService);

  constructor() {

    this.carregarProdutos();

    effect(() => {
      console.log('Lista de produtos alterada:', this.produtos());
    });
    effect(() => {
      console.log('Valor total atualizado:', this.valorTotal());
    });
    effect(() => {
      if (typeof document !== 'undefined') {
        document.title = `(${this.totalProdutos()}) Minha Loja`;
      }
    });
  }

  carregarProdutos() {
    this.carregando.set(true);
    this.produtoService.buscarProdutos().subscribe({
        next: (dados) => {
          const produtos = this.produtoService.transformarProdutos
          (dados);
          this.produtos.set(produtos);
          this.carregando.set(false);
        },
        error: (erro) => {
          console.error('Erro ao carregar produtos:', erro);
          this.carregando.set(false);
        },
      });
  }

  produtoSelecionado = signal<string | null>(null);

  produtos = signal<{ nome: string; preco: number }[]>([]);

  carregando = signal(true);

  totalProdutos = computed(() => this.produtos().length);

  valorTotal = computed(() => {
    return this.produtos().reduce((total, item) => total + item.preco, 0);
  });

  carrinho = signal<{ nome: string; preco: number }[]>([]);

  quantidadeCarrinho = computed(() => this.carrinho().length);

  totalCarrinho = computed(() => {
    return this.carrinho().reduce((total, item) => total + item.preco, 0);
  });

  exibirProduto(nome: string) {
    this.produtoSelecionado.set(nome);
  }

  adicionarProduto() {
    this.produtos.update((listaAtual) => [...listaAtual, { nome: 'Teclado', preco: 250 }]);
  }

  substituirProdutos() {
    this.produtos.set([{ nome: 'Produtonovo', preco: 999 }]);
  }

  adicionarAoCarrinho(produto: { nome: string; preco: number }) {
    this.carrinho.update((listaAtual) => [...listaAtual, produto]);
  }
}
