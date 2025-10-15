import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(`Failed to load script: ${url}`);
    document.body.appendChild(script);
  });
}

// ✅ Single bootstrap with correct Promise chaining
loadScript(environment.mainJSURL)
  .then(() => {
    console.log('✅ External script loaded:', environment.mainJSURL);
    return bootstrapApplication(AppComponent, appConfig);
  })
  .catch(err => {
    console.error('⚠️ Script load failed or bootstrap error:', err);
    // Still bootstrap the app even if script fails
    bootstrapApplication(AppComponent, appConfig)
      .catch(err => console.error('⚠️ Bootstrap failed:', err));
  });