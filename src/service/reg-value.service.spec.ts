import { TestBed } from '@angular/core/testing';

import { RegValueService } from './reg-value.service';

describe('RegValueService', () => {
  let service: RegValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
