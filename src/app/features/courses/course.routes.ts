import { Routes } from '@angular/router';

export const COURSE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/course-list/course-list').then((c) => c.CourseList),
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/add-course/add-course').then((c) => c.CourseAddComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/edit-course/edit-course').then((c) => c.CourseEdit),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/course-details/course-details').then((c) => c.CourseDetails),
  },
];
