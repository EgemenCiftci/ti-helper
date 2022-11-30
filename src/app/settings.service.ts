import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  interviewerName!: string | null;
  outputDirectory!: string;
  aspNetCoreCodePath!: string;
  wpfCodePath!: string;
  questionMaterialsPath!: string;
  interviewFormPath!: string;
  websiteUrl!: string;

  constructor() {
    this.loadSettings();
  }

  loadSettings() {
    this.interviewerName = localStorage.getItem('interviewerName');
    this.outputDirectory = localStorage.getItem('outputDirectory') ?? 'Candidates';
    this.aspNetCoreCodePath = localStorage.getItem('aspNetCoreCodePath') ?? '\\Docs\\web code review task.cs';
    this.wpfCodePath = localStorage.getItem('wpfCodePath') ?? '\\Docs\\desktop code review task.cs';
    this.questionMaterialsPath = localStorage.getItem('questionMaterialsPath') ?? '\\Docs\\question materials.cs';
    this.interviewFormPath = localStorage.getItem('interviewFormPath') ?? '\\Docs\\Interview Form CS template 0.8.xlsx';
    this.websiteUrl = localStorage.getItem('websiteUrl') ?? 'https://www.snipp.live/new';
  }

  saveSettings() {
    localStorage.setItem('interviewerName', this.interviewerName ?? '');
    localStorage.setItem('outputDirectory', this.outputDirectory);
    localStorage.setItem('aspNetCoreCodePath', this.aspNetCoreCodePath);
    localStorage.setItem('wpfCodePath', this.wpfCodePath);
    localStorage.setItem('questionMaterialsPath', this.questionMaterialsPath);
    localStorage.setItem('interviewFormPath', this.interviewFormPath);
    localStorage.setItem('websiteUrl', this.websiteUrl);
  }
}
