/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Positive for A skills and negative for SP skills
 */
export type BeatNumber = number;
/**
 * The type of this event
 */
export type EventType = BeatNumber[];
export type BeatCountInTotal = number;

/**
 * Notemap data for wiki.biligame.com/idolypride
 */
export interface TheRootSchema {
  tb: TheTable;
}
/**
 * The container of the data.
 */
export interface TheTable {
  [k: string]: Song;
}
export interface Song {
  [k: string]: MapType;
}
/**
 * A variant of notemap for a song
 */
export interface MapType {
  "1": EventType;
  "2": EventType;
  "3": EventType;
  "4": EventType;
  "5": EventType;
  beat: BeatCountInTotal;
}