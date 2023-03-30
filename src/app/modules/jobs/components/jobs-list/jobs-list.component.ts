import { Component, OnDestroy, OnInit } from '@angular/core';
import { JobsModel } from '../../models/jobs.model';
import {
  catchError,
  map,
  Observable,
  of,
  startWith,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { JobsServiceService } from '../../service/jobs-service.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.scss'],
})
export class JobsListComponent implements OnInit, OnDestroy {
  allJobs: JobsModel[] | null = [];
  filter = new FormControl('', { nonNullable: true });
  errorMessage: string = '';

  destroy$ = new Subject();
  isAdding$!: Observable<boolean> | null;
  jobs$!: Observable<JobsModel[] | null>;

  constructor(private service: JobsServiceService, private router: Router) {}

  ngOnInit(): void {
    this.getAllJobs();
    this.jobs$ = this.filter.valueChanges.pipe(
      startWith(''),
      map((text) => this.search(text))
    );
  }

  getAllJobs() {
    this.service
      .getJobs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.allJobs = res;
        this.filter.setValue('');
      });
  }

  search(text: string): JobsModel[] {
    return this.allJobs!.filter((job) => {
      const term = text.toLowerCase();
      return (
        job.jobTitle.toLowerCase().includes(term) ||
        (job.jobNotes && job.jobNotes.toLowerCase().includes(term))
      );
    });
  }

  delete(job: JobsModel) {
    this.service
      .deleteJob(job.id)
      .pipe(
        take(1),
        tap(() => (job.disabled = true)),
        catchError(() => {
          job.disabled = false;
          this.errorMessage = 'Oops, something went wrong. Please, try again.';
          setTimeout(() => (this.errorMessage = ''), 3000);
          return of(null);
        })
      )
      .subscribe(() => {
        this.getAllJobs();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
