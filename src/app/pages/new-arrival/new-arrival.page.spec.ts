import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewArrivalPage } from './new-arrival.page';

describe('NewArrivalPage', () => {
  let component: NewArrivalPage;
  let fixture: ComponentFixture<NewArrivalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewArrivalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewArrivalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
