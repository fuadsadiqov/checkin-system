import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Group {
  _id: number;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class GroupService {
  constructor(private firestore: Firestore) {}

  getGroups(): Observable<Group[]> {
    const ref = collection(this.firestore, 'groups');
    return collectionData(ref, { idField: 'id' }) as Observable<Group[]>;
  }
}