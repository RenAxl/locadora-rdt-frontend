import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = '';
  loading: boolean = false;
  submitted: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  requestReset(form: NgForm): void {
    if (this.loading) return;

    if (!form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.submitted = false;

    this.authService
      .forgotPassword(this.email)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.submitted = true;
        },
        error: () => {
          this.submitted = true;
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/auth/login']); 
  }
}
