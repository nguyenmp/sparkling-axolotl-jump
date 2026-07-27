export interface Recipe {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  recipe_id: number;
  date_epoch_seconds: number;
  content_markdown: string;
}
