import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { HList } from '../../shared/lib/h-list';
import { NoteService } from '../../assignments/note/note.service';

@Component({
  selector: 'app-crewboard-notes',
  templateUrl: './crewboard-notes.component.html',
  styleUrls: ['./crewboard-notes.component.scss']
})
export class CrewboardNotesComponent implements OnDestroy, OnInit {
  HList = HList;

  priorityList: any[] = [];
  durationList: any[] = [];
  colorList: any[] = [];

  @Input() data: any[] = [];
  criticalNotes: any[] = [];
  noncriticalNotes: any[] = [];

  updateNoteViewDelay = 400; // 400 ms = 0.4 s
  updateNoteViewTimeoutId: any = null;

  applyAnimationClass = false;
  animationSpeed = 0.08; // 0.08 px/ms = 80 px/s
  animationRestartDelay = 200; // 200 ms = 0.2 s
  animationRestartTimeoutId: any = null;
  animationDurationMargin = 400; // 400 ms = 0.4 s
  animationDuration = 0;
  animationDurationTimeoutId: any = null;

  marqueeEvent: any = null;

  constructor(
    private mainService: NoteService
  ) { }

  ngOnInit() {
    console.log('crewboard-notes');
    this.initList();
    this.refreshNotes();
  }

  ngOnDestroy() {
    if (this.updateNoteViewTimeoutId) {
      clearInterval(this.updateNoteViewTimeoutId);
    }
    if (this.animationRestartTimeoutId) {
      clearInterval(this.animationRestartTimeoutId);
    }
    if (this.animationDurationTimeoutId) {
      clearInterval(this.animationDurationTimeoutId);
    }
  }

  initList() {
    this.priorityList = this.mainService.priorityList;
    this.durationList = this.mainService.durationList;
    this.colorList = this.mainService.colorList;
  }

  refreshNotes() {
    this.updateNotes();

    if (this.updateNoteViewTimeoutId) {
      clearTimeout(this.updateNoteViewTimeoutId);
    }
    this.updateNoteViewTimeoutId = setTimeout(() => {
      this.animationDuration = this.calculateAnimationDuration();
      this.startAnimation();
    }, this.updateNoteViewDelay);
  }

  updateNotes() {
    this.criticalNotes = this.data.filter((item: any) => {
      return item.priorityId === '1';
    });
    this.noncriticalNotes = this.data.filter((item: any) => {
      return item.priorityId !== '1';
    });
    console.log('updateNotes(), noncriticalNotes: ', this.noncriticalNotes);
  }

  startAnimation() {
    this.applyAnimationClass = false;
    if (this.animationRestartTimeoutId) {
      clearTimeout(this.animationRestartTimeoutId);
    }
    // const animationRestartDelay = this.animationRestartDelay;
    this.animationRestartTimeoutId = setTimeout(() => {
      this.applyAnimationClass = true;
    }, this.animationRestartDelay);

    if (this.animationDurationTimeoutId) {
      clearTimeout(this.animationDurationTimeoutId);
    }

    this.animationDurationTimeoutId = setTimeout(() => {
      this.refreshNotes();
    }, this.animationRestartDelay + this.animationDuration + this.animationDurationMargin);
  }

  calculateAnimationDuration() {
    let animationDuration = 0;
    const $scrollNote = document.getElementsByClassName('scroll-note');
    if ($scrollNote && $scrollNote.length) {
      const $scrollNotes: any = document.getElementsByClassName('scroll-notes')[0];
      animationDuration = $scrollNotes.offsetWidth / this.animationSpeed;
    }
    console.log('animationDuration: ', animationDuration);
    return animationDuration;
  }

  getColor(colorId: string) {
    let colorCode = '';
    const matchedItem = this.colorList.find((item: any) => { return item.id === colorId });
    if (matchedItem) {
      colorCode = matchedItem.colorCode;
    }
    return colorCode;
  }

}
