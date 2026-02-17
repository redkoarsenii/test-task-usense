import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {ImageToTextService} from '../../services/imageToText.service';
import {NgIf} from '@angular/common';
import { MessageService } from 'primeng/api';
import {Toast} from 'primeng/toast';
import {finalize} from 'rxjs';


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    NgIf,
    Toast
  ],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
  providers: [MessageService]
})
export class MainPage {

  private imageToTextService = inject(ImageToTextService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);
  selectedFile: File | null = null;
  convertedInformation: string  = ''
  previewUrl: string | null = null;
  copied: boolean = false;
  loaderStatus: boolean = false;

  constructor() {}


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const rightFormat = ['image/jpeg', 'image/png'];
    const maximumFileSize = 200*1024;

    if (!file) return;


    if (!rightFormat.includes(file.type)) {
      this.showError('Невірний формат файлу! Завантажте jpeg або png');
      input.value = '';
      this.selectedFile = null;
      this.previewUrl = null;
      return;
    }
    if (file.size > maximumFileSize) {
      this.showError('Максимальний розмір файлу до 200кб!');
      input.value = '';
      this.selectedFile = null;
      this.previewUrl = null;
      return;
    }


    this.selectedFile = file;

    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }

    this.previewUrl = file ? URL.createObjectURL(file) : null;
  }

  onFormSubmit(event: Event) {
    event.preventDefault();

    if (!this.selectedFile) {
      this.showError('Файл не обрано!');
      return;
    }

    this.loaderStatus = true;

    this.imageToTextService.getTextFromImage(this.selectedFile).pipe(
      finalize(() => {
        this.loaderStatus = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: data => {
        this.convertedInformation = data.map(el => el.text).join(' ');
      },
      error: err => {
        console.error(err);
        this.showError('Помилка конвертації');
      }
    });
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.convertedInformation).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Помилка!', detail: message });
  }

}
