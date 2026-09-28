import React, { useState } from 'react';
import { UserCheck, MessageSquare, Loader2, Send } from 'lucide-react';
import axios from 'axios';

export default function InterviewPanel({ analysis }) {
  const questions = analysis.result.interviewMode?.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!questions.length) return <div className="p-6 text-center text-slate-400">No interview questions generated.</div>;

  const currentQ = questions[currentIndex];

  const handleEvaluate = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    setFeedback(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/analyses/${analysis._id}/interview`, {
        questionIndex: currentIndex,
        userResponse: answer
      }, { headers: { Authorization: `Bearer ${token}` } });
      setFeedback(res.data.evaluation);
    } catch (err) {
      console.error(err);
      setFeedback({ error: 'Failed to evaluate answer. Please try again.' });
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    setCurrentIndex((prev) => (prev + 1) % questions.length);
    setAnswer('');
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-400" /> Mock Interview Practice
        </h3>
        <span className="text-xs font-medium text-slate-500">Question {currentIndex + 1} of {questions.length}</span>
      </div>

      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <p className="text-slate-200 font-medium">{currentQ.question}</p>
        
        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider">Your Answer</label>
          <textarea
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={evaluating || feedback}
            className="w-full bg-[#080b12] border border-slate-800 rounded-lg p-3 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            placeholder="Explain your approach..."
          />
        </div>

        {!feedback && (
          <button
            onClick={handleEvaluate}
            disabled={evaluating || !answer.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg disabled:opacity-50"
          >
            {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Evaluate Answer
          </button>
        )}

        {feedback && (
          <div className="space-y-4 pt-4 border-t border-slate-800 animate-fadeIn">
            {feedback.error ? (
              <p className="text-rose-400 text-sm">{feedback.error}</p>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-indigo-400">{feedback.score}/100</div>
                  <p className="text-sm text-slate-300 leading-relaxed flex-1">{feedback.feedback}</p>
                </div>
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-sm text-emerald-400">
                  <strong>Key Takeaway:</strong> {feedback.keyTakeaway}
                </div>
              </>
            )}
            <button
              onClick={nextQuestion}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
