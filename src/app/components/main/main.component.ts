import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ExcelData } from 'src/app/models/excel-data';
import { QuestionMaterial } from 'src/app/models/question-material';
import { FileService } from 'src/app/services/file.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { TextGenerationService } from 'src/app/services/text-generation.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  overviewForm!: FormGroup;
  extraInfoForm!: FormGroup;
  generatedOverallImpression = new FormControl('');
  tiDirectoryName?: string;
  candidateNames: string[] = [];
  isInUpdateMode = false;
  questionMaterials: QuestionMaterial[] = [];

  constructor(private formBuilder: FormBuilder,
    private fileService: FileService,
    private snackBarService: SnackBarService,
    private settingsService: SettingsService,
    private textGenerationService: TextGenerationService) { }

  ngOnInit() {
    this.overviewForm = this.formBuilder.group({
      candidateName: ['', Validators.required],
      interviewerName: [this.settingsService.interviewerName],
      date: [new Date()],
      relevantExperience: [0],
      communication: [''],
      finalResultLevel: [''],
      overallImpression: ['']
    });

    this.overviewForm.get('candidateName')?.valueChanges.subscribe(async val => {
      try {
        const candidateName = val.trim();
        this.isInUpdateMode = this.candidateNames.includes(candidateName);
        if (this.isInUpdateMode) {
          this.setExcelData(await this.fileService.getCandidateData(candidateName));
        }
      } catch (error) {
        console.error(error);
        this.snackBarService.showSnackBar('Error while getting candidate data.');
      }
    });

    this.extraInfoForm = this.formBuilder.group({
      arrived: [''],
      goodAt: [''],
      badAt: [''],
      durationMinutes: [0]
    });
  }

  async selectTiDirectory() {
    try {
      await this.fileService.initialize();
      this.tiDirectoryName = this.fileService.tiDirectoryHandle?.name;
      this.candidateNames = await this.fileService.getCandidateNames();
      this.questionMaterials = await this.fileService.getQuestionMaterials();
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while selecting TI directory.');
    }
  }

  async submit() {
    try {
      if (!this.overviewForm?.valid) {
        return;
      }

      const excelData = this.getExcelData(this.overviewForm.value);

      await this.fileService.createUpdateCandidateFolder(excelData);

      if (this.isInUpdateMode) {
        this.snackBarService.showSnackBar('Folder updated successfully.');
      } else {
        this.candidateNames = await this.fileService.getCandidateNames();
        this.isInUpdateMode = this.candidateNames.includes(excelData.candidateName);
        this.snackBarService.showSnackBar('Folder created successfully.');
      }
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while creating/updating candidate folder.');
    }
  }

  private getExcelData(formValue: any): ExcelData {
    return {
      candidateName: formValue.candidateName.trim(),
      interviewerName: formValue.interviewerName.trim(),
      date: formValue.date,
      relevantExperience: formValue.relevantExperience,
      communication: formValue.communication,
      finalResultLevel: formValue.finalResultLevel,
      overallImpression: formValue.overallImpression.trim(),
    };
  }

  private setExcelData(excelData: ExcelData) {
    this.overviewForm.patchValue({
      interviewerName: excelData.interviewerName,
      date: excelData.date,
      relevantExperience: excelData.relevantExperience,
      communication: excelData.communication,
      finalResultLevel: excelData.finalResultLevel,
      overallImpression: excelData.overallImpression
    });
  }

  async copyAspNetCoreCodeAndOpenWebsite() {
    try {
      const code = await this.fileService.getAspNetCoreCode();
      await this.copyToClipboard(code);
      this.snackBarService.showSnackBar('Copied to clipboard');
      this.openWebsiteInNewTab();
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while copying code.');
    }
  }

  async copyWpfCodeAndOpenWebsite() {
    try {
      const code = await this.fileService.getWpfCode();
      await this.copyToClipboard(code);
      this.snackBarService.showSnackBar('Copied to clipboard');
      this.openWebsiteInNewTab();
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while copying code.');
    }
  }

  private openWebsiteInNewTab() {
    window.open(this.settingsService.websiteUrl, "_blank");
  }

  async selectQuestionMaterial(qm: QuestionMaterial) {
    try {
      if (qm.code) {
        await this.copyToClipboard(qm.code);
        this.snackBarService.showSnackBar('Copied to clipboard');
      }
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while copying code.');
    }
  }

  private async copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
  }

  linkedInPeopleSearch() {
    try {
      const url = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(this.overviewForm.value.candidateName)}`;
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while searching.');
    }
  }

  gitHubUserSearch() {
    try {
      const url = `https://github.com/search?q=${encodeURIComponent(this.overviewForm.value.candidateName)}&type=users`;
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while searching.');
    }
  }

  googleSearch() {
    try {
      const url = `https://www.google.com/search?q=${encodeURIComponent(this.overviewForm.value.candidateName)}`;
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while searching.');
    }
  }

  async generateOverallImpression() {
    try {
      if (!this.extraInfoForm?.valid) {
        return;
      }

      let text = '';
      text += this.extraInfoForm.value.arrived ? `The candidate arrived the interview ${this.extraInfoForm.value.arrived}.\r\n` : '';
      text += this.overviewForm.value.communication ? `The candidate's communication skills are ${this.overviewForm.value.communication}.\r\n` : '';

      const practicalTaskScore = await this.fileService.getPracticalTaskScore(this.overviewForm.value.candidateName);
      const practicalTaskScoreText = this.getPracticalTaskScoreText(practicalTaskScore);
      text += practicalTaskScoreText ? `The candidate's practical skills are ${practicalTaskScoreText}.\r\n` : '';

      const finalResultScore = await this.fileService.getFinalResultScore(this.overviewForm.value.candidateName, this.overviewForm.value.finalResultLevel);
      const finalResultScoreText = this.getFinalResultScoreText(finalResultScore);
      text += finalResultScoreText ? `The candidate's theoretical skills are ${finalResultScoreText}.\r\n` : '';

      text += this.extraInfoForm.value.goodAt ? `The candidate is good at ${this.extraInfoForm.value.goodAt}.\r\n` : '';
      text += this.extraInfoForm.value.badAt ? `The candidate is bad at ${this.extraInfoForm.value.badAt}.\r\n` : '';
      text += this.extraInfoForm.value.durationMinutes ? `The interview lasted ${this.extraInfoForm.value.durationMinutes} minutes.\r\n` : '';
      text += this.overviewForm.value.finalResultLevel ? `The candidate's final result level is ${this.overviewForm.value.finalResultLevel}.\r\n` : '';

      const generatedText = await this.textGenerationService.generateText(text);
      this.generatedOverallImpression.setValue(generatedText);
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while generating overall impression.');
    }
  }

  getPracticalTaskScoreText(practicalTaskScore: number | undefined): string | undefined {
    if (!practicalTaskScore) {
      return '';
    }

    if (practicalTaskScore <= 1) {
      return 'bad';
    } else if (practicalTaskScore <= 2) {
      return 'average';
    } else if (practicalTaskScore <= 3) {
      return 'good';
    } else {
      return 'very good';
    }
  }

  getFinalResultScoreText(finalResultScore: number | undefined): string | undefined {
    if (!finalResultScore) {
      return '';
    }

    if (finalResultScore < 2.5) {
      return 'bad';
    } else if (finalResultScore < 3) {
      return 'average';
    } else if (finalResultScore < 3.5) {
      return 'good';
    } else {
      return 'very good';
    }
  }
}
