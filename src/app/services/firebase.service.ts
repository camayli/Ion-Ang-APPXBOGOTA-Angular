import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  collectionData,
  query,
  updateDoc
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { getStorage, uploadString, ref, getDownloadURL } from "firebase/storage"

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage)

  utilSvc = inject(UtilsService);

  //Funcion de comprobacion de autenticacion
  getAuth() {
    return getAuth();
  }

  //Funcion de ingreso
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //Funcion Registro
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //Funcion Registro
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  //Log off
  signOut() {
    getAuth().signOut();
    localStorage.removeItem(`user`);
    this.utilSvc.routerLink(`/auth`);
  }

  //Firestore =Base de datos

  //Settear documento
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //Update documento
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //Obtener documento
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //Agregar database-Doc
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

//Almacenamiento
async uploadImage(path: string, data_url: string ){
 return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() =>{
  return getDownloadURL(ref(getStorage(), path))
 })
}

//obetener imagen para ver si existe en update
async getFilePath(url: string){
  return ref(getStorage(),url).fullPath
}

//obtener coleccion
getCollectionData(path: string, collectionQuey?: any){
const ref = collection(getFirestore(), path);
return collectionData(query(ref, collectionQuey), {idField: `id`})
}

}
