import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaybackInfoComponent } from './playback-info.component';

describe('PlaybackInfoComponent', () => {
  let component: PlaybackInfoComponent;
  let fixture: ComponentFixture<PlaybackInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaybackInfoComponent]
    });
    fixture = TestBed.createComponent(PlaybackInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
