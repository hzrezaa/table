import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {UsersService} from './users.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {ExcelService} from '../excel/excel.service';
import {map} from 'rxjs/operators';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import {chashOutPipe} from '../../pipes/chashOutPipe';
import {ActionPipe} from '../../pipes/actionPipe';
import {StatusWithdrawPipe} from '../../pipes/statusWithdrawPipe';
import {ChargePipe} from '../../pipes/chargePipe';
import {cryptoCurrencyPipe} from '../../pipes/cryptoCurrencyPipe';
import {orderStatusPipe} from '../../pipes/osrderStatusPipe';
import {farsiPipe} from '../../pipes/farsiPipe';
import {bankPipe} from '../../pipes/bankPipe';
import {Router} from '@angular/router';
import {ApiServicesService} from '../../api-services/api-services.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  constructor(private service: UsersService, private http: HttpClient, private excelservice: ExcelService, private router: Router, private api: ApiServicesService) {
    this.RequesttoserverDispay = _.debounce(this.RequesttoserverDispay, 700);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.UseUrl);
    for (let r = 0; r < this.KeyUser.length - 3; r++) {
      this.tfootCounterTd.push(r);
    }
    if (this.theme === 'light') {
      this.themes = 'table table-hover table-striped table-bordered text-center';
      this.headerColor = 'trColorLight';
      this.btnColor = 'btn btnColorLight searchPage';
    } else if (this.theme === 'dark' || this.themes === 'Dark') {
      this.themes = 'table table-hover tableDark table-bordered table-dark text-center';
      this.headerColor = 'trColor';
      this.btnColor = 'btn btn-light searchPage';
    }
    for (let c = 0; c < this.KeyUser.length; c++) {
      this.text[c] = '';
    }
    this.RequestServer();
    }

  @Input('url') public UseUrl: any;
  @Input('key') public KeyUser: any;
  @Input('theme') public theme: any;
  data: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  Data: any = [];
  loading: any = 'block';
  themes: any = 'table table-bordered table-dark table-striped text-center';
  IconSort: any = '';
  activePage: any = [1];
  filteringCounter: any = '';
  dropdownCounter: any = '';
  searchValue: any = {};
  dropdown: any = {};
  tfootCounterTd: any = [];
  filterExcel: any = [];
  btnColor: any = 'btn btn-light searchPage';
  limit: any = 10;
  total: any;
  totals: any = [];
  startPage: any;
  endPage: any;
  text: any = [''];
  textDrop: any = [''];
  flag: any = true;
  headerColor: any = 'trColor';
  isObjectData = false;
  isData = false;
  dataObject: any = [];
  params: any = {
    offset: 0,
    limit: 10,
    sortField: '',
    sortOrder: '',
    counterFilter: 0,
  };
  Offsetlimit: any = {
    limit: 10,
  };
  currentPage: any;
  range: any =  [ 1, 2 ,3 ,4 ,5];
  totalLength: any = 0;
  end: any;
  first: any;

  pipeKycStatus(res: any) {
    for (let y = 0; y < res.body.users.length; y++) {
      if (res.body.users[y].kycStatus === 'INIT') {
        res.body.users[y].kycStatus = 'ثبت شده';
      }
      if (res.body.users[y].kycStatus === 'CONFIRM') {
        res.body.users[y].kycStatus = 'تایید شده';
      }
      if (res.body.users[y].kycStatus === 'SEMICONFIRM') {
        res.body.users[y].kycStatus = 'نیمه تایید شده';
      }
      if (res.body.users[y].kycStatus === 'PENDING') {
        res.body.users[y].kycStatus = 'در حال انتظار';
      }
      if (res.body.users[y].kycStatus === 'REJECT') {
        res.body.users[y].kycStatus = 'رد شده';
      }
      if (res.body.users[y].kycStatus === 'UPDATEBANK') {
        res.body.users[y].kycStatus = 'به روز رسانی حساب بانکی';
      }
      if (res.body.users[y].kycStatus === 'FIRSTPENDING') {
        res.body.users[y].kycStatus = 'در انتظار اولین بررسی';
      }
      if (res.body.users[y].twoStepVerification === 'DEACTIVATED') {
        res.body.users[y].twoStepVerification = 'غیر فعال';
      }
      if (res.body.users[y].twoStepVerification === 'ACTIVATING') {
        res.body.users[y].twoStepVerification = 'فعال';
      }
    }
  }
  pipeHistory(res: any) {
    for (let i = 0; i < res.body.actions.length; i++) {
      if (res.body.actions[i].action === 'CREATE_PROFILE') {
        res.body.actions[i].action = 'ایجاد پروفایل';
      }
      if (res.body.actions[i].action === 'CREATE_BANK') {
        res.body.actions[i].action = 'وارد کردن اطلاعات بانکی';
      }
      if (res.body.actions[i].action === 'CREATE_CONTACT_INFO') {
        res.body.actions[i].action = 'وارد کردن اطلاعات تماس';
      }
      if (res.body.actions[i].action === 'UPDATE_PROFILE') {
        res.body.actions[i].action = 'به روزرسانی پروفایل';
      }
      if (res.body.actions[i].action === 'UPDATE_BANK') {
        res.body.actions[i].action = 'به روزرسانی بانک';
      }
      if (res.body.actions[i].action === 'UPDATE_CONTACT_INFO') {
        res.body.actions[i].action = 'به روزرسانی اطلاعات تماس';
      }
      if (res.body.actions[i].action === 'VERIFIED_EMAIL') {
        res.body.actions[i].action = 'تایید کردن آدرس ایمیل ';
      }
      if (res.body.actions[i].action === 'ADD_NATIONAL_PIC') {
        res.body.actions[i].action = 'اضافه کردن کارت ملی';
      }
      if (res.body.actions[i].action === 'ADD_SELFIE_PIC') {
        res.body.actions[i].action = 'اضافه کردن تصویر توافق نامه ';
      }
      if (res.body.actions[i].action === 'CONFIRM_ADDRESS') {
        res.body.actions[i].action = 'تایید آدرس';
      }
      if (res.body.actions[i].action === 'CONFIRM_IBAN') {
        res.body.actions[i].action = 'تایید شبا';
      }
      if (res.body.actions[i].action === 'CONFIRM_CARD') {
        res.body.actions[i].action = 'تایید کارت';
      }
      if (res.body.actions[i].action === 'CONFIRM_BANK') {
        res.body.actions[i].action = 'تایید بانک';
      }
      if (res.body.actions[i].action === 'CONFIRM_NATIONALID') {
        res.body.actions[i].action = 'تایید شماره ملی';
      }
      if (res.body.actions[i].action === 'CONFIRM_MOBILE_OWNERSHIP') {
        res.body.actions[i].action = 'تایید مالکیت تلفن همراه';
      }
      if (res.body.actions[i].action === 'CONFIRM_DOCUMENT') {
        res.body.actions[i].action = 'تایید سند';
      }
      if (res.body.actions[i].action === 'REJECT_ADDRESS') {
        res.body.actions[i].action = ' رد آدرس';
      }
      if (res.body.actions[i].action === 'REJECT_IBAN') {
        res.body.actions[i].action = ' رد شبا';
      }
      if (res.body.actions[i].action === 'REJECT_CARD') {
        res.body.actions[i].action = ' رد کارت';
      }
      if (res.body.actions[i].action === 'REJECT_BANK') {
        res.body.actions[i].action = ' رد بانک';
      }
      if (res.body.actions[i].action === 'REJECT_NATIONALID') {
        res.body.actions[i].action = ' رد شماره ملی';
      }
      if (res.body.actions[i].action === 'REJECT_MOBILE_OWNERSHIP') {
        res.body.actions[i].action = ' رد مالکیت تلفن همراه';
      }
      if (res.body.actions[i].action === 'REJECT_DOCUMENT') {
        res.body.actions[i].action = ' رد سند';
      }
      if (res.body.actions[i].action === 'SEND_REJECT_SMS') {
        res.body.actions[i].action = ' ارسال اس ام اس ناقصی';
      }
      if (res.body.actions[i].action === 'CALL_USER') {
        res.body.actions[i].action = ' تماس با کاربر';
      }
      if (res.body.actions[i].action === 'ADD_NATIONAL_PIC') {
        res.body.actions[i].action = ' اضافه کردن کارت ‌ملی';
      }
      if (res.body.actions[i].action === 'ADD_SELFIE_PIC') {
        res.body.actions[i].action = ' اضافه کردن تصویر توافق‌نامه';
      }
      if (res.body.actions[i].action === 'REJECT_IDCARD') {
        res.body.actions[i].action = ' رد کارت ‌ملی';
      }
      if (res.body.actions[i].action === 'REJECT_SELFIE') {
        res.body.actions[i].action = ' رد تصویر توافق‌نامه';
      }
      if (res.body.actions[i].action === 'CONFIRM_IDCARD') {
        res.body.actions[i].action = ' تایید کارت ‌ملی';
      }
      if (res.body.actions[i].action === 'CONFIRM_SELFIE') {
        res.body.actions[i].action = ' تایید تصویر توافق‌نامه';
      }
      if (res.body.actions[i].action === 'BLOCK_USER') {
        res.body.actions[i].action = ' مسدود سازی کابر';
      }
      if (res.body.actions[i].action === 'UNBLOCK_USER') {
        res.body.actions[i].action = 'فعال سازی کابر';
      }
      if (res.body.actions[i].action === 'ADD_OTHER_PIC') {
        res.body.actions[i].action = 'سایر مدارک';
      }
    }
  }
  cashout(res: any) {
    for (let y = 0; y < res.body.withdraws.length; y++) {
      if (res.body.withdraws[y].status === 'INIT') {
        res.body.withdraws[y].status = 'ثبت شده';
      }
      if (res.body.withdraws[y].status === 'CONFIRM') {
        res.body.withdraws[y].status = 'تایید شده';
      }
      if (res.body.withdraws[y].status === 'SEMICONFIRM') {
        res.body.withdraws[y].status = 'نیمه تایید شده';
      }
      if (res.body.withdraws[y].status === 'PENDING') {
        res.body.withdraws[y].status = 'در حال انتظار';
      }
      if (res.body.withdraws[y].status === 'REJECT') {
        res.body.withdraws[y].status = 'رد شده';
      }
      if (res.body.withdraws[y].status === 'UPDATEBANK') {
        res.withdraws[y].status = 'به روز رسانی حساب بانکی';
      }
      if (res.withdraws[y].status === 'FIRSTPENDING') {
        res.body.withdraws[y].status = 'در انتظار اولین بررسی';
      }
      if (res.body.withdraws[y].twoStepVerification === 'DEACTIVATED') {
        res.body.withdraws[y].twoStepVerification = 'غیر فعال';
      }
      if (res.body.withdraws[y].twoStepVerification === 'ACTIVATING') {
        res.body.withdraws[y].twoStepVerification = 'فعال';
      }
    }
  }
