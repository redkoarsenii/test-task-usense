import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {ImageToTextResponse} from '../response/ImageToTextResponse';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ImageToTextService {

  private apiUrl: string = "https://api.api-ninjas.com/v1/imagetotext";
  private apiKey: string = '7nLzTnV8igNDtMG6wN2JPT7V6zUX32PCJibWQNiB';
  private http = inject(HttpClient);


  constructor() {}

  getTextFromImage(file: File): Observable<ImageToTextResponse[]> {

    const formData = new FormData();
    formData.append('image', file);

    const headers = new HttpHeaders({ 'X-Api-Key': this.apiKey });

    return this.http.post<ImageToTextResponse[]>(this.apiUrl, formData, { headers });
  }

}
