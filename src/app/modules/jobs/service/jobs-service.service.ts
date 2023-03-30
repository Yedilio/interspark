import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { JobsModel } from '../models/jobs.model';

@Injectable({
  providedIn: 'root',
})
export class JobsServiceService {
  constructor(private http: HttpClient) {}

  getJobs(): Observable<JobsModel[]> {
    return this.http.get<JobsModel[]>('http://localhost:3000/jobs');
  }

  getJobById(id: number): Observable<JobsModel> {
    return this.http.get<JobsModel>(`http://localhost:3000/jobs/${id}`);
  }

  addJob(body: JobsModel) {
    return this.http.post('http://localhost:3000/jobs', body);
  }

  updateJob(body: JobsModel) {
    return this.http.put(`http://localhost:3000/jobs/${body.id}`, body);
  }

  deleteJob(id: number) {
    return this.http.delete(`http://localhost:3000/jobs/${id}`);
  }
}
