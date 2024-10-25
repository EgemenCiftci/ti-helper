import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private snackBar = inject(MatSnackBar);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 3000,
    });
  }
}
