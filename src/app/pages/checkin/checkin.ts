import { Component, OnInit } from '@angular/core';
import { Participant, ParticipantService } from '../../services/participant';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatToolbarModule,
  ],
  templateUrl: './checkin.html',
})
export class CheckinComponent implements OnInit {
  participants: Participant[] = [];
  columns = ['order', 'name', 'position', 'checked'];

  search = '';

  constructor(private participantService: ParticipantService) {}

  ngOnInit() {
    this.participantService.getParticipants().subscribe((data) => {
      this.participants = data;
    });
  }

  toggle(p: Participant) {
    this.participantService.updateCheck(p.id, !p.checked);
  }

  filteredList() {
    return this.participants.filter((p) =>
      p.name.toLowerCase().includes(this.search.toLowerCase())
    );
  }
}
