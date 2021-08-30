import { TestBed } from '@angular/core/testing';

import { CartSettingService } from './cart-setting.service';

describe('CartSettingService', () => {
  let service: CartSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
