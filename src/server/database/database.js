import filter from 'lodash/filter';
import firebase from '../../utils/firestore';

let database = firebase.database();
let ref = database.ref('myBGG');

let boardGameRef = ref.child('boardGame');

/**
 *
 * @param {*} result
 * @param {*} queryFilter
 */
const _filterByValue = (result, queryFilter) => {
    if (!queryFilter.field.includes('.')) {
        return filter(result, (data) => data[queryFilter.field] === queryFilter.value);
    } else {
        const fields = queryFilter.field.split('.');
        return filter(result, (data) => data[fields[0]][fields[1]] === queryFilter.value);
    }
};

/**
 *
 * @param {*} result
 * @param {*} queryFilter
 */
const _filterByInterval = (result, queryFilter) => {
    return filter(result, (data) => {
        if (!queryFilter.field.includes('.')) {
            return data[queryFilter.field] >= queryFilter.min && data[queryFilter.field] <= queryFilter.max;
        } else {
            const fields = queryFilter.field.split('.');

            return data[fields[0]][fields[1]] >= queryFilter.min && data[fields[0]][fields[1]] <= queryFilter.max;
        }
    });
};

/**
 *
 * @param {*} result
 * @param {*} queryFilter
 */
const _filterByMin = (result, filter) => {
    return filter(result, (data) => {
        if (!queryFilter.field.includes('.')) {
            return data[filter.field] >= filter.min;
        } else {
            const fields = queryFilter.field.split('.');
            return data[fields[0]][fields[1]] >= filter.min;
        }
    });
};

/**
 *
 * @param {*} result
 * @param {*} queryFilter
 */
const _filterByMax = (result, queryFilter) => {
    if (!queryFilter.field.includes('.')) {
        return filter(result, (data) => data[queryFilter.field] <= queryFilter.max);
    } else {
        const fields = queryFilter.field.split('.');
        return filter(result, (data) => data[fields[0]][fields[1]] <= queryFilter.max);
    }
};

/**
 * Filter the result list
 *
 * @param  {Array} result  The complete result list
 * @param  {Array} filters The filters to apply.
 * @return {Array} The filtered result list.
 */
const _filterResult = (result, filter) => {
    if (filter.value) {
        result = _filterByValue(result, filter);
    } else if (filter.min && filter.max) {
        result = _filterByInterval(result, filter);
    } else if (filter.min) {
        result = _filterByMin(result, filter);
    } else if (filter.max) {
        result = _filterByMax(result, filter);
    }

    return result;
};

/**
 * Save the boardgame in DB
 */
const saveBoardGame = (boardGame) => {
    let gameRef = boardGameRef.child(boardGame.gameId);

    gameRef.set(boardGame);
};

/**
 * Retrieve the list of board gmames in Database.
 *
 * @param  {Object} query The qury parameters used to filter/order the results list
 * @return {Array}  The result list.
 */
const retrieveBoardGames = async (request) => {
    let result = [];
    const { body } = request;

    if (body && body.orderBy) {
        boardGameRef = boardGameRef.orderByChild(body.orderBy);
    }

    const snapshot = await boardGameRef.once('value');
    snapshot.forEach(function(childSnap) {
        result.push(childSnap.val());
    });

    if (body && body.orderDir === 'desc') {
        result = result.reverse();
    }

    if (body && body.filters) {
        body.filters.forEach((queryFilter) => {
            result = _filterResult(result, queryFilter);
        });
    }
    console.log(result.length);

    if (body && body.orderBy) {
        boardGameRef = ref.child('boardGame');
    }
    return result;
};

export { retrieveBoardGames, saveBoardGame };
