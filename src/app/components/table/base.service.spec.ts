import { TestBed } from '@angular/core/testing';

import { BaseComponent } from './base.service';

describe('BaseService', () => {
  let service: BaseComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
