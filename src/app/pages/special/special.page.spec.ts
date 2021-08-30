import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpecialPage } from './special.page';

describe('SpecialPage', () => {
  let component: SpecialPage;
  let fixture: ComponentFixture<SpecialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
