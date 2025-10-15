import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ENVIRONMENTS } from '../constants/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  DEV_CONFIG,
  PREPROD_CONFIG,
  PROD_CONFIG,
  UAT_CONFIG,
} from '../configurations/configuration';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  environment = '';
  loginUrl = '/ipdsv2/login/#/';
  product_name = 'rs-prjkt';

  url = '';
  domain = '';
  domainUrl = '';
  productId = '';
  commonPath = '';
  commonCssPath = '';
  commonJsPath = '';
  commonUtilityPath = '';

  private readonly configMap = {
    [ENVIRONMENTS.DEV]: DEV_CONFIG,
    [ENVIRONMENTS.UAT]: UAT_CONFIG,
    [ENVIRONMENTS.PREPROD]: PREPROD_CONFIG,
    [ENVIRONMENTS.PROD]: PROD_CONFIG,
  };

  constructor(private readonly http: HttpClient) {
    const { host } = window.location;

    if (window.location.hostname == 'localhost') {
      this.environment = environment.environment;
    } else if (host == 'd2fciuteqrodiu.cloudfront.net') {
      this.environment = ENVIRONMENTS.DEV;
    } else if (host == 'd2kdl49456fdj6.cloudfront.net') {
      this.environment = ENVIRONMENTS.UAT;
    } else if (host == 'd2kdl49456fdj6.cloudfront.net') {
      this.environment = ENVIRONMENTS.PREPROD;
    } else if (host == 'd2kdl49456fdj6.cloudfront.net') {
      this.environment = ENVIRONMENTS.PROD;
    }else{
      this.environment = environment.environment;
    }

    if (this.environment && this.configMap[this.environment]) {
      Object.assign(this, this.configMap[this.environment]);
    }
  }

  /****  Common HTTP POST Method****/
  async httpPostMethod(url: string, parameter: any): Promise<any> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(url, parameter, { observe: 'response' }),
      );
      const data = response['body'];
      return data;
    } catch (err: any) {
      throw new Error(err?.error || 'Server error');
    }
  }

  /****  Common HTTP Get Method****/
  async httpGetMethod(
    url: string,
    payload?: Record<string, any>,
  ): Promise<any> {
    try {
      let params = new HttpParams();
      if (payload) {
        params = new HttpParams({ fromObject: payload });
      }

      const response: any = await firstValueFrom(
        this.http.get(url, { observe: 'response', params }),
      );

      return response.body;
    } catch (err: any) {
      throw new Error(err?.error || 'Server error');
    }
  }

  /****  Common HTTP Delete Method****/
  async httpDeleteMethod(url: string): Promise<any[]> {
    try {
      const response: any = await firstValueFrom(
        this.http.delete(url, { observe: 'response' }),
      );
      const data = response['body'];
      return data;
    } catch (err: any) {
      throw new Error(err?.error || 'Server error');
    }
  }

  /****  Common HTTP PDF Download Method****/
  async httpPdfDownload(
    url: string,
    payload?: Record<string, any>,
    pdfName?: string,
  ): Promise<any> {
    try {
      let params = new HttpParams();
      if (payload) {
        params = new HttpParams({ fromObject: payload });
      }

      const response: any = await firstValueFrom(
        this.http.get(url, { observe: 'response', params }),
      );
      const blob = new Blob([response['body']], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = pdfName + '.pdf';
      link.click();
    } catch (err: any) {
      throw new Error(err?.error || 'Server error');
    }
  }
}
