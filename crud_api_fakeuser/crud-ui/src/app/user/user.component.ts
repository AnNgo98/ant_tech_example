import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UserService } from '../shared/user.service';
import { user } from '../shared/user.model';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormBuilder, FormGroup, Form } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import {MatDialog, MatDialogConfig} from '@angular/material";
import { ModalComponent } from '../modal/modal.component';
import * as _ from 'lodash';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService, NgbModalConfig, NgbModal]
})
export class UserComponent implements OnInit {

  role: string[] = ['User', 'Admin', 'Guest'];
  users: user[]
  p: Number = 1;
  count: Number = 10;
  objectId: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  roles: string;

  constructor(private userService: UserService
    , private toastr: ToastrService
    , private modalService: NgbModal
    , private fb: FormBuilder
    , public dialog: MatDialog) {
    this.getUserList();
  }

  ngOnInit() {

  }

  openDialog() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "500px";
    this.dialog.open(ModalComponent);
  }

  openDialogEdit(user) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "500px";
    const getUser = () => {
      this.getUserList();
    }
    dialogConfig.data = {
      getUser: getUser,
      objectId: user.objectId,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      roles: user.roles,
      // ...user // trộn object
    }
    this.dialog.open(ModalComponent, dialogConfig);
  }
  getUserList() {
    this.userService.getUserList().subscribe((res: { results: user[] }) => {
      this.users = res.results;
      console.log(this.users)
    })
  }

  onDelete(_id) {
    if (confirm("Are you sure ?")) {
      this.userService.deleteUser(_id)
        .subscribe(res => {
          this.getUserList();
          this.toastr.success('Delete succsessfully');
        },
          err => {
            console.log(err);
          })
    }
  }
}