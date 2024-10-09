import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTaskComponent } from './delete-task.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DeleteTaskComponent', () => {
  let component: DeleteTaskComponent;
  let fixture: ComponentFixture<DeleteTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTaskComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') } // Mock MatDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {} // Provide any data needed for the test
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
