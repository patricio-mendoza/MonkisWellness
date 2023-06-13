import { TestBed } from '@angular/core/testing';

import { CompartidovarService } from './compartidovar.service';

describe('CompartidovarService', () => {
  let service: CompartidovarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompartidovarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
