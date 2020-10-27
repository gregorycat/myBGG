import filter from 'lodash/filter';
import first from 'lodash/first';
import map from 'lodash/map';
import max from 'lodash/max';
import { retrieveBoardGames, saveBoardGame } from '../database/database';

import BoardGame from '../dao/BoardGame';

const BGG_API_BASE_URL = 'https://bgg-json.azurewebsites.net';
const BGG_ENDPOINTS = {
    collection: 'collection',
    thing: 'thing',
};

/**
 * Load the list of owned boardgame for a user.
 *
 * @param {string} userName The BGG user name.
 */
const loadOwnGamesForUser = async (userName, res) => {
    if (!userName) {
        return;
    }

    const response = await fetch(`${BGG_API_BASE_URL}/${BGG_ENDPOINTS.collection}/${userName}?grouped=true`, {
        mode: 'cors',
    });

    const jsonGames = await response.json();
    const boardGames = [];

    for (let i = 0; i < jsonGames.length; i++) {
        const game = jsonGames[i];

        try {
            const response = await fetch(`${BGG_API_BASE_URL}/${BGG_ENDPOINTS.thing}/${game.gameId}`, { mode: 'cors' });
            const jsonGame = await response.json();

            let boardGame = new BoardGame();

            boardGame.gameId = game.gameId;
            boardGame.name = game.name;
            boardGame.thumbnailUrl = game.thumbnail;
            boardGame.imageUrl = game.image;
            boardGame.playDuration = game.playingTime;

            boardGame.description = jsonGame.description;
            boardGame.mechanics = jsonGame.mechanics;
            boardGame.designers = jsonGame.designers;
            boardGame.publishers = jsonGame.publishers;
            boardGame.rating = jsonGame.averageRating;
            boardGame.artists = jsonGame.artists;

            const bestPlayer = first(
                filter(jsonGame.playerPollResults, (result) => {
                    const maxValue = max(map(jsonGame.playerPollResults, 'best'));
                    return maxValue !== 0 && result.best === maxValue;
                }),
            );

            const recommendedPlayer = first(
                filter(jsonGame.playerPollResults, (result) => {
                    const maxValue = max(map(jsonGame.playerPollResults, 'recommended'));
                    return maxValue !== 0 && result.recommended === maxValue;
                }),
            );

            boardGame.players = {
                best: bestPlayer ? bestPlayer.numPlayers : 0,
                min: jsonGame.minPlayers,
                max: jsonGame.maxPlayers,
                recommended: recommendedPlayer ? recommendedPlayer.numPlayers : 0,
            };

            if (game.expansions) {
                boardGame.expansions = [];

                for (let j = 0; j < game.expansions.length; j++) {
                    const expansion = game.expansions[j];

                    boardGame.expansions.push({
                        gameId: expansion.gameId,
                        name: expansion.name,
                        thumbnailUrl: expansion.thumbnail,
                        imageUrl: expansion.image,
                        playDuration: expansion.playingTime,
                        rating: expansion.averageRating,
                        players: {
                            min: expansion.minPlayers,
                            max: expansion.maxPlayers,
                        },
                    });
                }
            }

            boardGames.push(boardGame);
            saveBoardGame(boardGame);
        } catch (exception) {
            console.log(exception);
        }
    }

    console.log(boardGames.length);
    res.send(boardGames);
};

const listBoardGames = async (req, res) => {
    const result = await retrieveBoardGames(req);
    res.send(result);
};

export { listBoardGames, loadOwnGamesForUser };
