/** A text of a page, given by the backend. */
export interface Label {
  text: string;
  /** Gives the text in the language of the user. */
  translationKey?: string;
}
