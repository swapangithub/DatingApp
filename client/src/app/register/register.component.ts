import { AccountService } from '../_services/account.service';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //@Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  registerForm : FormGroup;
  maxDate: Date;
  validationsErrors: string[] = [];

  constructor(private accountService : AccountService, private toastr:ToastrService, 
    private fb: FormBuilder,
    private router: Router) {

   }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
   
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender : ['male'],
      username : ['', Validators.required],
      knownAs : ['', Validators.required],
      dateOfBirth : ['', Validators.required],
      city : ['', Validators.required],
      country : ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });
  }

  matchValues(matchTo : string): ValidatorFn{
    return (control : AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching : true}
    }
  }

  register(){

    //console.log(this.registerForm.value);

    this.accountService.register(this.registerForm.value).subscribe(response=>{
       this.router.navigateByUrl('/members');
       this.cancel();
     }, error=>{
       this.validationsErrors = error;
     })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
