const express = require('express');
const quizRouter = express();
const quizController = require('../../controllers/quiz/quizController');
const { verifyUser, withRole } = require('../../middleware/auth');

quizRouter.get('/', quizController.getAllQuizzes);
quizRouter.get('/:quizId/:levelId', verifyUser, quizController.getQuiz);
quizRouter.get('/findOpponent', verifyUser, quizController.findOpponent);
quizRouter.post('/points/:quizId/:levelId', verifyUser, quizController.savePoints);
quizRouter.get('/history', verifyUser, quizController.getHistory);
quizRouter.get('/leaderboard', verifyUser, quizController.getLeaderboard);

quizRouter.post('/', verifyUser, withRole(['admin']), quizController.addQuiz);
quizRouter.get('/get/one/:quizId', verifyUser, withRole(['admin']), quizController.getOneQuiz);
quizRouter.get('/get/quizml/:quizId/:languageId', verifyUser, withRole(['admin']), quizController.getOneQuizMl);
quizRouter.patch('/:quizId', verifyUser, withRole(['admin']), quizController.updateQuiz);
quizRouter.delete('/:quizId', verifyUser, withRole(['admin']), quizController.deleteQuiz);

quizRouter.post('/question', verifyUser, withRole(['admin']), quizController.addQuestion);
quizRouter.get('/question/all/:quizId', verifyUser, withRole(['admin']), quizController.getAllQuestion);
quizRouter.get('/question/q/:questionId', verifyUser, withRole(['admin']), quizController.getQuestion);
quizRouter.get('/questionml/q/:questionId/:languageId', verifyUser, withRole(['admin']), quizController.getQuestionMl);
quizRouter.patch('/question/q/:questionId', verifyUser, withRole(['admin']), quizController.updateQuestion);
quizRouter.delete('/question/q/:questionId', verifyUser, withRole(['admin']), quizController.deleteQuestion);

module.exports = quizRouter;