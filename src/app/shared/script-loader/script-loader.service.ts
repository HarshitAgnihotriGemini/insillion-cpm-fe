import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

  loadCommonElements(commonCssPath: string, utilitiesPath: string) {
    // Load common.css
    const commonStyle = this._document.createElement('link');
    commonStyle.rel = 'stylesheet';
    commonStyle.href = commonCssPath;
    commonStyle.type = 'text/css';
    commonStyle.onload = () => {};

    // Load utilities.js
    const utilitiesScript = this._document.createElement('script');
    utilitiesScript.type = 'module';
    utilitiesScript.src = utilitiesPath;
    utilitiesScript.onload = () => {};

    // Append both immediately (parallel loading)
    this._document.head.appendChild(commonStyle);
    this._document.head.appendChild(utilitiesScript);
  }
}
