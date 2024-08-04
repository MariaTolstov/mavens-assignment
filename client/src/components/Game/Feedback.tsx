import { FeedbackType } from '../../types/enums';

const MESSAGES: Record<FeedbackType, string> = {
  [FeedbackType.TooSoon]: 'Too soon!',
  [FeedbackType.WrongKey]: 'Wrong key!',
  [FeedbackType.TooLate]: 'Too late!',
  [FeedbackType.Correct]: 'Correct!',
};

export default function Feedback({
  feedbackType,
}: {
  feedbackType?: FeedbackType;
}) {
  return (
    <div
      className={`message ${
        feedbackType === FeedbackType.Correct ? 'success' : 'error'
      }`}
    >
      {feedbackType && <h4>{MESSAGES[feedbackType]}</h4>}
    </div>
  );
}
