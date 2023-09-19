import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-notice',
  templateUrl: './cookie-notice.component.html',
  styleUrls: ['./cookie-notice.component.css']
})
export class CookieNoticeComponent implements OnInit {

  cookiesAccepted = localStorage.getItem('cookiesAccepted');


  ngOnInit() {

      if (this.cookiesAccepted) {
      }
      else {
        this.showNotice();
      }
  }

  acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    let aviso = document.querySelector('.cookie-notice');

    if (aviso != null){
      aviso.classList.remove('show');
      aviso.classList.add('hide');
    }
  }

  rejectCookies() {
    localStorage.removeItem('cookiesAccepted')
    let aviso = document.querySelector('.cookie-notice');

    if (aviso != null){
      aviso.classList.remove('show');
      aviso.classList.add('hide');
    }
  }

  showNotice() {



    setTimeout(() => {
      if (!this.cookiesAccepted) {
        let aviso = document.querySelector('.cookie-notice');

        if (aviso != null){
          aviso.classList.remove('hide');
          aviso.classList.add('show');
        }
      }
    }, 1000);
  }
}
