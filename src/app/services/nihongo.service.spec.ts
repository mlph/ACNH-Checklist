import { TestBed } from '@angular/core/testing';

import { NihongoService } from './nihongo.service';

describe('NihongoService', () => {
  let service: NihongoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NihongoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
