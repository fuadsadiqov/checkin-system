import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Participant {
  id: string;
  name: string;
  checked: boolean;
  position?: string;
  order?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  constructor(private firestore: Firestore) {}

  // Real-time siyahı almaq
  getParticipants(): Observable<Participant[]> {
    const ref = collection(this.firestore, 'participants');
    return collectionData(ref, { idField: 'id' }) as Observable<Participant[]>;
  } 

  // Check-in status update
  updateCheck(id: string, checked: boolean) {
    const ref = doc(this.firestore, `participants/${id}`);
    return updateDoc(ref, { checked: checked });
  }
}
