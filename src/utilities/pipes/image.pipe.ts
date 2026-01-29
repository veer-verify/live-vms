import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StorageService } from 'src/services/storage.service';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  constructor(
    private http: HttpClient,
    private storageSer: StorageService,
  ) { }

  async transform(src: string): Promise<any> {
    const token = this.storageSer.getData('acTok');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.storageSer.showMediaLoader = true;
    const imageBlob = await firstValueFrom(this.http.get(src, { headers, responseType: 'blob' }));
    this.storageSer.showMediaLoader = false;

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      if (imageBlob) {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageBlob);
      } else {
        reject(new Error('Failed to load image blob'));
      }

    });
  }

}
