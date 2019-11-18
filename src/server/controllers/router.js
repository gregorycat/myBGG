import app from '../server';
import { listBoardGames, loadOwnGamesForUser } from './BoardGameController';

app.post('/api/boardgames/init', (req, res) => {
    console.log('Init boardgame list');

    loadOwnGamesForUser('graij', res);
});

/**
 * Retrieve the list of board games
 */
app.post('/api/boardgames/list', (req, res) => {
    console.log('Get boardgame list');
    listBoardGames(req, res);
});

/**
 * Retrive the specific board game
 */
app.get('/api/boardgame/:gameId', (req, res) => {
    console.log('get boardgame');
});

/**
 * Save / Update the specific board game
 */
app.post('/api/boardgame/:gameId', (req, res) => {
    console.log('save boardgame');
});

export default app;
