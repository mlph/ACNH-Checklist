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

  it("should return collect value : match", ()=>{
    expect(service.match("あいうえお", "あ")).toBeTrue()
    expect(service.match("あいうえお", "-あ")).toBeFalse()
    expect(service.match("あいうえお", "あい うえ")).toBeTrue()
    expect(service.match("あいうえお", "あい -う")).toBeFalse()
    expect(service.match("あいうえお", "あ -か")).toBeTrue()
    expect(service.match("あいうえお", "か")).toBeFalse()
  })
});
