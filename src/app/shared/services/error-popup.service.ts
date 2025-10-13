import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorPopupService {
  private readonly router = inject(Router);
  private readonly apiservice = inject(ApiService)
  imageUrl = this.apiservice.commonPath


  private closeAndNavigateToLogin(): void {
    Swal.close();
    window.location.href = this.apiservice.domain + 'login'
  }

  public showErrorPopup(message: string): void {
    const swalOptions: SweetAlertOptions = {
      html: `
        <div class="custom-popup">
          <div class="custom-popup-header">
            <span>Failed!</span>
          </div>
          <div class="custom-popup-body">
            <img src=${this.imageUrl + '/assets/images/error_popup.svg'} class="error-icon" /> 
            <p>${message}</p>
            <div class="btn-group">
              <button class="outline-btn" data-action="okay">Okay</button>
            </div>
          </div>
        </div>
      `,
      showConfirmButton: false,
      background: 'transparent',
      customClass: {
        popup: 'no-padding-popup',
      },
      allowOutsideClick: () => {
        this.closeAndNavigateToLogin();
        return false;
      },
      didOpen: (popup) => {
        popup
          .querySelector('.outline-btn')
          ?.addEventListener('click', () => this.closeAndNavigateToLogin());
      },
    };

    Swal.fire(swalOptions);
  }
}