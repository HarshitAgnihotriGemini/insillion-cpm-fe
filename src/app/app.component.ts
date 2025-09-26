import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScriptLoaderService } from './shared/script-loader/script-loader.service';
import { ApiService } from './shared/services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  title = 'rs-prjkt';

  constructor(
    public scriptLoader: ScriptLoaderService,
    public apiService: ApiService,
  ) {}

  ngOnInit() {
    this.scriptLoader.loadCommonElements(
      this.apiService.commonCssPath,
      this.apiService.commonUtilityPath,
    );
  }
}
