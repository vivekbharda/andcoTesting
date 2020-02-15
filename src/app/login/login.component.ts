import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { AlertService } from '../services/alert.service';
import { config } from '../config'
// Google Login Service
import { AuthService } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";


// faceBookLogin

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { from } from 'rxjs';
declare const $: any;

declare const FB: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  FB: any;

  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  isDisable = false;
  isUserLoggedIn = false;
  isLoad = false;
  userName
  isCelebrant
  eventIdWithLogin = JSON.parse(sessionStorage.getItem('newEventId'));
  varificationEmail
  constructor(
    public _loginService: LoginService,
    public router: Router,
    public alertService: AlertService,
    private authService: AuthService
  ) {
    if (this._loginService.currentUserValue) {
      this.router.navigate(['/menu']);
    }


    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '482643935736240',
        cookie: true,
        xfbml: true,
        version: 'v6.0'
      });

      FB.AppEvents.logPageView();

    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


  }

  ngOnInit() {




    /**
     * Login form for user
     */
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });


    /**
     * Forgot password forn
     */
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });


    /**
     * AppId of facebook to login with facebook 
     */




  }

  // public socialSignIn(socialProvider: string) {
  //   let socialPlatformProvider;
  //   if (socialProvider === 'facebook') {
  //     socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
  //   } else if (socialProvider === 'google') {
  //     socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
  //   }
  //   this.authService.signIn(socialPlatformProvider).then(socialusers => {
  //     console.log(socialProvider, socialusers);
  //     console.log(socialusers);
  //     // this.Savesresponse(socialusers);

  //   });
  // }

  /**
   * function of display error 
   */
  get f() { return this.loginForm.controls; }

  get g() { return this.forgotPasswordForm.controls; }



  /**
   * @param {JSON} email,password
   * for login with created email and password
   */
  onSubmitLogin() {
    this.isLoad = true;
    this.isDisable = true;
    console.log("login details", this.loginForm);
    this._loginService.login(this.loginForm.value)
      .subscribe(data => {
        console.log("data of invalid user", data);
        let firstName = data.data.firstName
        this.userName = firstName;
        console.log(this.userName);
        console.log("response of login user", data);
        // this.userRole = data.data.UserRole;
        console.log("admin login entry", data.data.UserRole);
        sessionStorage.setItem('userRole', JSON.stringify(data.data.UserRole));
        sessionStorage.setItem('userName', JSON.stringify(this.userName));
        console.log(this.isCelebrant);
        this.isDisable = true;
        if (this.eventIdWithLogin) {
          this.isLoad = false;
          this.isUserLoggedIn = true;
          sessionStorage.setItem('isUserLoggedIn', JSON.stringify(this.isUserLoggedIn));
          // this.router.navigate(['/home/view-event/', this.eventIdWithLogin])
        } else if (data.data.UserRole == 'admin') {
          this.isLoad = false
          // this.router.navigate(['/home/admin-dashboard']);
        } else if (data.data.UserRole == 'user') {
          let eventList = data.userEvents
          console.log("detils of event list", eventList)
          this.isLoad = false
          this.isUserLoggedIn = true;
          sessionStorage.setItem('isUserLoggedIn', JSON.stringify(this.isUserLoggedIn));
          sessionStorage.setItem('userEvent', JSON.stringify(eventList))
          this.router.navigate(['/menu']);
        }
      }, (err: any) => {
        this.isLoad = false;
        let varification = err.error.data;
        console.log("err of invalid", err)
        this.alertService.getError(err.error.message)
        this.isDisable = false;
        this.loginForm.reset();
        this.varificationEmail = varification.useremail
        sessionStorage.setItem('varificationEmail', JSON.stringify(this.varificationEmail));
        this.router.navigate(['/verification']);
      })
  }



  /**
   * Login with google account  
   */
  signInWithGoogleAccount() {
    this.isLoad = true;
    this.isDisable = true;
    console.log("In func")
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((res) => {
      console.log("response of google login ", res);
      const googleIdToken = res.idToken;
      console.log("google id of login user", googleIdToken);
      this._loginService.googleLogin(googleIdToken).subscribe(data => {
        let firstName = data.data.firstName
        let lastName = data.data.lastName
        this.userName = firstName;
        console.log(this.userName);
        console.log("response of login user", data);
        // this.userRole = data.data.UserRole;
        console.log("admin login entry", data.data.UserRole);
        sessionStorage.setItem('userRole', JSON.stringify(data.data.UserRole));
        sessionStorage.setItem('userName', JSON.stringify(this.userName));
        console.log("response positive of google", data);
        if (this.eventIdWithLogin) {
          this.isLoad = false;
          this.isUserLoggedIn = true;
          sessionStorage.setItem('isUserLoggedIn', JSON.stringify(this.isUserLoggedIn));
          this.router.navigate(['/home/view-event/', this.eventIdWithLogin])
        }
        else {
          this.isLoad = false
          this.isDisable = false;
          this.isUserLoggedIn = true;
          sessionStorage.setItem('isUserLoggedIn', JSON.stringify(this.isUserLoggedIn));
          this.router.navigate(['/home']);
        }
      }, err => {
        this.isLoad = false;
        console.log("error display", err);
        this.alertService.getError(err.error.message);
      })
    }).catch((err) => {
      console.log(err);
    });
  }



  /**
   * Login with facebook account
   */
  signWithFacebook() {


    // FB.getLoginStatus(function (response) {
    //   console.log("response of facebook ", response)
    //   // statusChangeCallback(response);
    // });
    this.isLoad = true;
    this.isDisable = true;
    console.log("submit login to facebook");
    FB.login((response) => {
      console.log('submitLogin', response);
      let facebookId = response.authResponse.accessToken;
      console.log("facebook id of user", facebookId);
      if (response.authResponse) {
        this._loginService.facebookLogin(facebookId)
          .subscribe((data: any) => {
            console.log("data of facebook login user", data);
            let firstName = data.data.firstName
            let lastName = data.data.lastName
            this.userName = firstName;
            sessionStorage.setItem('userRole', JSON.stringify(data.data.UserRole));
            sessionStorage.setItem('userName', JSON.stringify(this.userName));

            if (this.eventIdWithLogin) {
              this.isLoad = false
              this.isUserLoggedIn = true;
              sessionStorage.setItem('isUserLoggedIn', JSON.stringify(this.isUserLoggedIn));
              this.router.navigate(['/home/view-event/', this.eventIdWithLogin])
            }
            else {
              this.isLoad = false
              this.router.navigate(['/home']);
              this.isDisable = false;
              this.isUserLoggedIn = true;
              sessionStorage.setItem('isUserLoggedIn', JSON.stringify(this.isUserLoggedIn));
            }
          }, err => {
            this.isLoad = false;
            console.log("error display", err);
            this.alertService.getError(err.error.message);
          })
      }
      else {
        console.log('User login failed');
      }
    });

  }
}
