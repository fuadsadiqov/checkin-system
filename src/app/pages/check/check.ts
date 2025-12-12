import { Component, computed, signal, Signal } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { Group, GroupService } from '../../services/group';
import { Participant, ParticipantService } from '../../services/participant';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-check',
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
  templateUrl: './check.html',
  styleUrl: './check.scss',
})
export class Check {
  participants = signal<Participant[]>([]);
  groups = signal<Group[]>([]);
  columns = ['order', 'name', 'checked'];
  loading = signal(true);
  selectedGroups = signal<number[]>([]);

  search = '';

  private participantsSub?: Subscription;

  checkedParticipiantCount: Signal<number> = computed(
    () => this.participants().filter((participant) => participant.checked).length
  );

  constructor(private participantService: ParticipantService, private groupService: GroupService) {}

  ngOnInit() {
    this.loadParticipantsByGroups([]);

    this.participantService
      .getGroups()
      .pipe(map((res) => res.sort((a, b) => a._id - b._id)))
      .subscribe((data) => {
        data.unshift({ _id: 0, title: 'Hamısı' });
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
    if (groupId === 0) this.selectedGroups.update(() => []);
    else {
      this.selectedGroups.update((groups) =>
        groups.includes(groupId) ? groups.filter((g) => g !== groupId) : [...groups, groupId]
      );
    }

    this.loadParticipantsByGroups(this.selectedGroups());
  }

  loadParticipantsByGroups(groupIds: number[]) {
    this.participantsSub?.unsubscribe();

    const obs$ =
      groupIds.length && !groupIds.includes(0)
        ? this.participantService.getParticipantsByGroup(groupIds)
        : this.participantService.getParticipants();

    this.participantsSub = obs$.subscribe((data) => {
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
