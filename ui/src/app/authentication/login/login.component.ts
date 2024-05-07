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
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      if(this.allowedUsers.some(user => user.userName === credentials.username && user.password === credentials.password)){
        localStorage.setItem('User',JSON.stringify({user:credentials.username, activity:'LogIn',date: this.getCurrentDateFormatted(),time: this.getCurrentDateTime()}));
        this.router.navigate(['/home']);
      }else{
        this.showError = true;
      }
    } else {
      this.showError = true;
    }
  }


  getCurrentDateFormatted(): string {
    const date = new Date();
    const day = this.addZero(date.getDate());
    const month = this.addZero(date.getMonth() + 1);
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  getCurrentDateTime(): string {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let minutesAdded: string;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight
    minutesAdded = this.addZero(minutes);
    const formattedTime = `${hours}:${minutesAdded} ${ampm}`;
    return formattedTime;
  }

  addZero(value: number): string {
    return value < 10 ? '0' + value : '' + value;
  }
}
