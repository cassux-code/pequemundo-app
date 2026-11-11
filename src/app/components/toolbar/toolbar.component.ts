import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
