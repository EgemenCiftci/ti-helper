import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  constructor(private snackBar: MatSnackBar) { }

  snackBarTest() {
    this.snackBar.open('Test...', 'X');
  }
}
