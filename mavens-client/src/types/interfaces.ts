import {
  BoardActionType,
  FeedbackType,
  GameState,
  PiecePosition,
} from './enums';

export interface IUser {
  name: string;
  score: number;
}

export interface IBoardState {
  gameState: GameState;
  score: number;
  piecePosition?: PiecePosition;
  feedback?: FeedbackType;
}

export interface IBoardAction {
  type: BoardActionType;
  feedback?: FeedbackType;
}
