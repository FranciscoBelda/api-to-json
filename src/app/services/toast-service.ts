import { inject, Service } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Service()
export class ToastService {
  private readonly toastCtrl: ToastController = inject(ToastController);

  async mostrarToast(message: string, color: string, position: 'middle' | 'bottom' | 'top' | undefined):Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      color,
      position,
      duration: 2000,
    });
    await toast.present();
  }
}
