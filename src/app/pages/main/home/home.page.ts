import { Component, OnInit } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { Reportes } from 'src/app/models/reportes.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateComponent } from 'src/app/shared/components/add-update/add-update.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService); 
  utilSvc = inject(UtilsService); 

  reportes: Reportes[] = [];

  ngOnInit() {
  }

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }
//Ejecuta la funcion cada que ingresa a la pagina
  ionViewWillEnter() {
    this.getReportes();
  }

//Cerrarsesion  
signOut(){
this.firebaseSvc.signOut();
}

//Get reportes
getReportes(){
  let path = `users/${this.user().uid}/reportes`;
let sub = this.firebaseSvc.getCollectionData(path).subscribe({
    next: (res:any) =>{
      console.log(res);
      this.reportes = res;
      sub.unsubscribe
    }
  })
}

//Crear o actualizar
async  addUpdate(reporte?: Reportes){

  let success = await  this.utilSvc.presentModal({
      component: AddUpdateComponent, 
      cssClass: 'add-update-modal',
      componentProps: {reporte}
    })

    if(success) this.getReportes();
  }
}
