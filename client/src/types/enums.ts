export enum GameState {
  Waiting = 'waiting',
  DisplayingIndicator = 'displayingIndicator',
}

export enum PiecePosition {
  Left = 'left',
  Right = 'right',
}

export enum FeedbackType {
  TooSoon = 'tooSoon',
  WrongKey = 'wrongKey',
  TooLate = 'tooLate',
  Correct = 'correct',
}

export enum BoardActionType {
  SwitchToIndicator = 'switchToIndicator',
  SwitchToWaiting = 'switchToWaiting',
  UpdateSuccess = 'updateSuccess',
  UpdateFailure = 'updateFailure',
}
