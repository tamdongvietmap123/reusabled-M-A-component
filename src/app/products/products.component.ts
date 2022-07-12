import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from '../dialog/dialog.component';
import { UserService } from '../services/users.service'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";

export interface User {
  isSelected: boolean;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  isEdit: boolean;
}

export const UserColumns = [
  {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  },
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    required: true,
  },
  {
    key: 'lastName',
    type: 'text',
    label: 'Last Name',
  },
  {
    key: 'email',
    type: 'email',
    label: 'Email',
    required: true,
    pattern: '.+@.+',
  },
  {
    key: 'birthDate',
    type: 'date',
    label: 'Date of Birth',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  displayedColumns: string[] = UserColumns.map((col) => col.key);
  columnsSchema: any = UserColumns;
  dataSource = new MatTableDataSource<User>();
  valid: any = {};
  arr: User[] = [];
  posts:any = [
    {
      id: 1,
      title: 'Angular Http Post Request Example'
    },
    {
      id: 2,
      title: 'Angular 8 Routing and Nested Routing Tutorial With Example'
    },
    {
      id: 3,
      title: 'How to Create Custom Validators in Angular 8?'
    },
    {
      id: 4,
      title: 'How to Create New Component in Angular 8?'
    }
  ];

  constructor(public dialog: MatDialog, private _userService: UserService) { }

  ngOnInit() {
    this._userService.getUsers().subscribe((res: any) => {
      this.dataSource.data = res;
    });
  }

  editRow(row: User) {
    if (row.id === 0) {
      this._userService.addUser(row).subscribe((newUser: User) => {
        row.id = newUser.id;
        row.isEdit = false;
      });
    } else {
      this._userService.updateUser(row).subscribe(() => (row.isEdit = false));
    }
  }

  addRow(): void {
    const newRow: User = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      birthDate: '',
      isEdit: true,
      isSelected: false,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  removeRow(id: number): void {
    this._userService.deleteUser(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(
        (u: User) => u.id !== id
      );
    });
  }

  removeSelectedRows() {
    const users = this.dataSource.data.filter((u: User) => u.isSelected);
    this.dialog
      .open(DialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this._userService.deleteUsers(users).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: User) => !u.isSelected
            );
          });
        }
      });
  }

  inputHandler(e: any, id: number, key: string) {
    if (!this.valid[id]) {
      this.valid[id] = {};
    }
    this.valid[id][key] = e.target.validity.valid;
  }

  disableSubmit(id: number) {
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false);
    }
    return false;
  }








  

  callFunction(event: any, post: any) {
    console.log(post,event.target,event.post);
  }

  clickFunction() {
    alert("clicked me!");
  }

}
