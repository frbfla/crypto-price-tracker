import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.login(this.email, this.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/coin-list']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Falha no login. Tente novamente.';
          this.loading = false;
        }
      });
  }
}
