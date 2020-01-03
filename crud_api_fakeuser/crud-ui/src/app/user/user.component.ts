import { Component, OnInit,Inject} from '@angular/core';
import { UserService } from '../shared/user.service';
import { user } from '../shared/user.model';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService,NgbModalConfig, NgbModal]
})
export class UserComponent implements OnInit {
  formatEmail=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  formatPass ="^(?=.*[@*#])(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$"
  first_name = new FormControl('',[Validators.required]);
  last_name = new FormControl('', [Validators.required]);
  email = new FormControl('',[Validators.required, Validators.email,Validators.pattern(this.formatEmail)]);
  password = new FormControl('',[Validators.required, Validators.minLength(8),Validators.maxLength(10),Validators.pattern(this.formatPass)]);
  objectId = new FormControl('');
  roles = new FormControl('',[Validators.required]);
  formItem: FormGroup;

  role: string[] = ['User', 'Admin', 'Guest'];
  users: user[]
  constructor(private userService: UserService
    , private toastr: ToastrService
    , private modalService: NgbModal
    , private fb: FormBuilder) {
    this.userService.getUserList().subscribe((res: any) => {
      this.users = res.results as user[]
      console.log(this.users);
    })
  }


  ngOnInit() {
    this.formItem = this.fb.group({
      objectId: this.objectId,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password,
      roles: this.roles
    });
  }

  resetForm(){
    this.formItem.get('objectId').setValue("")
    this.formItem.get('first_name').setValue("")
    this.formItem.get('last_name').setValue("")
    this.formItem.get('email').setValue("")
    this.formItem.get('password').setValue("")
    this.formItem.get('roles').setValue("")
    this.modalService.dismissAll();
  }
  openCreate(content){
    this.modalService.open(content);
  }
  openUpdate(content, currentUser) {
    this.formItem.get('objectId').setValue(currentUser.objectId)
    this.formItem.get('first_name').setValue(currentUser.first_name)
    this.formItem.get('last_name').setValue(currentUser.last_name)
    this.formItem.get('email').setValue(currentUser.email)
    this.formItem.get('password').setValue(currentUser.password)
    this.formItem.get('roles').setValue(currentUser.roles)
    this.modalService.open(content);
  }
  insertUser(){
    let data = this.formItem.value;
    this.userService.createUser(data).subscribe(
      res =>{
        this.toastr.success('Submitted succsessfully','create user succsessfully');
        this.userService.getUserList().subscribe((res: any) => {
          this.users = res.results as user[]
        })
      },
      err => {
        console.log(err);
      }
    )
  }

  onSubmit(){

    if (this.formItem.invalid){
      this.toastr.warning("Filter missed")
    }
    else
    {
      if(!this.formItem.value.objectId){
        this.insertUser();
      }
      else{
        this.updateUser();
      }
    }
  }

  updateUser(){
    let data = this.formItem.value;
    this.userService.editUser(data).subscribe(
      res =>{
        // console.log("a",data.objectId)
        this.toastr.info('Submitted succsessfully','update user succsessfully');
        this.userService.getUserList().subscribe((res: any) => {
          this.users = res.results as user[]
        })
      },
      err => {
        console.log(err);
      }
    )
  }

  onDelete(_id){
    if(confirm("Are you sure ?"))
    {
      this.userService.deleteUser(_id)
      .subscribe(res=>{
        this.userService.getUserList().subscribe((res: any) => {
          this.users = res.results as user[]
        })
        this.toastr.success('Delete succsessfully');
      },
        err=>{
          console.log(err);
        })
    }
  }
}
