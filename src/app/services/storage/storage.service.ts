import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  constructor(
    public storage: Storage,
  ) { }

  async setString(key: string, value: string) {
    await this.storage.set( key, value );
  }

  async getString(key: string): Promise<{ value: any }> {
      return (await this.storage.get(key));
  }

  async setObject(key: string, value: any) {
      await this.storage.set( key, JSON.stringify(value) );
  }

  async getObject(key: string): Promise<any> {
      const ret = await this.storage.get( key);
      return JSON.parse(ret);
  }
  async removeItem(key: string) {
      await this.storage.remove( key );
  }
  async clear() {
      await this.storage.clear();
  }
}
