// utils/RoomManager.js — Firebase room operations for multiplayer

import { db } from './firebase';
import {
  doc, setDoc, getDoc, updateDoc, onSnapshot,
  serverTimestamp, arrayUnion,
} from 'firebase/firestore';
import { pickWord, generatePlayerId } from './wordCategories';

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

export const createRoom = async (hostName, language) => {
  const roomCode = generateRoomCode();
  const hostId = generatePlayerId();
  await setDoc(doc(db, 'rooms', roomCode), {
    hostId,
    language,
    status: 'waiting',
    gameData: null,
    players: {
      [hostId]: { name: hostName, isHost: true, joinedAt: Date.now() },
    },
    createdAt: serverTimestamp(),
  });
  return { roomCode, playerId: hostId };
};

export const joinRoom = async (roomCode, playerName) => {
  const code = roomCode.toUpperCase().trim();
  const roomRef = doc(db, 'rooms', code);
  const snap = await getDoc(roomRef);
  if (!snap.exists()) throw new Error('Room not found. Check the code and try again.');
  const data = snap.data();
  if (data.status !== 'waiting') throw new Error('This game has already started.');
  const playerCount = Object.keys(data.players || {}).length;
  if (playerCount >= 8) throw new Error('Room is full (max 8 players).');
  const playerId = generatePlayerId();
  await updateDoc(roomRef, {
    [`players.${playerId}`]: { name: playerName, isHost: false, joinedAt: Date.now() },
  });
  return { roomCode: code, playerId, language: data.language };
};

export const startGame = async (roomCode, config) => {
  const { categoryId, numImposters, timeLimit, timePerPerson, clueAssist, videoCallEnabled } = config;
  const roomRef = doc(db, 'rooms', roomCode);
  const snap = await getDoc(roomRef);
  if (!snap.exists()) throw new Error('Room not found.');
  const data = snap.data();

  const playerEntries = Object.entries(data.players || {})
    .sort((a, b) => a[1].joinedAt - b[1].joinedAt);
  const playerOrder = playerEntries.map(([id]) => id);

  const picked = pickWord(categoryId);
  const secretWord = picked.word;
  const hintWord = picked.hint;

  // Pick random spies
  const shuffled = [...playerOrder].sort(() => Math.random() - 0.5);
  const imposterIds = shuffled.slice(0, Math.min(numImposters, playerOrder.length - 1));

  await updateDoc(roomRef, {
    status: 'game',
    gameData: {
      phase: 'roles',
      secretWord,
      hintWord,
      categoryId,
      imposterIds,
      playerOrder,
      clues: {},
      votes: {},
      readyPlayers: [],
      clueAssist: !!clueAssist,
      videoCallEnabled: !!videoCallEnabled,
      timeLimit: !!timeLimit,
      timePerPerson: timePerPerson || 30,
    },
  });
};

export const markReady = async (roomCode, playerId) => {
  await updateDoc(doc(db, 'rooms', roomCode), {
    'gameData.readyPlayers': arrayUnion(playerId),
  });
};

export const advancePhase = async (roomCode, nextPhase) => {
  await updateDoc(doc(db, 'rooms', roomCode), {
    'gameData.phase': nextPhase,
  });
};

export const submitClue = async (roomCode, playerId, clue) => {
  await updateDoc(doc(db, 'rooms', roomCode), {
    [`gameData.clues.${playerId}`]: clue,
  });
};

export const submitVote = async (roomCode, playerId, votedForId) => {
  await updateDoc(doc(db, 'rooms', roomCode), {
    [`gameData.votes.${playerId}`]: votedForId,
  });
};

export const leaveRoom = async (roomCode, playerId) => {
  try {
    const roomRef = doc(db, 'rooms', roomCode);
    const snap = await getDoc(roomRef);
    if (!snap.exists()) return;
    const data = snap.data();
    const players = { ...data.players };
    delete players[playerId];
    if (Object.keys(players).length === 0) return;
    await updateDoc(roomRef, { players });
  } catch (_) {}
};

export const listenToRoom = (roomCode, callback) => {
  return onSnapshot(doc(db, 'rooms', roomCode), (snap) => {
    callback(snap.exists() ? snap.data() : null);
  });
};
