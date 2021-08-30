import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupSecondPage } from './signup-second.page';

describe('SignupSecondPage', () => {
  let component: SignupSecondPage;
  let fixture: ComponentFixture<SignupSecondPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupSecondPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupSecondPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
