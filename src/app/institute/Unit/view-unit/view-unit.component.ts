import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ManageService } from 'src/app/manage.service';
import { AddunitComponent } from '../addunit/addunit.component';
import { ConfirmBoxComponent } from '../../confirm-box/confirm-box.component';


@Component({
  selector: 'app-view-unit',
  templateUrl: './view-unit.component.html',
  styleUrls: ['./view-unit.component.css']
})
export class ViewUnitComponent implements OnInit {

  displayedColumns: string[] = ['unit_id', 'course_id_fk', 'unitname', 'unitdesc', 'action'];
  dataSource = new MatTableDataSource();
  count_inst_book: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  imgUrl: string = '';
  login_deatils: any
  login: any
  inst_id: any
  inst_id_for_inst_login: any
  action_btn: boolean = false
  inst_id_for_admin: any;
  inst_id_for_std: any;
  deletevalue: any = 1

  constructor(
    private dailog: MatDialog,
    private router: Router,
    private service: ManageService,
    private popup: NgToastService,

  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    const institute_data = this.router.getCurrentNavigation();
    this.inst_id_for_admin = institute_data?.extras
    console.log("admin" + this.inst_id_for_admin)
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.inst_id_for_std = this.login.institute_id_fk
    this.inst_id_for_inst_login = this.login.inst_id
    console.log("std" + this.inst_id_for_std)
    console.log("inst" + this.inst_id_for_inst_login)

    this.service.imgBaseUrl.subscribe(
      (res: any) => {
        this.imgUrl = res
      }
    )
  }

  ngOnInit(): void {
    if (this.inst_id_for_admin) {
      this.get_book_by_inst_id(this.inst_id_for_admin);
    }
    if (this.inst_id_for_inst_login) {
      this.get_book_by_inst_id(this.inst_id_for_inst_login)
    }
    if (this.inst_id_for_std) {
      this.action_btn = true
      this.displayedColumns = ['unit_id', 'course_id_fk', 'unitname', 'unitdesc', 'action'];
      const instformdata = new FormData()
      instformdata.append('inst_id', this.inst_id_for_std)
      instformdata.append('std_id', this.login.std_id)
      this.service.get_book_for_std(instformdata).subscribe(
        (result: any) => {
          console.log(result)
          this.dataSource.data = result.data
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.count_inst_book = result.data.length
          return
        }
      )
    }
  }

  get_book_by_inst_id(inst_for_all: any) {
    const instformdata = new FormData()
    instformdata.append('inst_id', inst_for_all)
    this.service.get_unit_by_inst_id(instformdata).subscribe(
      (res: any) => {
        console.log(res)
        this.dataSource.data = res.data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.count_inst_book = res.data.length
      }
    )
  }

  add_batch(): any {
    this.dailog.open(AddunitComponent, {
      disableClose: true
    });
  }

  batch_edit(row: any) {
    this.dailog.open(AddunitComponent, {
      data: row,
    });
  }


  onDelete(row: any) {
    const dialogRef = this.dailog.open(ConfirmBoxComponent, {
      data: this.deletevalue,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.deletevalue == result) {
        const deldata = new FormData();
        deldata.append('unit_id', row.unit_id);
        this.service.unit_delete(deldata).subscribe(
          (res: any) => {
            console.log(res)
            this.popup.success({ detail: 'Success', summary: 'Unit Deleted', })
            this.router.navigate(['/institutehome/unitview']);
          }
        )
      }
      else { }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
