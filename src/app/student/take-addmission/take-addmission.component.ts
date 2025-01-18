import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddEditTakeAddmissionComponent } from '../add-edit-take-addmission/add-edit-take-addmission.component';
import { ThemePalette } from '@angular/material/core';
import { ManageService } from 'src/app/manage.service';
import { StudentProfileComponent } from '../student-profile/student-profile.component';
import { StdICardGenerateComponent } from 'src/app/institute/std-i-card-generate/std-i-card-generate.component';

@Component({
  selector: 'app-take-addmission',
  templateUrl: './take-addmission.component.html',
  styleUrls: ['./take-addmission.component.css']
})
export class TakeAddmissionComponent implements OnInit {
  displayedColumns: string[] = ['admission_id', 'regist_no', 'std_name', 'roll_no', 'course_name', 'batch_name', 'std_whatsapp_no', 'admission_date','description', 'batch_status', 'action'];
  dataSource = new MatTableDataSource();
  count_admission: number = 0;
  color: ThemePalette = 'primary'
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tabledata: any;
  paginatorRef: any;
  login_deatils: any
  login: any
  inst_id: any
  std_id_for_std_login: any
  profile_status:any = 0
  constructor(
    private dailog: MatDialog,
    private router: Router,
    private service: ManageService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.std_id_for_std_login = this.login.std_id
  }

  ngOnInit(): void {
    const formdata = new FormData()
    formdata.append('std_id', this.std_id_for_std_login)
    this.service.get_admission_id_by_std_id(formdata).subscribe(
      (res: any) => {
        console.log(res)
        this.dataSource.data = res.data
        this.dataSource.sort = this.sort;
        this.count_admission = res.data.length
      }
    )

    this.service.get_student_by_std_id(formdata).subscribe(
      (res:any)=>{
        console.log(res.data.profile_status)
        this.profile_status = res.data.profile_status
      }
    )
  }
  take_addmission() {
    if (this.profile_status == 0) {
      this.dailog.open(StudentProfileComponent, {
        disableClose: true,
        panelClass:'all_dialog'
      });
    }
    else {
      this.dailog.open(AddEditTakeAddmissionComponent, {
        disableClose: true
      });
    }

  }


  onIcard(data: any) {
    this.dailog.open(StdICardGenerateComponent, {
      data: data,
      disableClose: false,
      panelClass: 'iCarddialog'
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