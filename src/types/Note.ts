export interface BaseNoteType {
  id: number;
  body: string;
}

export interface EnrichedNoteType extends BaseNoteType {
  isActiveNote: boolean;
}
