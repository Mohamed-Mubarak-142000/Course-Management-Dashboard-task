import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Course } from '../models/course.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/courses`;

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  addCourse(course: Course) {
    return this.http.post(this.apiUrl, course);
  }

  updateCourse(id: number, course: Course) {
    return this.http.put(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
