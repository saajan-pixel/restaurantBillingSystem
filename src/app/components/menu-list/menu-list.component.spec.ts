import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MenuListComponent } from './menu-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from 'src/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TOAST_CONFIG, ToastrService } from 'ngx-toastr';
import { Store, StoreModule } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { MediaMatcher } from '@angular/cdk/layout';
import { of } from 'rxjs';

describe('MenuListComponent', () => {
  let component: MenuListComponent;
  let fixture: ComponentFixture<MenuListComponent>;
  let apiService: ApiService; // Declare ApiService variable for mocking
  let matDialog: MatDialog; // Declare MatDialog variable for mocking
  let toastrService: ToastrService; // Declare ToastrService variable for mocking
  let store: Store;
  let spinner:NgxSpinnerService

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuListComponent],
      imports: [HttpClientTestingModule, StoreModule.forRoot({})],
      providers: [
        ApiService,
        MatDialog,
        ToastrService,
        Store,
        NgxSpinnerService,
        MediaMatcher,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(MenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    apiService = TestBed.inject(ApiService);
    matDialog = TestBed.inject(MatDialog);
    toastrService = TestBed.inject(ToastrService);
    store = TestBed.inject(Store);
    spinner=TestBed.inject(NgxSpinnerService)

    spyOn(store,'select').and.returnValue(of())

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call createForm and getMenuItems on ngOnInit', () => {
      // Create spies for your createForm and getMenuItems methods if they exist
      const createFormSpy = spyOn(component, 'createForm').and.callThrough();
      const getMenuItemsSpy = spyOn(
        component,
        'getMenuItems'
      ).and.callThrough();

      // call ngOnInit
      component.ngOnInit();

      // Expect that createForm and getMenuItems have been called

      expect(createFormSpy).toHaveBeenCalled();
      expect(getMenuItemsSpy).toHaveBeenCalled();


      
    });
  });
});
