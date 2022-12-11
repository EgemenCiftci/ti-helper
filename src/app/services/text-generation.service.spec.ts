import { TestBed } from '@angular/core/testing';

import { TextGenerationService } from './text-generation.service';

describe('TextGenerationService', () => {
  let service: TextGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
