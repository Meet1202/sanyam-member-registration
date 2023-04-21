import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  isAdmin: boolean = false;
  allMembers: any = [];
  volunteers: any = [];

  constructor(private http: HttpClient, private router: Router) { 
    this.form = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      email: new FormControl(''),
      mobile_number: new FormControl('', [Validators.required]),
      whatsapp_number: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      occupation: new FormControl('', [Validators.required]),
      joining_date: new FormControl('', [Validators.required]),
      monthly_amount: new FormControl('', [Validators.required]),
      user_type: new FormControl('MEMBER'),
      added_by : new FormControl(''),
      status : new FormControl(''),
      reference : new FormControl(''),
    })
  }

  ngOnInit(): void {
    const url = window.location.href;
    this.getAllMembers();
    if(url.includes('admin')){
      this.isAdmin = true
    }
  }

  get registerForm() { return this.form.controls }

  getAllMembers() {
    this.allMembers = [];
    this.http.get(environment.api + 'users').subscribe({
      next: (res: any) => {
        this.allMembers = res.data;
        if (this.volunteers.length == 0) {
          this.getVolunteers();
        }
      },
      error: (err: any) => {
        console.log(err.error.message);
      }
    })
  }

  getVolunteers() {
    this.volunteers = [];
    this.allMembers.find((res:any)=>{
      if(res.user_type == 'ADMIN' || res.user_type == 'VOLUNTEER'){
        this.volunteers.push(res);
      }
    })
  }

  register(){
    if(this.form.valid){
      this.form.value['password']='test@123';
      console.log(this.form.value);
      this.http.post(environment.api + 'users', this.form.value).subscribe({
        next: (res: any) => {
          this.router.navigate(['/thankyou']);
        },
        error: (err: any) => {
          console.log(err.error.message);
        }
      })
    }
  }

}
