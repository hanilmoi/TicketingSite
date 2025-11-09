export interface Student {
  id: string;
  name: string;
  grade: number;
  class: number;
}

export interface Group {
  id: string;
  members: Student[];
  leader: Student;
}

// Sample groups - replace with actual student data
export const sampleGroups: Group[] = [
  {
    id: 'group-1',
    leader: { id: 's1', name: 'Kim Minho', grade: 2, class: 3 },
    members: [
      { id: 's1', name: 'Kim Minho', grade: 2, class: 3 },
      { id: 's2', name: 'Lee Jiwoo', grade: 2, class: 3 },
      { id: 's3', name: 'Park Seojun', grade: 2, class: 3 },
      { id: 's4', name: 'Choi Yuna', grade: 2, class: 3 },
    ]
  },
  {
    id: 'group-2',
    leader: { id: 's5', name: 'Jung Hana', grade: 3, class: 1 },
    members: [
      { id: 's5', name: 'Jung Hana', grade: 3, class: 1 },
      { id: 's6', name: 'Song Minji', grade: 3, class: 1 },
    ]
  },
  {
    id: 'group-3',
    leader: { id: 's7', name: 'Kang Junho', grade: 1, class: 2 },
    members: [
      { id: 's7', name: 'Kang Junho', grade: 1, class: 2 },
      { id: 's8', name: 'Yoon Sora', grade: 1, class: 2 },
      { id: 's9', name: 'Han Taeyang', grade: 1, class: 2 },
    ]
  },
];
