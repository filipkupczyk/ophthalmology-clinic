import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // const authService = inject(Auth);
  // const token = authService.getToken();

  // if (token) {
  //   const cloned = req.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
  //   return next(cloned);
  // }
  // return next(req);

  const publicEndpoints = ['/auth/login', '/users/create'];
  const isPublic = publicEndpoints.some(endpoint => req.url.includes(endpoint));

  if (isPublic) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  return next(req);
};
