import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  interviewerName!: string | null;
  outputDirectory!: string;
  inputDirectory!: string;
  aspNetCoreCodeFileName!: string;
  wpfCodeFileName!: string;
  questionMaterialsFileName!: string;
  interviewFormFileName!: string;
  websiteUrl!: string;
  openAiApiKey!: string;

  constructor() {
    this.loadSettings();
  }

  loadSettings() {
    this.interviewerName = localStorage.getItem('interviewerName');
    this.outputDirectory = localStorage.getItem('outputDirectory') ?? 'Candidates';
    this.inputDirectory = localStorage.getItem('inputDirectory') ?? 'Docs';
    this.aspNetCoreCodeFileName = localStorage.getItem('aspNetCoreCodeFileName') ?? 'web code review task.cs';
    this.wpfCodeFileName = localStorage.getItem('wpfCodeFileName') ?? 'desktop code review task.cs';
    this.questionMaterialsFileName = localStorage.getItem('questionMaterialsFileName') ?? 'question materials.cs';
    this.interviewFormFileName = localStorage.getItem('interviewFormFileName') ?? 'Interview Form CS template 0.8.xlsx';
    this.websiteUrl = localStorage.getItem('websiteUrl') ?? 'https://www.snipp.live/new';
    this.openAiApiKey = localStorage.getItem('openAiApiKey') ?? '';
  }

  saveSettings() {
    localStorage.setItem('interviewerName', this.interviewerName ?? '');
    localStorage.setItem('outputDirectory', this.outputDirectory);
    localStorage.setItem('inputDirectory', this.inputDirectory);
    localStorage.setItem('aspNetCoreCodeFileName', this.aspNetCoreCodeFileName);
    localStorage.setItem('wpfCodeFileName', this.wpfCodeFileName);
    localStorage.setItem('questionMaterialsFileName', this.questionMaterialsFileName);
    localStorage.setItem('interviewFormFileName', this.interviewFormFileName);
    localStorage.setItem('websiteUrl', this.websiteUrl);
    localStorage.setItem('openAiApiKey', this.openAiApiKey);
  }

  resetSettings() {
    localStorage.removeItem('interviewerName');
    localStorage.removeItem('outputDirectory');
    localStorage.removeItem('inputDirectory');
    localStorage.removeItem('aspNetCoreCodeFileName');
    localStorage.removeItem('wpfCodeFileName');
    localStorage.removeItem('questionMaterialsFileName');
    localStorage.removeItem('interviewFormFileName');
    localStorage.removeItem('websiteUrl');
    localStorage.removeItem('openAiApiKey');
    this.loadSettings();
  }
}
