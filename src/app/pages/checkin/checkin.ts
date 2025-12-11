import { Component, computed, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { Participant, ParticipantService } from '../../services/participant';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Group, GroupService } from '../../services/group';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map } from 'rxjs';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  templateUrl: './checkin.html',
  styleUrl: './checkin.scss'
})
export class CheckinComponent implements OnInit {
  participants = signal<Participant[]>([]);
  groups = signal<Group[]>([]);
  columns = ['order', 'name', 'checked'];
  loading = signal(true);
  groupControl = new FormControl<string>('');

  search = '';
  selectedGroup = signal<number>(0);

  checkedParticipiantCount: Signal<number> = computed(
    () => this.participants().filter((participant) => participant.checked).length
  );

  constructor(private participantService: ParticipantService, private groupService: GroupService) {}

  ngOnInit() {
    this.participantService.getParticipants().subscribe((data) => {
      this.participants.set(data);
    });

    this.participantService
      .getGroups()
      .pipe(map((res) => res.sort((a, b) => a._id - b._id)))
      .subscribe((data) => {
        this.groups.set(data);
      });
  }

  toggle(p: Participant) {
    this.participantService.updateCheck(p.id, !p.checked);
  }

  filteredList() {
    return this.participants()
      .filter((p) => p.name.toLowerCase().includes(this.search.toLowerCase()))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  onGroupSelected(groupId: number) {
    if (!groupId) {
      this.participantService.getParticipants().subscribe((data) => {
        this.participants.set(data);
      });
      return;
    }

    this.participantService.getParticipantsByGroup(groupId).subscribe((data) => {
      this.participants.set(data);
    });
  }

  displayGroup(group: any): string {
    return group ? group.title : '';
  }

  addAllGroups() {
    this.participantService.addAllGroups();
  }
}
