import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatStepper } from '@angular/material/stepper';
import { ExcelData } from 'src/app/models/excel-data';
import { Item } from 'src/app/models/item';
import { QuestionMaterial } from 'src/app/models/question-material';
import { Scoring } from 'src/app/models/scoring';
import { Section } from 'src/app/models/section';
import { FileService } from 'src/app/services/file.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {
  candidateNames: string[] = [];
  candidateName: string = '';
  tiDirectoryName?: string;
  questionMaterials: QuestionMaterial[] = [];
  isInUpdateMode = false;
  selectedTask?: string;
  taskItems?: Item[];
  sections?: Section[];
  scoring?: Scoring;
  candidateNameFormGroup = this._formBuilder.group({
    candidateName: ['', Validators.required]
  });
  overviewFormGroup = this._formBuilder.group({
    interviewerName: [this._settingsService.interviewerName],
    date: [new Date()],
    relevantExperience: [0]
  });
  taskFormGroup = this._formBuilder.group({});
  questionsFormGroup = this._formBuilder.group({});
  resultFormGroup = this._formBuilder.group({
    communication: [''],
    finalResultLevel: [''],
    overallImpression: ['Part of the overall feedback please include input for:\na.	Ability to code – based on questions on second tab\nb.	Ability to design and engineer – based on architecture questions, oop, patterns, etc.\nc.	Practical task results\nd.	Ability to perform in the project – understanding methodology/sdlc/estimation\ne.	Ability to communicate – knowing English, expressing thoughts']
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _settingsService: SettingsService,
    private _fileService: FileService,
    private _snackBarService: SnackBarService) { }

  ngOnInit() {
    this.candidateNameFormGroup.get('candidateName')?.valueChanges.subscribe(async val => {
      try {
        this.candidateName = val?.trim() ?? '';
        this.isInUpdateMode = this.candidateNames.includes(this.candidateName);
      } catch (error) {
        console.error(error);
        this._snackBarService.showSnackBar('Error while getting candidate data.');
      }
    });
  }

  async selectTiDirectory(stepper: MatStepper) {
    try {
      await this._fileService.initialize();
      this.tiDirectoryName = this._fileService.tiDirectoryHandle?.name;
      this.candidateNames = await this._fileService.getCandidateNames();
      this.questionMaterials = await this._fileService.getQuestionMaterials();
      stepper.selectedIndex = 1;
    } catch (error) {
      this.tiDirectoryName = undefined;
      console.error(error);
      this._snackBarService.showSnackBar('Error while selecting TI directory.');
    }
  }

  async onCandidateNameFormSubmit() {
    try {
      if (!this.candidateNameFormGroup?.valid) {
        return;
      }

      if (this.isInUpdateMode) {
        const excelData = await this._fileService.getExcelData(this.candidateName);
        this.updateForms(excelData);
      } else {
        await this._fileService.createCandidateFolderAndCopyInterviewFormFile(this.candidateName);
        this.candidateNames = await this._fileService.getCandidateNames();
        this.isInUpdateMode = this.candidateNames.includes(this.candidateName);
        await this._fileService.setCandidateName(this.candidateName);
        this._snackBarService.showSnackBar('Folder created successfully.');
      }

      this.sections = await this._fileService.getSections(this.candidateName);
    } catch (error) {
      console.error(error);
      this._snackBarService.showSnackBar('Error while submitting candidate name.');
    }
  }

  async onOverviewFormSubmit() {
    try {
      if (!this.overviewFormGroup?.valid) {
        return;
      }

      await this._fileService.setOverview(this.candidateName, this.overviewFormGroup.value);
      this._snackBarService.showSnackBar('Submitted successfully.');
    } catch (error) {
      console.error(error);
      this._snackBarService.showSnackBar('Error while submitting overview.');
    }
  }

  async onTaskFormSubmit() {
    try {
      if (!this.taskFormGroup?.valid) {
        return;
      }

      await this._fileService.setTaskItems(this.candidateName, this.taskItems);
      this._snackBarService.showSnackBar('Submitted successfully.');
    } catch (error) {
      console.error(error);
      this._snackBarService.showSnackBar('Error while submitting task items.');
    }
  }

  async onQuestionsFormSubmit() {
    try {
      if (!this.questionsFormGroup?.valid) {
        return;
      }

      await this._fileService.setSections(this.candidateName, this.sections);
      this._snackBarService.showSnackBar('Submitted successfully.');

      this.scoring = await this._fileService.getScoring(this.candidateName);
    } catch (error) {
      console.error(error);
      this._snackBarService.showSnackBar('Error while submitting task items.');
    }
  }

  async onResultFormSubmit() {
    try {
      if (!this.resultFormGroup?.valid) {
        return;
      }

      await this._fileService.setResult(this.candidateName, this.resultFormGroup.value, this.scoring);
      this._snackBarService.showSnackBar('Submitted successfully.');
    } catch (error) {
      console.error(error);
      this._snackBarService.showSnackBar('Error while submitting result.');
    }
  }

  private updateForms(excelData?: ExcelData) {
    if (excelData) {
      this.overviewFormGroup.patchValue({
        interviewerName: excelData.interviewerName,
        date: excelData.date,
        relevantExperience: excelData.relevantExperience
      });
      this.resultFormGroup.patchValue({
        communication: excelData.communication,
        finalResultLevel: excelData.finalResultLevel,
        overallImpression: excelData.overallImpression
      });
    };
  }

  async selectAspNetCoreCodeReview(stepper: MatStepper) {
    try {
      this.selectedTask = 'ASP.NET Core Code Review';
      const code = await this._fileService.getAspNetCoreCode();
      await this.selectCodeReview(stepper, code);
    } catch (error) {
      this.selectedTask = undefined;
      console.error(error);
      this._snackBarService.showSnackBar('Error while selecting task.');
    }
  }

  async selectWpfCodeReview(stepper: MatStepper) {
    try {
      this.selectedTask = 'WPF Code Review';
      const code = await this._fileService.getWpfCode();
      await this.selectCodeReview(stepper, code);
    } catch (error) {
      this.selectedTask = undefined;
      console.error(error);
      this._snackBarService.showSnackBar('Error while selecting task.');
    }
  }

  private async selectCodeReview(stepper: MatStepper, code: string) {
    await this.copyToClipboard(code);
    this._snackBarService.showSnackBar('Copied to clipboard');
    this.openWebsiteInNewTab();
    this.taskItems = await this._fileService.getTaskItems(this.candidateName, this.selectedTask);
    stepper.selectedIndex = 5;
  }

  private openWebsiteInNewTab() {
    window.open(this._settingsService.websiteUrl, "_blank");
  }

  private async copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
  }

  linkedInPeopleSearch() {
    try {
      const url = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(this.candidateName)}`;
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      this._snackBarService.showSnackBar('Error while searching.');
    }
  }

  gitHubUserSearch() {
    try {
      const url = `https://github.com/search?q=${encodeURIComponent(this.candidateName)}&type=users`;
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      this._snackBarService.showSnackBar('Error while searching.');
    }
  }

  googleSearch() {
    try {
      const url = `https://www.google.com/search?q=${encodeURIComponent(this.candidateName)}`;
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      this._snackBarService.showSnackBar('Error while searching.');
    }
  }

  reset(stepper: MatStepper) {
    stepper.reset();
    this.candidateName = '';
    this.isInUpdateMode = false;
    this.overviewFormGroup.reset();
    this.taskFormGroup.reset();
    this.questionsFormGroup.reset();
    this.resultFormGroup.reset();
    this.sections = [];
    this.taskItems = [];
    this.selectedTask = undefined;
    this.tiDirectoryName = undefined;
    this.candidateNames = [];
    this.questionMaterials = [];
    this.scoring = undefined;
  }

  getQuestionMaterial(row: number): QuestionMaterial | undefined {
    return this.questionMaterials.find(f => f.line === row);
  }

  async selectQuestionMaterial(row: number) {
    try {
      const qm = this.getQuestionMaterial(row);
      if (qm?.code) {
        await this.copyToClipboard(qm.code);
        this._snackBarService.showSnackBar('Copied to clipboard');
      }
    } catch (error) {
      console.error(error);
      this._snackBarService.showSnackBar('Error while copying code.');
    }
  }
}
