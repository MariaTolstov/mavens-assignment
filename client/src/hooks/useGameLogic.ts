import { useContext, useEffect, useReducer } from 'react';

import {
  BoardActionType,
  FeedbackType,
  PiecePosition,
  GameState,
} from '../types/enums';

import { IBoardAction, IBoardState, IUser } from '../types/interfaces';
import { UserContextType, UserContext } from '../store/UserContext';
import UsersApi from '../apis/usersApi';

const PIECE_DISPLAY_TIME = 1000;
const MIN_WAITING_TIME = 2000;
const MAX_WAITING_TIME = 5000;

const PositionToKeyMap: Record<PiecePosition, string> = {
  [PiecePosition.Left]: 'a',
  [PiecePosition.Right]: 'l',
};

const getRandomPiecePosition = () => {
  const positions = Object.values(PiecePosition);
  const randomIndex = Math.floor(Math.random() * positions.length);
  return positions[randomIndex];
};

function gameStateReducer(state: IBoardState, action: IBoardAction) {
  const { type, feedback } = action;
  switch (type) {
    case BoardActionType.SwitchToIndicator:
      return {
        ...state,
        gameState: GameState.DisplayingIndicator,
        piecePosition: getRandomPiecePosition(),
        feedback: undefined,
      };
    case BoardActionType.SwitchToWaiting:
      return {
        ...state,
        gameState: GameState.Waiting,
        piecePosition: undefined,
      };
    case BoardActionType.UpdateFailure:
      return {
        ...state,
        score: 0,
        feedback,
      };
    case BoardActionType.UpdateSuccess:
      return {
        ...state,
        score: state.score + 1,
        feedback: FeedbackType.Correct,
      };
    default:
      console.log('Unknown action type');
      return state;
  }
}

export default function useGameLogic() {
  const { user, updateScore } = useContext(UserContext) as UserContextType;
  const [state, dispatch] = useReducer(gameStateReducer, {
    gameState: GameState.Waiting,
    score: 0,
  });

  const handleUserFailure = async (feedback: FeedbackType) => {
    // Update the score in the database if its a high score
    // Not sure what should have happened if the request failed
    // Or if the request should be awaited or happen in the background
    if (user && user.score < state.score) {
      await UsersApi.updateHighScore(user.name, state.score);
      updateScore(state.score);
    }
    dispatch({ type: BoardActionType.UpdateFailure, feedback });
    switchToState(GameState.Waiting);
  };

  const handleUserSuccess = () => {
    dispatch({ type: BoardActionType.UpdateSuccess });
    switchToState(GameState.Waiting);
  };

  const handleStateTimeout = () => {
    if (state.gameState === GameState.Waiting) {
      switchToState(GameState.DisplayingIndicator);
    } else {
      handleUserFailure(FeedbackType.TooLate); // if indicator was being displayed and user pressed no key
    }
  };

  const switchToState = (newState: GameState) => {
    dispatch({
      type:
        newState === GameState.Waiting
          ? BoardActionType.SwitchToWaiting
          : BoardActionType.SwitchToIndicator,
    });
  };

  const getStateDisplayTime = () => {
    switch (state.gameState) {
      case GameState.Waiting:
        return (
          Math.floor(
            Math.random() * (MAX_WAITING_TIME - MIN_WAITING_TIME + 1)
          ) + MIN_WAITING_TIME
        );
      case GameState.DisplayingIndicator:
        return PIECE_DISPLAY_TIME;
      default:
        return PIECE_DISPLAY_TIME;
    }
  };

  // on every game state change, set a timeout after whiche switch to the next state
  useEffect(() => {
    const stateDisplayTime = getStateDisplayTime();

    const timeout = setTimeout(() => {
      handleStateTimeout();
    }, stateDisplayTime);

    return () => clearTimeout(timeout);
  }, [state.gameState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (state.gameState !== GameState.DisplayingIndicator) {
        handleUserFailure(FeedbackType.TooSoon);
        return;
      }

      if (
        state.piecePosition &&
        PositionToKeyMap[state.piecePosition] === event.key
      ) {
        handleUserSuccess();
      } else {
        handleUserFailure(FeedbackType.WrongKey);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return state;
}
