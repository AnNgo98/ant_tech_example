import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../shared/user.service';
// import { UserComponent } from '../user/user.component';
import { FormControl, Validators } from '@angular/forms';
import { NgForm, FormBuilder, FormGroup, Form } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserComponent } from '../user/user.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { user } from '../shared/user.model';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  users: user[]
  role: string[] = ['User', 'Admin', 'Guest'];
  formatEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  formatPass = "^(?=.*[@*#])(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$"
  form: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.formatEmail)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern(this.formatPass)]),
    objectId: new FormControl(''),
    roles: new FormControl('', [Validators.required]),
  })

  constructor(public userService: UserService
    , private fb: FormBuilder
    , private toastr: ToastrService
    , public dialogRef: MatDialogRef<ModalComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
    this.form.get('objectId').setValue(this.data.objectId)
    this.form.get('first_name').setValue(this.data.first_name)
    this.form.get('last_name').setValue(this.data.last_name)
    this.form.get('email').setValue(this.data.email)
    this.form.get('password').setValue(this.data.password)
    this.form.get('roles').setValue(this.data.roles)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.toastr.warning("Filter missed")
    }
    else {
      if (!this.form.value.objectId) {
        this.insertUser();
      }
      else {
        this.updateUser();
      }
    }
  }

  insertUser() {
    let data = this.form.value;
    this.userService.createUser(data).subscribe(
      res => {
        this.toastr.success('Submitted successfully', 'create user successfully');
        // this.data.getUser();
        this.onNoClick();
      },
      err => {
        console.log(err);
      }
    )
  }

  updateUser() {
    let data = this.form.value;
    this.userService.editUser(data).subscribe(
      res =>{
        this.toastr.success('Submittedd successfully', 'update user successfully ')
        this.data.getUser();
        this.onNoClick();
      }
    )
  }

}
