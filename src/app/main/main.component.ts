import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      candidateName: [null, Validators.required],
      interviewerName: [null],
      date: [Date.now()],
      relevantExperience: [null]
    });
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
