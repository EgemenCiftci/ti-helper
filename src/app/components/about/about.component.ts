import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TextGenerationService } from 'src/app/services/text-generation.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  version = require('package.json').version;

  constructor(private snackBar: MatSnackBar, 
    private textGenerationService: TextGenerationService) { }

  async test() {
    const text = await this.textGenerationService.generateText('Hello world!');
    alert(text);
  }
}
