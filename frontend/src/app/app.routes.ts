import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import ('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'login',
        loadComponent: () => import ('./pages/login/login').then(m => m.Login)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register').then(m => m.Register)
    },
    {
        path: 'appointments',
        loadComponent: () => import('./pages/appointments/appointments').then(m => m.Appointments)
    },
    {
        path: 'appointments/create',
        loadComponent: () => import('./pages/create-appointments/create-appointments').then(m => m.CreateAppointments),
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'appointments/edit/:id',
        loadComponent: () => import('./pages/edit-appointments/edit-appointments').then(m  => m.EditAppointments)
    }
];
