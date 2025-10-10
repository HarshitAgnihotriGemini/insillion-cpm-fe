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
    this.router.navigate(['/login']);
  }

  public showProfileErrorPopup(message: string): void {
    const swalOptions: SweetAlertOptions = {
      html: `
        <div class="custom-popup">
          <div class="custom-popup-header">
            <span>Failed!</span>
            <button class="close-btn" data-action="close">&times;</button> 
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
      // Logic to attach the click listener to the 'Okay' button in the popup
      didOpen: (popup) => {
        popup
          .querySelector('.outline-btn')
          ?.addEventListener('click', () => this.closeAndNavigateToLogin());
        
        // Also ensure the custom close button works
        popup
          .querySelector('.close-btn')
          ?.addEventListener('click', () => this.closeAndNavigateToLogin());
      },
      // Logic for when the SweetAlert is closed by other means (e.g., escape key)
      willClose: () => {
        // Optional: you might want to navigate on any close, or only on button clicks
        // this.closeAndNavigateToLogin();
      }
    };

    Swal.fire(swalOptions);
  }
}