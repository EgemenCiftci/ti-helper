import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../file.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  form!: FormGroup;
  tiDirectoryName?: string;
  candidateNames: string[] = [];

  constructor(private formBuilder: FormBuilder, 
              private fileService: FileService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      candidateName: [null, Validators.required],
      interviewerName: [null],
      date: [Date.now()],
      relevantExperience: [null]
    });
  }

  async selectTiDirectory() {
    await this.fileService.getDirectoryHandle();
    this.tiDirectoryName = this.fileService.tiDirectoryHandle?.name;
    this.candidateNames = await this.fileService.getCandidateNames();
  }

  submit() {
    if (!this.form?.valid) {
      return;
    }

    console.log(this.form.value);
  }

  createCandidateFolder() {
    console.log('create candidate folder');
  }

  updateCandidateFolder() {
    console.log('update candidate folder');
  }

  openCandidateFolder() {
    console.log('open candidate folder');
  }

}
