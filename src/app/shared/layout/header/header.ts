import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { AuthFacade } from '../../../core/facades/auth.facade';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private carrinhoFacade = inject(CarrinhoFacade);
  private authFacade = inject(AuthFacade);
  private router = inject(Router);
  quantidade = this.carrinhoFacade.quantidade;
  estaLogado = this.authFacade.estaLogado;
  usuarioAtual = this.authFacade.usuarioAtual;
  
  sair() {
    this.authFacade.sair();
    this.router.navigateByUrl('/login');
  }
}
