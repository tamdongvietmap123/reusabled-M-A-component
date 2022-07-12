import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['id', 'address', 'house_number', 'street_name', 'ward', 'district', 'city', 'action'];
  dataSource!: MatTableDataSource<any>;
  signedUser!: '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private _apiService: ApiService) { }

  ngOnInit(): void {
    this.getAllProduct()
    console.log(this.signedUser);

  }

  getAllProduct = () => {
    this._apiService.getProduct().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        this.signedUser = (res)
        console.log(this.signedUser)
        return this.signedUser
      },
      error: () => { alert('get failed') }
    })
  }

  // action column
  editAddress = (row: any) => {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllProduct()
      }
    })
  }

  delAddress = (id: number) => {
    this._apiService.deleteProduct(id).subscribe({
      next: (value) => {
        alert("toang roi!")
        this.getAllProduct()
      },
      error(err) {
        alert('chuatoang')
      },
    })
  }
  // material api function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
