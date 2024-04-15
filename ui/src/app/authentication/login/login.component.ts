// angular import
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showError: boolean = false;
  allowedUsers = [
    {
      userName:'mriadmin',
      password:'admin'
    },
    {
      userName:'mriuser',
      password:'user'
    },
  ];
  
  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['mriadmin', Validators.required],
      password: ['admin', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      if(this.allowedUsers.some(user => user.userName === credentials.username && user.password === credentials.password)){
        this.router.navigate(['/home']);
      }else{
        this.showError = true;
      }
    } else {
      this.showError = true;
    }
  }
}
