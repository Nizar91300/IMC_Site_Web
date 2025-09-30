import { TestBed } from '@angular/core/testing';

import { Imc } from './imc';

describe('Imc', () => {
  let service: Imc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Imc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
