import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelData } from 'src/app/models/excel-data';
import { QuestionMaterial } from 'src/app/models/question-material';
import { FileService } from 'src/app/services/file.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  form!: FormGroup;
  tiDirectoryName?: string;
  candidateNames: string[] = [];
  isInUpdateMode = false;
  questionMaterials: QuestionMaterial[] = [];

  constructor(private formBuilder: FormBuilder,
    private fileService: FileService,
    private snackBarService: SnackBarService,
    private settingsService: SettingsService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      candidateName: [null, Validators.required],
      interviewerName: [this.settingsService.interviewerName],
      date: [new Date()],
      relevantExperience: [0]
    });

    this.form.get('candidateName')?.valueChanges.subscribe(async val => {
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
      if (!this.form?.valid) {
        return;
      }

      const excelData = this.getExcelData(this.form.value);

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
      relevantExperience: formValue.relevantExperience
    };
  }

  private setExcelData(excelData: ExcelData) {
    this.form.patchValue({
      interviewerName: excelData.interviewerName,
      date: excelData.date,
      relevantExperience: excelData.relevantExperience
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
}
