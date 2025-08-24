import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-add-portfolio-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-portfolio-item.component.html',
  styleUrl: './add-portfolio-item.component.scss'
})
export class AddPortfolioItemComponent implements OnInit {
  portfolioForm: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private portfolioService: PortfolioService
  ) {
    this.portfolioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), this.noSpecialCharactersValidator]],
      symbol: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10), this.cryptoSymbolValidator]],
      quantity: ['', [Validators.required, this.positiveNumberValidator, this.minQuantityValidator]],
      purchasePrice: ['', [Validators.required, this.positiveNumberValidator, this.minPriceValidator]],
      totalValue: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    // Calcular valor total automaticamente
    this.portfolioForm.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateTotalValue();
    });
    
    this.portfolioForm.get('purchasePrice')?.valueChanges.subscribe(() => {
      this.calculateTotalValue();
    });
  }

  calculateTotalValue(): void {
    const quantity = this.portfolioForm.get('quantity')?.value || 0;
    const purchasePrice = this.portfolioForm.get('purchasePrice')?.value || 0;
    const totalValue = quantity * purchasePrice;
    
    this.portfolioForm.get('totalValue')?.setValue(totalValue.toFixed(2));
  }

  onSubmit(): void {
    if (this.portfolioForm.valid) {
      this.loading = true;
      this.error = '';
      
      const formData = {
        ...this.portfolioForm.value,
        totalValue: this.portfolioForm.get('totalValue')?.value
      };
      
      // Simular adição ao portfólio
      setTimeout(() => {
        console.log('Novo item adicionado ao portfólio:', formData);
        this.success = true;
        this.loading = false;
        
        // Redirecionar para o portfólio após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/portfolio']);
        }, 2000);
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.portfolioForm.controls).forEach(key => {
      const control = this.portfolioForm.get(key);
      control?.markAsTouched();
    });
  }

  // Validadores customizados
  noSpecialCharactersValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasSpecialChars = /[^a-zA-Z0-9\s\-]/.test(value);
    return hasSpecialChars ? { specialCharacters: true } : null;
  }

  cryptoSymbolValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const isValidSymbol = /^[A-Z0-9]+$/.test(value.toUpperCase());
    return !isValidSymbol ? { invalidSymbol: true } : null;
  }

  positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = parseFloat(control.value);
    if (isNaN(value) || value <= 0) {
      return { positiveNumber: true };
    }
    return null;
  }

  minQuantityValidator(control: AbstractControl): ValidationErrors | null {
    const value = parseFloat(control.value);
    if (!isNaN(value) && value < 0.00000001) {
      return { minQuantity: true };
    }
    return null;
  }

  minPriceValidator(control: AbstractControl): ValidationErrors | null {
    const value = parseFloat(control.value);
    if (!isNaN(value) && value < 0.01) {
      return { minPrice: true };
    }
    return null;
  }

  getFieldError(fieldName: string): string {
    const field = this.portfolioForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
      }
      if (field.errors['specialCharacters']) {
        return 'Não são permitidos caracteres especiais';
      }
      if (field.errors['invalidSymbol']) {
        return 'Símbolo deve conter apenas letras e números';
      }
      if (field.errors['positiveNumber']) {
        return 'Deve ser um número positivo válido';
      }
      if (field.errors['minQuantity']) {
        return 'Quantidade mínima: 0.00000001';
      }
      if (field.errors['minPrice']) {
        return 'Preço mínimo: $0.01';
      }
    }
    return '';
  }

  goBack(): void {
    this.router.navigate(['/portfolio']);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
}
