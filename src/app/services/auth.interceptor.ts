import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs/';
import { map, catchError, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
// import 'rxjs/add/operator/do';
import Swal from 'sweetalert2';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    constructor(private route: ActivatedRoute,
        private router: Router, ) { }
    /**
     * 
     * @param req 
     * @param next
     * When user request pass accessToken with all request and if any error display alert on every error
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const idtoken = JSON.parse(sessionStorage.getItem('currentUser'));
        const facebookIdToken = JSON.parse(sessionStorage.getItem('facebookUser'));
        const googleIdToken = JSON.parse(sessionStorage.getItem('googleUser'));
        const microsoftIdToken = JSON.parse(sessionStorage.getItem('microsoftUser'));
        const yahooIdToken = JSON.parse(sessionStorage.getItem('yahooUser'));
        // console.log("interceptor login user token", idtoken);

        if (idtoken || facebookIdToken || googleIdToken || microsoftIdToken || yahooIdToken) {
            const cloned = req.clone({
                headers: req.headers.set("authorization",
                    idtoken || facebookIdToken || googleIdToken || microsoftIdToken || yahooIdToken)
            });
            return next.handle(cloned)
                .pipe(
                    map((event: HttpResponse<any>) => {
                        console.log("interceptorsssssssssss events mdse ???", event);
                        // Swal.fire({type: 'success',title: 'Password Change Successfully',showConfirmButton:false,timer: 2000})
                        return event;
                    }),

                    /**
                     * 401 error 
                     */
                    catchError((error: HttpErrorResponse) => {
                        console.log("interceptorsssssssss error by meeeeeeeeeee", error);
                        const errorMessage = error.error.message;
                        console.log("error in interceptor", errorMessage);
                        // if(error.status === 400){
                        //   Swal.fire({
                        //     type: 'error',
                        //     title:  errorMessage,
                        //     showConfirmButton: false,
                        //     timer: 2000
                        //   })
                        // }
                        if (error.status === 401) {
                            const idtoken = (sessionStorage.removeItem('currentUser'));
                            Swal.fire({
                                // type: 'error',
                                title: "sorry" + errorMessage,
                                showConfirmButton: false,
                                timer: 2000
                            })
                            this.router.navigate(['/login']);
                        }
                        return throwError(error.error);
                    })
                );
        } else {
            return next.handle(req)
                .pipe(
                    map((event: HttpResponse<any>) => {
                        console.log("interceptorsssssssssss events mdse ???", event);
                        return event;
                    }),
                    catchError((error: HttpErrorResponse) => {
                        console.log("interceptorsssssssss error in login", error);
                        let errorMessage = error.error.message;
                        console.log("dkjsbkjsbbskfbdsbfbdsf", errorMessage);
                        if (error.status === 401) {
                            /**
                             * Alert of every error response
                             */
                            Swal.fire({
                                // type: 'error',
                                title: "sorry",
                                text: errorMessage,
                                showConfirmButton: false,
                                timer: 2000
                            })
                            this.router.navigate(['/login']);
                        }
                        return throwError(error);
                    })
                );
        };

    }
}