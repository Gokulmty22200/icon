import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MriQaComponent } from './mri-qa.component';

describe('MriQaComponent', () => {
  let component: MriQaComponent;
  let fixture: ComponentFixture<MriQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MriQaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MriQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
