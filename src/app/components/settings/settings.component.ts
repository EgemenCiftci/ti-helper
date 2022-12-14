import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/services/settings.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

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
      openAiApiKey: [this.settingsService.openAiApiKey],
      openAiTemperature: [this.settingsService.openAiTemperature, [Validators.min(0), Validators.max(1)]]
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
      this.settingsService.openAiApiKey = this.form.value.openAiApiKey.trim();
      this.settingsService.openAiTemperature = this.form.value.openAiTemperature;
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
}
