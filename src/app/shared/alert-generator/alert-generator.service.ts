import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertGeneratorService {

  public classesByType: any = {
    danger: 'bg-red-50',
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50',
  }
  public currentAlerts = [];
  public html = `
    <div class="fixed inset-x-0 top-5 z-50 flex justify-center">
      <div class="flex items-center p-4 mb-4 text-sm TEXTCOLOR rounded-lg BGCOLOR" role="alert">
        <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span class="sr-only">TITLE</span>
        <div>
          <span class="font-medium">TITLE</span> MESSAGE
        </div>
      </div>
    </div>
  `;

  addAlert(type: string, title: string, message: string) {
    const alert = this.createHTMLAlert(type, title, message);
    document.body.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }

  createHTMLAlert(type: string, title: string, message: string) {
    const alert = document.createElement('div');
    alert.innerHTML = this.html
      .replace('TEXTCOLOR', this.classesByType[type])
      .replace('BGCOLOR', this.classesByType[type])
      .replace('TITLE', title).replace('TITLE', title)
      .replace('MESSAGE', message);
    return alert;
  }
}
