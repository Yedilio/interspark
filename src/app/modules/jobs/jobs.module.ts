import { NgModule } from '@angular/core';
import { JobsComponent } from './components/jobs/jobs.component';
import { JobsRoutingModule } from './jobs-routing.module';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  NgbAlertModule,
  NgbDatepickerModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditJobComponent } from './components/add-edit-job/add-edit-job.component';
import { JobsListComponent } from './components/jobs-list/jobs-list.component';

@NgModule({
  declarations: [JobsComponent, AddEditJobComponent, JobsListComponent],
  imports: [
    JobsRoutingModule,
    NgbPaginationModule,
    FormsModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
    NgbAlertModule,
  ],
  providers: [DecimalPipe],
  bootstrap: [],
})
export class JobsModule {}
