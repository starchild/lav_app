import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupThirdPage } from './signup-third.page';

describe('SignupThirdPage', () => {
  let component: SignupThirdPage;
  let fixture: ComponentFixture<SignupThirdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupThirdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupThirdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
