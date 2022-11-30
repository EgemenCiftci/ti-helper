import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, 
              private settingsService: SettingsService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      interviewerName: [this.settingsService.interviewerName],
      outputDirectory: [this.settingsService.outputDirectory, Validators.required],
      aspNetCoreCodePath: [this.settingsService.aspNetCoreCodePath],
      wpfCodePath: [this.settingsService.wpfCodePath],
      questionMaterialsPath: [this.settingsService.questionMaterialsPath],
      interviewFormPath: [this.settingsService.interviewFormPath],
      websiteUrl: [this.settingsService.websiteUrl]
    });
  }

  submit() {
    if (!this.form?.valid) {
      return;
    }

    this.settingsService.interviewerName = this.form.value.interviewerName;
    this.settingsService.outputDirectory = this.form.value.outputDirectory;
    this.settingsService.aspNetCoreCodePath = this.form.value.aspNetCoreCodePath;
    this.settingsService.wpfCodePath = this.form.value.wpfCodePath;
    this.settingsService.questionMaterialsPath = this.form.value.questionMaterialsPath;
    this.settingsService.interviewFormPath = this.form.value.interviewFormPath;
    this.settingsService.websiteUrl = this.form.value.websiteUrl;
    this.settingsService.saveSettings();
  }
}