chargePipe(res: any) {
  for (let x = 0; x < res.body.data.length; x++) {
    if (res.body.data[x].status === 'FAILED') {
      res.body.data[x].status = 'رد شده';
    }
    if (res.body.data[x].status === 'CONFIRMED') {
      res.body.data[x].status = 'تایید شده';
    }
    if (res.body.data[x].status === 'PENDING') {
      res.body.data[x].status = 'ارسال شده بانک';
    }
    if (res.body.data[x].status === 'CANCELLED') {
      res.body.data[x].status = 'لغو شده';
    }
    if (res.body.data[x].status === 'TRANSFERRED') {
      res.body.data[x].status = 'انجام شد';
    }
    if (res.body.data[x].status === 'EXPIRED') {
      res.body.data[x].status = 'منقضی شده';
    }
    if (res.body.data[x].status === 'FAILED') {
      res.body.data[x].status = 'شکست';
    }
    if (res.body.data[x].status === 'TIMEOUT') {
      res.body.data[x].status = 'اتمام وقت';
    }
    if (res.body.data[x].status === 'ADMIN_CANCELLED') {
      res.body.data[x].status = 'رد شده';
    }
    if (res.body.data[x].status === 'IN_PROCESS') {
      res.body.data[x].status = 'ارسال شده به بانک';
    }

  }
}

  pageDrop(val: any) {
    this.params.limit = val.target.value;
    this.limit = val.target.value;
    this.params.offset = 0;
    return this.http.get<any>(this.UseUrl, {
      params: this.params, observe: 'response'
    }).pipe(
      map((res: any) => {
        this.pipeKycStatus(res);
        this.totals.splice(0, this.totals.length);
        for (let m = 1; m < Math.ceil(res.body.total / val.target.value) + 1; m++) {
          this.totals.push(m);
          console.log(m)
        }
        this.data.next(res.body.users);
      }),
    )
      .subscribe(dto => {
      });
  }

  Dropdown(val: any): any {
    if (val.target.value !== '') {
      for (let f = 0; f < this.KeyUser.length; f++) {
        if (this.KeyUser[f].type === 'dropdown') {
          for (let d = 0; d < this.KeyUser[f].dropdown.length; d++) {
            if (this.KeyUser[f].dropdown[d].name === val.target.value) {
              this.textDrop[f] = val.target.value;
            }
          }
        }
      }
      for (let p = 0; p < this.KeyUser.length; p++) {
        if (this.KeyUser[p].type === 'dropdown') {
          this.dropdown[this.KeyUser[p].ColumnName] = this.textDrop[p];
          if (this.dropdown[this.KeyUser[p].ColumnName] === '') {
            delete this.dropdown[this.KeyUser[p].ColumnName];
          }
        }
      }
      for (let g = 0; g < this.KeyUser.length; g++) {
        if (this.KeyUser[g].type === 'dropdown') {
          this.params[this.KeyUser[g].ColumnName] = this.textDrop[g];
          if (this.params[this.KeyUser[g].ColumnName] === '') {
            delete this.params[this.KeyUser[g].ColumnName];
          }
        }
      }
      let size = 0;
      for (let r = 0; r < this.KeyUser.length; r++) {
        for (const k in this.dropdown) {
          if (this.KeyUser[r].type === 'dropdown') {
            if (k === this.KeyUser[r].ColumnName) {
              size++;
            }
          }
        }
      }
      this.dropdownCounter = size;
      this.params.counterFilter = this.filteringCounter + this.dropdownCounter;
      this.params.offset = 0;
      this.RequesttoserverDispay();
    } else {
      for (let u = 0; u < this.KeyUser.length; u++) {
        if (this.KeyUser[u].type === 'dropdown') {
          delete this.dropdown[this.KeyUser[u].ColumnName];
          delete this.params[this.KeyUser[u].ColumnName];
        }
      }
      let size = 0;
      for (let r = 0; r < this.KeyUser.length; r++) {
        for (const k in this.dropdown) {
          if (this.KeyUser[r].type === 'dropdown') {
            if (k === this.KeyUser[r].ColumnName) {
              size++;
            }
          }
        }
      }
      this.dropdownCounter = size;
      this.params.counterFilter = this.filteringCounter + this.dropdownCounter;
      this.params.offset = 0;
      this.RequesttoserverDispay();
    }
  }

  pagination(x: any) {
    console.log(x);
    this.startPage = x - 2;
    this.endPage = x + 3;
    this.totals.splice(0, this.totals.length);
    if (x < 3) { this.startPage = 1 }
    if (x >= this.totalLength) {
      x = this.totalLength;
      this.endPage = this.totalLength + 1 ;
      this.startPage = this.totalLength - 5;
    }
    for (let i = this.startPage; i < this.endPage; i++) {
      this.totals.push(i);
    }

    this.activePage[0] = x;
    x = x * this.limit - this.limit;
    this.params.offset = x;
    return this.http.get<any>(this.UseUrl, {
      params: this.params,
      observe: 'response'
    }).pipe(
      map((res: any) => {
        this.pipeKycStatus(res);
        this.data.next(res.body.users);
      })
    )
      .subscribe(dto => {
      });
  }

  pageSearch(inputval: any) {
    let x = inputval.target.value;
    if (x > this.totals.length) {
      inputval.target.value = this.totals.length;
      x = this.totals.length;
    }
    x = x * this.limit - this.limit;
    this.params.offset = x;
    console.log(this.params.limit);
    return this.http.get<any>(this.UseUrl, {
      params: this.params,
      observe: 'response'
    }).pipe(map((res: any) => {
      this.pipeKycStatus(res);
      this.data.next(res.body.users);
    }))
      .subscribe(dto => {
      });
  }

  hrefButton(vl: any, row: any) {
    console.log(row.refId);
    if (row.gateway.name === 'درگاه') {

    }else {
      location.href = 'https://cdn.cilab.ir/' + row.refId
    }

  }

  sweetalertButton(vl: any, row: any) {
    Swal.fire(row.name, 'You submitted succesfully!', 'success');
  }

  informationButton(vl: any, row: any, href: any, counterParam: any, param: any) {
    console.log(row, 'row');
    if (row.id) {
      this.router.navigate([href + row.id]);
    }
    if (row.user) {
      this.router.navigate([href + row.user]);
    }
    if (counterParam === '2') {
      console.log(href + row.id + '/' +row.user, 'href');
      this.router.navigate([href + row[param[0]] + '/' +row[param[1]]])
    }
  }

  RequestServer() {
    return this.data.subscribe(response => {
      if (response === null) {
        this.http.get<any>(this.UseUrl, {
          params: this.Offsetlimit
        }).pipe(
          map((res: any) => {
            console.log(res, 'user');
            if (res.users) {
              for (let y = 0; y < res.users.length; y++) {
                if (res.users[y].kycStatus === 'INIT') {
                  res.users[y].kycStatus = 'ثبت شده';
                }
                if (res.users[y].kycStatus === 'CONFIRM') {
                  res.users[y].kycStatus = 'تایید شده';
                }
                if (res.users[y].kycStatus === 'SEMICONFIRM') {
                  res.users[y].kycStatus = 'نیمه تایید شده';
                }
                if (res.users[y].kycStatus === 'PENDING') {
                  res.users[y].kycStatus = 'در حال انتظار';
                }
                if (res.users[y].kycStatus === 'REJECT') {
                  res.users[y].kycStatus = 'رد شده';
                }
                if (res.users[y].kycStatus === 'UPDATEBANK') {
                  res.users[y].kycStatus = 'به روز رسانی حساب بانکی';
                }
                if (res.users[y].kycStatus === 'FIRSTPENDING') {
                  res.users[y].kycStatus = 'در انتظار اولین بررسی';
                }
                if (res.users[y].twoStepVerification === 'DEACTIVATED') {
                  res.users[y].twoStepVerification = 'غیر فعال';
                }
                if (res.users[y].twoStepVerification === 'ACTIVATING') {
                  res.users[y].twoStepVerification = 'فعال';
                }
              }
            } else if (res.data) {
              const pipe = new ChargePipe();
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].status = pipe.transform(res.data[i].status);
                if (res.data[i].gateway) {
                  res.data[i].gateway.name = pipe.transform(res.data[i].gateway.name);
                }
              }
            } else if (res.withdraws) {
              for (let y = 0; y < res.withdraws.length; y++) {
                const pipe = new StatusWithdrawPipe();
                const pipeCrypto = new cryptoCurrencyPipe();
                res.withdraws[y].status = pipe.transform(res.withdraws[y].status);
                res.withdraws[y].coin = pipeCrypto.transform(res.withdraws[y].coin);
              }
            } else if (res.deposits) {
              for (let y = 0; y < res.deposits.length; y++) {
                const pipeCrypto = new cryptoCurrencyPipe();
                res.deposits[y].coin = pipeCrypto.transform(res.deposits[y].coin);
              }
            } else if (res.orders) {
              for (let y = 0; y < res.orders.length; y++) {
                const pipeOrder = new orderStatusPipe();
                const pipeTypeTransaction = new farsiPipe();
                const market = new bankPipe();
                res.orders[y].status = pipeOrder.transform(res.orders[y].status);
                res.orders[y].side = pipeTypeTransaction.transform(res.orders[y].side)
                res.orders[y].symbol = market.transform(res.orders[y].symbol)
              }
            } else if (res.actions) {
              for (let i = 0; i < res.actions.length; i++) {
                const Pipe = new ActionPipe();
                res.actions[i].action = Pipe.transform(res.actions[i].action);
              }
            } else if (res.comments) {
            } else {
              console.error('error get type response data in ngOnInit');
            }
            // console.log(res);
            for (const [key, value] of Object.entries(res)) {
              if (typeof value === 'object') {
                for (let m = 1; m < Math.ceil(res.total / this.limit) + 1; m++) {
                  this.totalLength = m;
                }
                this.totals = [1,2,3,4,5]
                this.data.next(res[key]);
                this.Data = res[key];
                this.loading = 'none';
              }
            }
          }),
        ).subscribe(dta => {
        });
      } else {
        this.Data = response;
      }
    });
  }

  RequesttoserverDispay(): any {
    return this.http.get<any>(this.UseUrl, {
      params: this.params, observe: 'response'
    }).pipe(
      map((res: any) => {
        if (res.body.users) {
          this.pipeKycStatus(res);
          this.totals.splice(0, this.totals.length);
          for (let m = 1; m < Math.ceil(res.body.total / this.limit) + 1; m++) {
            this.totals.push(m);
          }
          this.data.next(res.body.users);
        } else if (res.body.data) {
          this.chargePipe(res);
          this.totals.splice(0, this.totals.length);
          for (let m = 1; m < Math.ceil(res.body.total / this.limit) + 1; m++) {
            this.totals.push(m);
          }
          this.data.next(res.body.data);
        } else if (res.body.withdraws) {
          this.cashout(res);
          this.totals.splice(0, this.totals.length);
          for (let m = 1; m < Math.ceil(res.body.total / this.limit) + 1; m++) {
            this.totals.push(m);
          }
          this.data.next(res.body.withdraws);
        } else if (res.body.deposits) {
          this.totals.splice(0, this.totals.length);
          for (let m = 1; m < Math.ceil(res.body.total / this.limit) + 1; m++) {
            this.totals.push(m);
          }
          this.data.next(res.body.deposits);
        } else if (res.body.orders) {
          this.totals.splice(0, this.totals.length);
          for (let m = 1; m < Math.ceil(res.body.total / this.limit) + 1; m++) {
            this.totals.push(m);
          }
          this.data.next(res.body.orders);
        } else if (res.body.actions) {
          this.totals.splice(0, this.totals.length);
          for (let m = 1; m < Math.ceil(res.body.total / this.limit) + 1; m++) {
            this.totals.push(m);
          }
          this.pipeHistory(res);
          this.data.next(res.body.actions);
        } else if (res.body.comments) {
          this.totals.splice(0, this.totals.length);
          for (let m = 1; m < Math.ceil(res.body.total / this.limit) + 1; m++) {
            this.totals.push(m);
          }
          this.data.next(res.body.comments);
        } else {
          console.error('error get type  response data');
        }
      }),
    )
      .subscribe(dto => {
      });
  }

  ngOnInit() {
    // console.log(this.UseUrl);
    // for (let r = 0; r < this.KeyUser.length - 3; r++) {
    //   this.tfootCounterTd.push(r);
    // }
    // if (this.theme === 'light') {
    //   this.themes = 'table table-hover table-striped table-bordered text-center';
    //   this.headerColor = 'trColorLight';
    //   this.btnColor = 'btn btnColorLight searchPage';
    // } else if (this.theme === 'dark' || this.themes === 'Dark') {
    //   this.themes = 'table table-hover tableDark table-bordered table-dark text-center';
    //   this.headerColor = 'trColor';
    //   this.btnColor = 'btn btn-light searchPage';
    // }
    // for (let c = 0; c < this.KeyUser.length; c++) {
    //   this.text[c] = '';
    // }
    // this.RequestServer();
  }

  exportExcel() {
    const allow: any = [];
    for (let y = 0; y < this.KeyUser.length; y++) {
      allow.push(this.KeyUser[y].ColumnName);
    }
    for (let i = 0; i < this.Data.length; i++) {
      this.filterExcel[i] = Object.keys(this.Data[i]).filter((key: any) => allow.includes(key)).reduce((obj: any, key) => {
        obj[key] = this.Data[i][key];
        return obj;
      }, {});
    }
    console.log(this.filterExcel);
    this.excelservice.exportAsExcelFile(this.filterExcel, 'Table');
  }

  filter(el: any) {
    console.log(el.target.name);
    Object.assign(this.params, this.dropdown);
    for (let f = 0; f < this.KeyUser.length; f++) {
      if (this.KeyUser[f].type === 'input' || this.KeyUser[f].type === 'Date') {
        if (el.target.name === this.KeyUser[f].ColumnName) {
          this.text[f] = el.target.value;
        }
      }
    }
    for (let g = 0; g < this.KeyUser.length; g++) {
      if (this.KeyUser[g].type === 'input' || this.KeyUser[g].type === 'Date') {
        this.params[this.KeyUser[g].ColumnName] = this.text[g];
        if (this.params[this.KeyUser[g].ColumnName] === '') {
          delete this.params[this.KeyUser[g].ColumnName];
        }
        this.searchValue[this.KeyUser[g].ColumnName] = this.text[g];
        if (this.searchValue[this.KeyUser[g].ColumnName] === '') {
          delete this.searchValue[this.KeyUser[g].ColumnName];
        }
      }
    }
    let size = 0;
    let count = 0;
    for (let r = 0; r < this.KeyUser.length; r++) {
      if (this.KeyUser[r].type === 'input' || this.KeyUser[r].type === 'Date') {
        for (const k in this.searchValue) {
          if (k === this.KeyUser[r].ColumnName) {
            size++;
          }
        }
        this.filteringCounter = size;
      }
      if (this.KeyUser[r].type === 'CustomCode') {
        for (const k in this.searchValue) {
          if (k === this.KeyUser[r].ColumnName) {
            count++;
          }
        }
        this.filteringCounter = count;
      }
    }
    this.params.counterFilter = this.filteringCounter + this.dropdownCounter;
    this.params.offset = 0;
    this.RequesttoserverDispay();
  }

  Sort(value: any, i: any, index: any, input: any): any {
    for (let j = 0; j < this.KeyUser.length; j++) {
      if (value.target.classList.value === `${this.KeyUser[j].ColumnName}`) {
        this.params.sortField = this.KeyUser[j].ColumnName;
        if (this.flag === true) {
          this.flag = false;
          this.params.sortOrder = 'asc';
          input.classList.value = 'fa fa-sort-asc';
        } else if (this.flag === false) {
          this.flag = '';
          this.params.sortOrder = 'desc';
          input.classList.value = 'fa fa-sort-desc';
        } else if (this.flag === '') {
          this.flag = true;
          delete this.params.sortOrder;
          delete this.params.sortField;
          input.classList.value = '';
        }
        this.params.offset = 0;
        this.RequesttoserverDispay();
      }
    }
  }

  financeExchange(val: any) {
    console.log(val);
    this.router.navigate([`/financial-management/withdraw-confirm/${val.id}`])
  }

  chargeKycStatus() {
  }
  orderOpration(i: any, row: any) {

  }
  cancelOrder(orderId: any, side: any, symbol: any) {
    const cancelObj = {
      uuid: orderId,
      side,
      symbol
    };
    this.api.cancelOrder(cancelObj).subscribe(
      (response: any) => {
        // console.log(response);
        if (response.statusCode === 200) {
          Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          }).fire({
            icon: 'success',
            title: 'سفارش با موفقیت لغو شد',
          });
          setTimeout(function() {
            location.reload()
          }, 1000)
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}

// map((res: any) => {
//   res.body.users.forEach((ress: any) => {
//     ress.createdAt = moment(ress.createdAt).format('jYYYY/jM/jD');
//     ress.updatedAt = moment(ress.updatedAt).format('jYYYY/jM/jD');
//     ress.lastLogin = moment(ress.lastLogin).format('HH:mm:ss');
//     if (ress.profile !== null) {
//       ress.profile.createdAt = moment(ress.profile.createdAt).format('jYYYY/jM/jD');
//       ress.profile.updatedAt = moment(ress.profile.updatedAt).format('jYYYY/jM/jD');
//     }
//     if (ress.role !== null) {
//       ress.role.createdAt = moment(ress.role.createdAt).format('jYYYY/jM/jD');
//       ress.role.updatedAt = moment(ress.role.updatedAt).format('jYYYY/jM/jD');
//     }
//   });
//   console.log(res);
//   this.data.next(res.body.users);
// })
