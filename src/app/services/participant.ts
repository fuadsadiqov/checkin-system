import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Group } from './group';
import { data } from '../data';

export interface Participant {
  id: string;
  name: string;
  checked: boolean;
  position?: string;
  groupId: number;
  order?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  constructor(private firestore: Firestore) { }

  // Real-time siyahı almaq
  getParticipants(): Observable<Participant[]> {
    const ref = collection(this.firestore, 'participants');
    return collectionData(ref, { idField: 'id' }) as Observable<Participant[]>;
  }

  getGroups(): Observable<Group[]> {
    const ref = collection(this.firestore, 'groups');
    return collectionData(ref, { idField: 'id' }) as Observable<Group[]>;
  }

  // Check-in status update
  updateCheck(id: string, checked: boolean) {
    const ref = doc(this.firestore, `participants/${id}`);
    return updateDoc(ref, { checked: checked });
  }

  getParticipantsByGroup(groupIds: number[]) {
    const ref = collection(this.firestore, 'participants');
    const q = query(ref, where('groupId', 'in', groupIds));
    return collectionData(q, { idField: 'id' }) as Observable<Participant[]>;
  }

  addAllGroups() {
    const groupsCollection = collection(this.firestore, 'participants');

    data.forEach(async (g) => {
      await addDoc(groupsCollection, {
        order: g.order,
        checked: false,
        name: g.name,
        groupId: g.groupId,
        position: g.position,
      });
    });
    alert('Bütün adamlar əlavə olundu ✔');
  }
}
