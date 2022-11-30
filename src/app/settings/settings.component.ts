import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      interviewerName: [null],
      outputDirectory: ['C:\\Candidates', Validators.required],
      aspNetCoreCodePath: ['C:\\Docs\\web code review task.cs'],
      wpfCodePath: ['C:\\Docs\\desktop code review task.cs'],
      questionMaterialsPath: ['C:\\Docs\\question materials.cs'],
      interviewFormPath: ['C:\\Docs\\Interview Form CS template 0.8.xlsx'],
      websiteUrl: ['https://www.snipp.live/new']
    });
  }

  submit() {
    if (!this.form?.valid) {
      return;
    }

    console.log(this.form.value);
  }
}
