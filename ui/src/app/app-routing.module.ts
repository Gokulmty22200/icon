import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/guest/login',
        pathMatch: 'full'
      },
      
      {
        path: 'home',
        loadComponent: () => import('./dashboard/default/default.component')
      },
      
      {
        path: 'typography',
        loadComponent: () => import('./demo/elements/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/elements/element-color/element-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      },
      {
        path: 'mri-performance',
        loadComponent: () => import('./mri-performance/mri-performance.component').then(
          (mod) => mod.MriPerformanceComponent
        )
      },
      {
        path: 'mri-qa',
        loadComponent: () => import('./mri-qa/mri-qa.component').then(
          (mod) => mod.MriQaComponent
        )
      },
      {
        path: 'talk-to-mri',
        loadComponent: () => import('./talk-to-mri/chat-page/chat-page.component').then(
          (mod) => mod.ChatPageComponent
        )
      },
      {
        path: 'audit-trial',
        loadComponent: () => import('./audit-trial/audit-trial.component').then(
          (mod) => mod.AuditTrialComponent
        )
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'guest',
        loadChildren: () => import('./authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'live-dashboard',
    loadComponent: () => import('./dashboard/live-dashboard/live-dashboard.component').then(
      (mod) => mod.LiveDashboardComponent
    )
  },
  
  {
    path: '**',
    redirectTo: '/guest/login',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
