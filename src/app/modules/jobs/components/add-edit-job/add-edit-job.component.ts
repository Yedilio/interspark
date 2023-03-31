import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, Subject, take, takeUntil } from 'rxjs';
import { JobsServiceService } from '../../service/jobs-service.service';
import { JobsModel } from '../../models/jobs.model';

@Component({
  selector: 'app-add-edit-job',
  templateUrl: './add-edit-job.component.html',
  styleUrls: ['./add-edit-job.component.scss'],
})
export class AddEditJobComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  model!: NgbDateStruct;
  loading: boolean = true;
  isEdit: boolean = false;

  destroy$ = new Subject();

  constructor(
    private builder: FormBuilder,
    private route: Router,
    private router: ActivatedRoute,
    private service: JobsServiceService
  ) {}

  ngOnInit(): void {
    this.router.params.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      const id = Number(res['id']);
      if (!isNaN(id)) {
        this.isEdit = true;
        this.service
          .getJobById(id)
          .pipe(take(1))
          .subscribe((job) => {
            this.createForm(job);
          });
      } else {
        this.isEdit = false;
        this.createForm();
      }
    });
  }

  createForm(job: JobsModel | null = null) {
    let startDate = null;
    let endDate = null;

    if (job?.jobStartDate) {
      const date = job.jobStartDate.split('-');
      startDate = {
        year: Number(date[0]),
        month: Number(date[1]),
        day: Number(date[2]),
      };
    }

    if (job?.jobCloseDate) {
      const date = job.jobCloseDate.split('-');
      endDate = {
        year: Number(date[0]),
        month: Number(date[1]),
        day: Number(date[2]),
      };
    }

    this.form = this.builder.group({
      id: [job?.id || null, []],
      jobNumber: [job?.jobNumber || null, [Validators.required]],
      jobTitle: [job?.jobTitle || null, [Validators.required]],
      jobStartDate: [startDate, [Validators.required]],
      jobCloseDate: [endDate, [Validators.required]],
      experienceRequired: [job?.experienceRequired || false, []],
      numberOfOpenings: [job?.numberOfOpenings || null, []],
      jobNotes: [job?.jobNotes || null, []],
    });

    this.loading = false;
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    if (!this.isEdit) {
      delete value.id;
    }

    if (value.jobStartDate) {
      value.jobStartDate = `${value.jobStartDate.year}-${value.jobStartDate.month}-${value.jobStartDate.day}`;
    }

    if (value.jobCloseDate) {
      value.jobCloseDate = `${value.jobCloseDate.year}-${value.jobCloseDate.month}-${value.jobCloseDate.day}`;
    }

    const api = this.isEdit
      ? this.service.updateJob(value)
      : this.service.addJob(value);

    api
      .pipe(
        take(1),
        catchError(() => {
          return of({
            result: [],
            success: false,
          });
        })
      )
      .subscribe(() => {
        this.route.navigate(['/jobs']).then();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
