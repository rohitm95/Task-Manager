import { TestBed } from '@angular/core/testing';

import { SpinnerService } from './spinner.service';
import { Subject } from 'rxjs';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have showSpinner property initialized as a Subject', () => {
    expect(service.showSpinner).toBeDefined();
    expect(service.showSpinner instanceof Subject).toBeTrue();
  });
});
