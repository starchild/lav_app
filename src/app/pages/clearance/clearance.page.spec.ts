import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClearancePage } from './clearance.page';

describe('ClearancePage', () => {
  let component: ClearancePage;
  let fixture: ComponentFixture<ClearancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClearancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
