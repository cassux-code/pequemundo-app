import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  nombreUsuario: string = 'Mateo';
  rolUsuario: string = 'Alumno';

  onLogout(): void {
    this.isLoggedIn = false;
  }
}