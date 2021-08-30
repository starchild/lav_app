import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SavedordersPage } from './savedorders.page';

describe('SavedordersPage', () => {
  let component: SavedordersPage;
  let fixture: ComponentFixture<SavedordersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedordersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SavedordersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
