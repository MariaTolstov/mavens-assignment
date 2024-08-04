import { GameState } from '../../types/enums';

interface BoardProps {
  gameState: GameState;
  piecePosition?: string;
}

export default function Board({ gameState, piecePosition }: BoardProps) {
  return (
    <div className="board">
      {gameState === GameState.Waiting ? (
        <div className="waiting">
          <h3>Get ready...</h3>
        </div>
      ) : (
        <div className={`piece ${piecePosition}`}></div>
      )}
    </div>
  );
}
