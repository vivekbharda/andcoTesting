import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { AlertService } from '../services/alert.service';
import { from } from 'rxjs';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
import { CommentStmt } from '@angular/compiler';
declare var $: any;
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  index = 0
  totalCount = 4
  signUpForm: FormGroup;
  isDisable = false
  submitted = false;
  match: boolean = true;
  // userDetails = {  firstName: '', lastName: '' }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _loginService: LoginService,
    private alertService: AlertService
  ) { }

  ngOnInit() {

    /**
     * SignUp form for new user
     */
    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      // mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    })
  }






  /**
   * @param index Index of section
   * Get details of user 
   */
  personalDetails() {
    console.log("details of user name=========", this.signUpForm.value)
    // delete this.signUpForm.controls.confirmPassword
    this.signUpForm.removeControl('confirmPassword')
    this._loginService.signUpOfEmail(this.signUpForm.value).subscribe((res: any) => {
      console.log("user created completed", res)
      this.router.navigate(['/login']);
    }, error => {
      console.log("error while create new user", error)
    })
  }

  /** 
   * @param index 
   * Get user email to send verification code 
   */
  emailDetails(index) {
    this.index = Number(index) + + 1
  }

  /** 
   * @param index 
   * Send mail to new user for varification code
   */
  verificationCode(index) {
    console.log("index of sectioni", index)
    console.log("emails details", this.signUpForm.controls.email.value)
    let email = this.signUpForm.controls.email.value
    this._loginService.mailSendForCode(email).subscribe((res: any) => {
      console.log("code send to uesr", res)
      this.index = Number(index) + + 1
    }, error => {
      console.log("error while send code to user", error)
    })
  }

  /** 
   * @param data (email of user)
   * @param index Index of section
   * Verify user email with code
   */
  verifyCode(data, index) {
    const verified = {
      code: data,
      email: this.signUpForm.controls.email.value
    }
    console.log("details to check email is right or not", verified)
    this._loginService.verificationCode(verified).subscribe((res: any) => {
      console.log("verification completed", res)
      this.index = Number(index) + + 1
    }, error => {
      console.log("error while verify user", error)
      this.alertService.getError(error.error.message)
    })
  }


  comparePassword(form, index) {
    // console.log("new password with =====", newPassword)
    // this.isDisable = true
    console.log(form.value.password == form.value.confirmPassword, this.match);
    if (form.value.password === form.value.confirmPassword) {
      console.log("In true condition");
      this.match = false;
      // this.isDisable = false

    } else {
      this.match = true;
    }

  }


  passwordUpdate(index) {
    console.log("index of current section", index)
    this.index = Number(index) + + 1
  }

  /**
   * Display error message for signUp form
   */
  get f() { return this.signUpForm.controls; }

  /**
   * @param {String} form
   * Validation of firstName in signUp form  
   */
  validateFirstName(form) {
    console.log(form);
    const nameInput = /[a-zA-Z ]/;

    $("#firstName").on({
      keydown: function (e) {
        if (e.which === 32)
          return false;
      },
      change: function () {
        this.value = this.value.replace(/\s/g, "");
      }
    });
    let message1 = document.getElementById('message1');
    if (!form.firstName.match(nameInput)) {
      console.log("message==========", message1)
      message1.innerHTML = "Name can not start with digit"
    } else {
      message1.innerHTML = "";
    }
  }
  /**
     * @param {String} form
     * Validation of lastName in signUp form  
     */
  validateLastName(form) {
    this.isDisable = false;
    console.log(form);
    const nameInput = /[a-zA-Z ]/;
    $("#lastName").on({
      keydown: function (e) {
        if (e.which === 32)
          return false;
      },
      change: function () {
        this.value = this.value.replace(/\s/g, "");
      }
    });
    let message1 = document.getElementById('message2');
    if (!form.firstName.match(nameInput)) {
      console.log("message==========", message1)
      message1.innerHTML = "Name can not start with digit"
    } else {
      message1.innerHTML = "";
    }
  }
}
