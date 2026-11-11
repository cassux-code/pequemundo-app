import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArteSonido } from './arte-sonido';

describe('ArteSonido', () => {
  let component: ArteSonido;
  let fixture: ComponentFixture<ArteSonido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArteSonido],
    }).compileComponents();

    fixture = TestBed.createComponent(ArteSonido);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
