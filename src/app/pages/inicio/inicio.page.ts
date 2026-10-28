import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonText,
  IonTitle,
  IonToolbar,
  LoadingController,
} from '@ionic/angular';
import * as FileSaver from 'file-saver';
import { addIcons } from 'ionicons';
import { downloadOutline } from 'ionicons/icons';

import { DataService } from '../../services/data-service';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonText,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
  ],
})
export class InicioPage {
  private readonly testService: DataService = inject(DataService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly loadingCtrl: LoadingController = inject(LoadingController);
  data = signal<any[]>([]);
  url = signal<string>('');
  lastPage = signal<number>(0);
  dataPath = signal<string>(''); // Clave o ruta de anidamiento (ej: "results" o "data.items")

  constructor() {
    addIcons({ downloadOutline });
  }

  async loadData(): Promise<void> {
    console.log('Loading data: ', this.url(), this.lastPage(), this.dataPath());
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
    });
    await loading.present();
    this.testService.loadData(this.url(), this.lastPage(), this.dataPath()).subscribe({
      next: (value) => {
        loading.dismiss();
        this.data.set(value);
        console.log(this.data);
        this.toastService.mostrarToast('Json guardado', 'success', 'middle');
        console.log('Guardamos en fichero...');
        this.saveMoviesToJson();
      },
      error: (err) => {
        this.toastService.mostrarToast(err.message, 'danger', 'middle');
        console.error(err);
      },
    });
  }

  private saveMoviesToJson() {
    const data = JSON.stringify(this.data(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });

    // Mostrar una notificación al usuario si el archivo no se descarga
    try {
      FileSaver.saveAs(blob, 'peliculas.json');
      console.log('Saved');
    } catch (error) {
      console.error('Error al guardar el archivo:', error);
      alert('No se pudo guardar el archivo. Por favor, verifica la configuración de tu navegador.');
    }
  }
}
