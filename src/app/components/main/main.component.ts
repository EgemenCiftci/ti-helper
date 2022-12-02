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
      const candidateName = val.trim();
      this.isInUpdateMode = this.candidateNames.includes(candidateName);
      if (this.isInUpdateMode) {
          this.setExcelData(await this.fileService.getCandidateData(candidateName));
      }
    });
  }

  async selectTiDirectory() {
    await this.fileService.initialize();
    this.tiDirectoryName = this.fileService.tiDirectoryHandle?.name;
    this.candidateNames = await this.fileService.getCandidateNames();
    this.questionMaterials = await this.fileService.getQuestionMaterials();
  }

  async submit() {
    if (!this.form?.valid) {
      return;
    }

    const excelData = this.getExcelData(this.form.value);

    if (this.isInUpdateMode) {
      await this.updateCandidateFolder(excelData);
    } else {
      await this.createCandidateFolder(excelData);
      this.candidateNames = await this.fileService.getCandidateNames();
      this.isInUpdateMode = this.candidateNames.includes(this.form.value.candidateName.trim());
    }
  }

  getExcelData(formValue: any): ExcelData {
    return {
      candidateName: formValue.candidateName.trim(),
      interviewerName: formValue.interviewerName.trim(),
      date: formValue.date,
      relevantExperience: formValue.relevantExperience
    };
  }

  setExcelData(excelData: ExcelData) {
    this.form.patchValue({
      interviewerName: excelData.interviewerName,
      date: excelData.date,
      relevantExperience: excelData.relevantExperience
    });
  }

  async createCandidateFolder(excelData: ExcelData) {
    await this.fileService.createCandidateFolder(excelData);
  }

  async updateCandidateFolder(excelData: ExcelData) {
    await this.fileService.updateCandidateFolder(excelData);
  }

  async copyAspNetCoreCodeAndOpenWebsite() {
    const code = await this.fileService.getAspNetCoreCode();
    await this.copyToClipboard(code);
    this.openWebsiteInNewTab();
  }

  async copyWpfCodeAndOpenWebsite() {
    const code = await this.fileService.getWpfCode();
    await this.copyToClipboard(code);
    this.openWebsiteInNewTab();
  }

  openWebsiteInNewTab() {
    window.open(this.settingsService.websiteUrl, "_blank");
  }

  async selectQuestionMaterial(qm: QuestionMaterial) {
    if (qm.code) {
      await this.copyToClipboard(qm.code);
    }
  }

  async copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    this.snackBarService.showSnackBar('Copied to clipboard');
  }
}
