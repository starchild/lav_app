import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShippingAddressPage } from './shipping-address.page';

describe('ShippingAddressPage', () => {
  let component: ShippingAddressPage;
  let fixture: ComponentFixture<ShippingAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingAddressPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
