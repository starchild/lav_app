import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupFirstPage } from './signup-first.page';

describe('SignupFirstPage', () => {
  let component: SignupFirstPage;
  let fixture: ComponentFixture<SignupFirstPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupFirstPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupFirstPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
