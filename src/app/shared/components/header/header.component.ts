import { Component, Input, OnInit, inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;


  firebaseSvc = inject(FirebaseService); 
  utilSvc = inject(UtilsService);
  rout = inject(Router) 

  ngOnInit() {}

  isHomeRoute() {
    return this.rout.url === '/main/home';
  }

  signOut(){
    this.firebaseSvc.signOut();
    }

  dismissModal(){
    this.utilSvc.dissmisModal();
  }

}
