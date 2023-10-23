import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Reportes } from 'src/app/models/reportes.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent  implements OnInit {

  @Input() reporte:  Reportes;

  form = new FormGroup({
    id: new FormControl(''),
    Imagen: new FormControl('', [Validators.required]),
    Direccion: new FormControl('', [Validators.required, Validators.minLength(8)]),
    Barrio: new FormControl('', [Validators.required, Validators.minLength(3)]),
    Localidad: new FormControl('', [Validators.required, Validators.minLength(3)]),
    Descripcion: new FormControl('', [Validators.required])
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;


  ngOnInit() {
    this.user =this.utilsSvc.getFromLocalStorage ('user');
    if (this.reporte) this.form.setValue(this.reporte);
  }


//Camera 
async takeImage(){
const dataUrl= (await this.utilsSvc.takePicture('Imagen de la falla vial')).dataUrl;
this.form.controls.Imagen.setValue(dataUrl);
}

submit (){
  if (this.form.valid) {
  
    if(this.reporte) this.updatereport();
    else this.createreport();
  }
}

//Funcion para crear en modal y reporte
  async createreport() {


      let path = `users/${this.user.uid}/reportes`



      const loading = await this.utilsSvc.loading();
      await loading.present();

      let dataUrl= this.form.value.Imagen;
      let imagePath= `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.Imagen.setValue(imageUrl);

      delete this.form.value.id

      this.firebaseSvc.addDocument(path, this.form.value).then(async (res) => {
          
      this.utilsSvc.dissmisModal({success: true})

        this.utilsSvc.presentToast({
          message: 'Se creo su reporte',
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        })

        })
        .catch((error) => {
          console.log(error);

          this.utilsSvc.presentToast({
            message: 'La contraseña es erronea',
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
      }
//Actualizar
async updatereport() {

    let path = `users/${this.user.uid}/reportes/${this.reporte.id}`



    const loading = await this.utilsSvc.loading();
    await loading.present();

    if(this.form.value.Imagen !== this.reporte.Imagen){
      let dataUrl= this.form.value.Imagen;
      let imagePath= await this.firebaseSvc.getFilePath(this.reporte.Imagen);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.Imagen.setValue(imageUrl);
    }

 

    delete this.form.value.id

    this.firebaseSvc.updateDocument(path, this.form.value).then(async (res) => {
        
    this.utilsSvc.dissmisModal({success: true})

      this.utilsSvc.presentToast({
        message: 'Se actualizo su reporte',
        duration: 1500,
        color: 'primary',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      })

      })
      .catch((error) => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: 'La contraseña es erronea',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}
