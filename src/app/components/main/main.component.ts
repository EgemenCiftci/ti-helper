import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelData } from 'src/app/models/excel-data';
import { FileService } from 'src/app/services/file.service';

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

  constructor(private formBuilder: FormBuilder,
    private fileService: FileService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      candidateName: [null, Validators.required],
      interviewerName: [null],
      date: [new Date()],
      relevantExperience: [null]
    });

    this.form.get('candidateName')?.valueChanges.subscribe(val => {
      this.isInUpdateMode = this.candidateNames.includes(val.trim());
    });
  }

  async selectTiDirectory() {
    await this.fileService.initialize();
    this.tiDirectoryName = this.fileService.tiDirectoryHandle?.name;
    this.candidateNames = await this.fileService.getCandidateNames();
  }

  async submit() {
    if (!this.form?.valid) {
      return;
    }

    const excelData = this.getExcelData(this.form.value);

    if (this.isInUpdateMode) {
      this.updateCandidateFolder(excelData);
    } else {
      await this.createCandidateFolder(excelData);
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

  async createCandidateFolder(excelData: ExcelData) {
    await this.fileService.createCandidateFolder(excelData);
  }

  async updateCandidateFolder(excelData: ExcelData) {
    await this.fileService.updateCandidateFolder(excelData);
  }
}
