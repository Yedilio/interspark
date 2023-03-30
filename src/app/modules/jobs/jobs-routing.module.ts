import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './components/jobs/jobs.component';
import { AddEditJobComponent } from './components/add-edit-job/add-edit-job.component';
import { JobsListComponent } from './components/jobs-list/jobs-list.component';

const routes: Routes = [
  {
    path: '',
    component: JobsComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: JobsListComponent },
      { path: ':id', component: AddEditJobComponent },
      { path: 'new', component: AddEditJobComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobsRoutingModule {}
