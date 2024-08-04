import Feedback from './Feedback';
import useGameLogic from '../../hooks/useGameLogic';
import Board from './Board';

export default function Game() {
  const { gameState, piecePosition, feedback } = useGameLogic();
  return (
    <div>
      <Board gameState={gameState} piecePosition={piecePosition} />
      <Feedback feedbackType={feedback} />
    </div>
  );
}
