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
    public settingsService: SettingsService,
    private textGenerationService: TextGenerationService) { }

  ngOnInit() {
    this.overviewForm = this.formBuilder.group({
      candidateName: ['', Validators.required],
      interviewerName: [this.settingsService.interviewerName],
      date: [new Date()],
      relevantExperience: [0],
      communication: [''],
      finalResultLevel: [''],
      overallImpression: ['Part of the overall feedback please include input for:\na.	Ability to code – based on questions on second tab\nb.	Ability to design and engineer – based on architecture questions, oop, patterns, etc.\nc.	Practical task results\nd.	Ability to perform in the project – understanding methodology/sdlc/estimation\ne.	Ability to communicate – knowing English, expressing thoughts']
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

  async createUpdateCandidateFolder() {
    try {
      if (!this.overviewForm?.valid) {
        return;
      }

      const excelData = this.getExcelData(this.overviewForm.value);

      if (this.isInUpdateMode) {
        await this.fileService.updateCandidateFolder(excelData);
        this.snackBarService.showSnackBar('Folder updated successfully.');
      } else {
        await this.fileService.createCandidateFolder(excelData);
        this.candidateNames = await this.fileService.getCandidateNames();
        this.isInUpdateMode = this.candidateNames.includes(excelData.candidateName);
        this.snackBarService.showSnackBar('Folder created successfully.');
      }
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while creating/updating candidate folder.');
    }
  }

  async refresh() {
    try {
      if (!this.overviewForm?.valid || !this.isInUpdateMode) {
        return;
      }

      this.setExcelData(await this.fileService.getCandidateData(this.overviewForm.value.candidateName));

      this.snackBarService.showSnackBar('Folder refreshed successfully.');
    } catch (error) {
      console.error(error);
      this.snackBarService.showSnackBar('Error while refreshing candidate folder.');
    }
  }

  private getExcelData(formValue: any): ExcelData {
    return {
      candidateName: formValue.candidateName.trim(),
      interviewerName: formValue.interviewerName?.trim(),
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
      text += this.extraInfoForm.value.arrived ? `Arrived: ${this.extraInfoForm.value.arrived}\n` : '';
      text += this.overviewForm.value.communication ? `Communication skills: ${this.overviewForm.value.communication}\n` : '';

      const practicalTaskScore = await this.fileService.getPracticalTaskScore(this.overviewForm.value.candidateName);
      const practicalTaskScoreText = this.getPracticalTaskScoreText(practicalTaskScore);
      text += practicalTaskScoreText ? `Practical skills: ${practicalTaskScoreText}\n` : '';

      const finalResultScore = await this.fileService.getFinalResultScore(this.overviewForm.value.candidateName, this.overviewForm.value.finalResultLevel);
      const finalResultScoreText = this.getFinalResultScoreText(finalResultScore);
      text += finalResultScoreText ? `Theoretical skills: ${finalResultScoreText}\n` : '';

      text += this.extraInfoForm.value.goodAt ? `Good at: ${this.extraInfoForm.value.goodAt}\n` : '';
      text += this.extraInfoForm.value.badAt ? `Bad at: ${this.extraInfoForm.value.badAt}\n` : '';
      text += this.extraInfoForm.value.durationMinutes ? `Interview duration: ${this.extraInfoForm.value.durationMinutes} minutes\n` : '';
      text += this.overviewForm.value.finalResultLevel ? `Final result level: ${this.overviewForm.value.finalResultLevel}\n` : '';

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
