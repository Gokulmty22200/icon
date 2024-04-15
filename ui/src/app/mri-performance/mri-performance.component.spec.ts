import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MriPerformanceComponent } from './mri-performance.component';

describe('MriPerformanceComponent', () => {
  let component: MriPerformanceComponent;
  let fixture: ComponentFixture<MriPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MriPerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MriPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
