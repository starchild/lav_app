import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CheckoutlistPage } from './checkoutlist.page';

describe('CheckoutlistPage', () => {
  let component: CheckoutlistPage;
  let fixture: ComponentFixture<CheckoutlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
