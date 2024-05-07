import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-trial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-trial.component.html',
  styleUrl: './audit-trial.component.scss'
})
export class AuditTrialComponent implements OnInit {
  userData;

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('User'));
  }
  
}
