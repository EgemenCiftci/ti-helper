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
  preformedSentences!: string[];
  private defaultPreformedSentences = [
    "The candidate arrived early/on time/late for the interview.",
    "The total duration was XX minutes.",
    "In the practical part, the candidate found all of the items.",
    "In the practical part, the candidate could not find some items but did a good job overall.",
    "In the practical part, the candidate could not find most items and failed.",
    "In the theoretical part, the candidate answered some/most/all of the questions correctly.",
    "In the theoretical part, the candidate could not answer or partially answer most questions correctly.",
    "The candidate needs to improve his knowledge.",
    "There were no problems in communication.",
    "There were some problems in communication because of the accent but were not too serious.",
    "There were some problems in communication because the candidate could not express himself in some situations.",
    "The candidate expressed their thoughts easily and clearly. ",
    "My overall impression was good, and the candidate fits the junior/regular/senior role.",
    "Unfortunately, the candidate failed the interview.",
    "I sometimes felt that the candidate was searching the internet.",
    "The candidate likes to learn and deeply understands many CS subjects.",
    "The candidate was slow/fast in answering my questions.",
    "The candidate is a fast thinker and knows a lot.",
    "The candidate has the good technical knowledge and likes to talk.",
    "I think the candidate has the ability to find a suitable solution when he doesn't know the exact answer.",
    "The candidate has a good understanding of [AREA] and can explain it well.",
    "The candidate has some missing knowledge/experience about [AREA].",
  ];

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
    this.interviewFormFileName = localStorage.getItem('interviewFormFileName') ?? 'Interview Form CS template 0.9.xlsx';
    this.websiteUrl = localStorage.getItem('websiteUrl') ?? 'https://www.snipp.live/new';
    const ps = localStorage.getItem('preformedSentences');
    this.preformedSentences = ps === null ? this.defaultPreformedSentences : JSON.parse(ps);
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
    localStorage.setItem('preformedSentences', JSON.stringify(this.preformedSentences));
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
    localStorage.removeItem('preformedSentences');
    this.loadSettings();
  }
}
