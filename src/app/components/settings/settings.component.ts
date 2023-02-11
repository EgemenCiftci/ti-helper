import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { SettingsService } from 'src/app/services/settings.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      interviewerName: [this.settingsService.interviewerName],
      outputDirectory: [this.settingsService.outputDirectory, Validators.required],
      inputDirectory: [this.settingsService.inputDirectory, Validators.required],
      aspNetCoreCodeFileName: [this.settingsService.aspNetCoreCodeFileName],
      wpfCodeFileName: [this.settingsService.wpfCodeFileName],
      questionMaterialsFileName: [this.settingsService.questionMaterialsFileName],
      interviewFormFileName: [this.settingsService.interviewFormFileName],
      websiteUrl: [this.settingsService.websiteUrl],
      preformedSentences: [this.settingsService.preformedSentences]
    });
  }

  save() {
    try {
      if (!this.form?.valid) {
        return;
      }

      this.settingsService.interviewerName = this.form.value.interviewerName.trim();
      this.settingsService.outputDirectory = this.form.value.outputDirectory.trim();
      this.settingsService.inputDirectory = this.form.value.inputDirectory.trim();
      this.settingsService.aspNetCoreCodeFileName = this.form.value.aspNetCoreCodeFileName.trim();
      this.settingsService.wpfCodeFileName = this.form.value.wpfCodeFileName.trim();
      this.settingsService.questionMaterialsFileName = this.form.value.questionMaterialsFileName.trim();
      this.settingsService.interviewFormFileName = this.form.value.interviewFormFileName.trim();
      this.settingsService.websiteUrl = this.form.value.websiteUrl.trim();
      this.settingsService.preformedSentences = this.form.value.preformedSentences;
      this.settingsService.saveSettings();

      this.snackBarService.showSnackBar('Settings saved successfully.');
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while saving settings.');
    }
  }

  reset() {
    try {
      this.settingsService.resetSettings();
      this.ngOnInit();
      this.snackBarService.showSnackBar('Settings reset successfully.');
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while resetting settings.');
    }
  }

  addSentence(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (value) {
      this.form.get('preformedSentences')?.value.push(value);
    }

    event.chipInput!.clear();
  }

  removeSentence(sentence: string) {
    const index = this.form.get('preformedSentences')?.value.indexOf(sentence);

    if (index >= 0) {
      this.form.get('preformedSentences')?.value.splice(index, 1);
    }
  }

  dropSentence(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.form.get('preformedSentences')?.value, event.previousIndex, event.currentIndex);
  }
}
