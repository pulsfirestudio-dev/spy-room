// CreateRoomScreen.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightHaptic, mediumHaptic, heavyHaptic, errorHaptic } from "../utils/HapticsManager";

import AppButton from "../components/AppButton";

/* -------------------- DATA -------------------- */
const freeCategoriesEN = {
  'Random': [
    { word: 'Toothbrush', hint: 'bathroom' }, { word: 'Lion', hint: 'predator' },
    { word: 'Elon Musk', hint: 'tech' }, { word: 'Grand', hint: 'fine' },
    { word: 'Chair', hint: 'seating' }, { word: 'Taylor Swift', hint: 'pop' },
    { word: 'Dolphin', hint: 'smart' }, { word: 'Craic', hint: 'fun' },
    { word: 'Mirror', hint: 'reflection' }, { word: 'Cristiano Ronaldo', hint: 'football' },
    { word: 'Eagle', hint: 'wings' }, { word: 'Deadly', hint: 'great' },
    { word: 'Laptop', hint: 'computer' }, { word: 'Beyoncé', hint: 'singer' },
    { word: 'Shark', hint: 'ocean' }, { word: 'Gobshite', hint: 'idiot' },
    { word: 'Umbrella', hint: 'rain' }, { word: 'LeBron James', hint: 'basketball' },
    { word: 'Penguin', hint: 'cold' }, { word: 'Knackered', hint: 'tired' },
    { word: 'Fridge', hint: 'cold' }, { word: 'Leonardo DiCaprio', hint: 'Oscar' },
    { word: 'Wolf', hint: 'pack' }, { word: 'Scarlet', hint: 'embarrassed' },
    { word: 'Microwave', hint: 'heating' }, { word: 'Gordon Ramsay', hint: 'cooking' },
    { word: 'Octopus', hint: 'tentacles' }, { word: 'Gaff', hint: 'home' },
    { word: 'Headphones', hint: 'audio' }, { word: 'MrBeast', hint: 'YouTube' },
  ],
  'Everyday Objects': [
    { word: 'Toothbrush', hint: 'bathroom' }, { word: 'Chair', hint: 'seating' },
    { word: 'Table', hint: 'surface' }, { word: 'Couch', hint: 'livingroom' },
    { word: 'Pillow', hint: 'bedding' }, { word: 'Blanket', hint: 'warmth' },
    { word: 'Lamp', hint: 'lighting' }, { word: 'Mirror', hint: 'reflection' },
    { word: 'Clock', hint: 'time' }, { word: 'Door', hint: 'entrance' },
    { word: 'Window', hint: 'glass' }, { word: 'Carpet', hint: 'flooring' },
    { word: 'Shelf', hint: 'storage' }, { word: 'Drawer', hint: 'storage' },
    { word: 'Cabinet', hint: 'kitchen' }, { word: 'Television', hint: 'screen' },
    { word: 'Remote', hint: 'control' }, { word: 'Charger', hint: 'power' },
    { word: 'Laptop', hint: 'computer' }, { word: 'Headphones', hint: 'audio' },
    { word: 'Backpack', hint: 'carry' }, { word: 'Wallet', hint: 'money' },
    { word: 'Keys', hint: 'access' }, { word: 'Pen', hint: 'writing' },
    { word: 'Notebook', hint: 'paper' }, { word: 'Book', hint: 'reading' },
    { word: 'Mug', hint: 'drink' }, { word: 'Glass', hint: 'drink' },
    { word: 'Plate', hint: 'food' }, { word: 'Spoon', hint: 'utensil' },
    { word: 'Fork', hint: 'utensil' }, { word: 'Knife', hint: 'cutting' },
    { word: 'Pan', hint: 'cooking' }, { word: 'Pot', hint: 'boiling' },
    { word: 'Kettle', hint: 'water' }, { word: 'Toaster', hint: 'bread' },
    { word: 'Microwave', hint: 'heating' }, { word: 'Fridge', hint: 'cold' },
    { word: 'Freezer', hint: 'frozen' }, { word: 'Trash bin', hint: 'waste' },
    { word: 'Towel', hint: 'drying' }, { word: 'Soap', hint: 'cleaning' },
    { word: 'Shampoo', hint: 'hair' }, { word: 'Toothpaste', hint: 'hygiene' },
    { word: 'Hairbrush', hint: 'grooming' }, { word: 'Umbrella', hint: 'rain' },
    { word: 'Jacket', hint: 'outerwear' }, { word: 'Shoes', hint: 'footwear' },
    { word: 'Sunglasses', hint: 'sun' }, { word: 'Alarm clock', hint: 'waking' },
  ],
  'Famous People': [
    { word: 'Elon Musk', hint: 'tech' }, { word: 'Taylor Swift', hint: 'pop' },
    { word: 'Cristiano Ronaldo', hint: 'football' }, { word: 'Lionel Messi', hint: 'football' },
    { word: 'Dwayne Johnson', hint: 'wrestling' }, { word: 'Kim Kardashian', hint: 'reality' },
    { word: 'Gordon Ramsay', hint: 'cooking' }, { word: 'MrBeast', hint: 'YouTube' },
    { word: 'Oprah Winfrey', hint: 'talkshow' }, { word: 'Barack Obama', hint: 'president' },
    { word: 'Michael Jackson', hint: 'pop' }, { word: 'Beyoncé', hint: 'singer' },
    { word: 'Johnny Depp', hint: 'actor' }, { word: 'Keanu Reeves', hint: 'action' },
    { word: 'Tom Cruise', hint: 'action' }, { word: 'Adele', hint: 'vocals' },
    { word: 'Ed Sheeran', hint: 'guitar' }, { word: 'Drake', hint: 'rap' },
    { word: 'Rihanna', hint: 'fashion' }, { word: 'Billie Eilish', hint: 'altpop' },
    { word: 'LeBron James', hint: 'basketball' }, { word: 'Stephen Curry', hint: 'shooting' },
    { word: 'Serena Williams', hint: 'tennis' }, { word: 'Usain Bolt', hint: 'sprint' },
    { word: 'Conor McGregor', hint: 'MMA' }, { word: 'Tiger Woods', hint: 'golf' },
    { word: 'David Beckham', hint: 'football' }, { word: 'Kylian Mbappé', hint: 'speed' },
    { word: 'Novak Djokovic', hint: 'tennis' }, { word: 'Lewis Hamilton', hint: 'racing' },
    { word: 'Brad Pitt', hint: 'Hollywood' }, { word: 'Angelina Jolie', hint: 'actress' },
    { word: 'Leonardo DiCaprio', hint: 'Oscar' }, { word: 'Jennifer Aniston', hint: 'sitcom' },
    { word: 'Will Smith', hint: 'movies' }, { word: 'Morgan Freeman', hint: 'voice' },
    { word: 'Robert Downey Jr.', hint: 'Marvel' }, { word: 'Scarlett Johansson', hint: 'Marvel' },
    { word: 'Chris Hemsworth', hint: 'Thor' }, { word: 'Margot Robbie', hint: 'Barbie' },
    { word: 'Mark Zuckerberg', hint: 'Facebook' }, { word: 'Jeff Bezos', hint: 'Amazon' },
    { word: 'Bill Gates', hint: 'Microsoft' }, { word: 'Steve Jobs', hint: 'Apple' },
    { word: 'Greta Thunberg', hint: 'climate' }, { word: 'Donald Trump', hint: 'politics' },
    { word: 'Joe Biden', hint: 'president' }, { word: 'Prince William', hint: 'royal' },
    { word: 'King Charles', hint: 'monarch' }, { word: 'Pope Francis', hint: 'Vatican' },
  ],
  'Animals': [
    { word: 'Dog', hint: 'pet' }, { word: 'Cat', hint: 'pet' },
    { word: 'Lion', hint: 'predator' }, { word: 'Tiger', hint: 'stripes' },
    { word: 'Elephant', hint: 'huge' }, { word: 'Giraffe', hint: 'tall' },
    { word: 'Zebra', hint: 'stripes' }, { word: 'Kangaroo', hint: 'hopping' },
    { word: 'Panda', hint: 'bamboo' }, { word: 'Koala', hint: 'eucalyptus' },
    { word: 'Dolphin', hint: 'smart' }, { word: 'Whale', hint: 'giant' },
    { word: 'Shark', hint: 'ocean' }, { word: 'Octopus', hint: 'tentacles' },
    { word: 'Penguin', hint: 'cold' }, { word: 'Eagle', hint: 'wings' },
    { word: 'Owl', hint: 'night' }, { word: 'Parrot', hint: 'talk' },
    { word: 'Flamingo', hint: 'pink' }, { word: 'Swan', hint: 'graceful' },
    { word: 'Horse', hint: 'ride' }, { word: 'Cow', hint: 'milk' },
    { word: 'Pig', hint: 'mud' }, { word: 'Sheep', hint: 'wool' },
    { word: 'Goat', hint: 'horns' }, { word: 'Deer', hint: 'forest' },
    { word: 'Fox', hint: 'sly' }, { word: 'Wolf', hint: 'pack' },
    { word: 'Bear', hint: 'hibernate' }, { word: 'Rabbit', hint: 'hop' },
    { word: 'Squirrel', hint: 'nuts' }, { word: 'Raccoon', hint: 'mask' },
    { word: 'Sloth', hint: 'slow' }, { word: 'Monkey', hint: 'climb' },
    { word: 'Gorilla', hint: 'strong' }, { word: 'Camel', hint: 'desert' },
    { word: 'Llama', hint: 'wool' }, { word: 'Buffalo', hint: 'herd' },
    { word: 'Moose', hint: 'antlers' }, { word: 'Seal', hint: 'flippers' },
    { word: 'Walrus', hint: 'tusks' }, { word: 'Crocodile', hint: 'jaws' },
    { word: 'Alligator', hint: 'swamp' }, { word: 'Frog', hint: 'jump' },
    { word: 'Snake', hint: 'slither' }, { word: 'Turtle', hint: 'shell' },
    { word: 'Lizard', hint: 'scales' }, { word: 'Peacock', hint: 'feathers' },
    { word: 'Bat', hint: 'night' }, { word: 'Hedgehog', hint: 'spines' },
  ],
  'Irish Slang': [
    { word: 'Grand', hint: 'fine' }, { word: 'Craic', hint: 'fun' },
    { word: 'Gas', hint: 'funny' }, { word: 'Deadly', hint: 'great' },
    { word: 'Savage', hint: 'excellent' }, { word: 'Sound', hint: 'kind' },
    { word: "Fair play", hint: "respect" }, { word: "What's the story", hint: "greeting" },
    { word: 'Yoke', hint: 'object' }, { word: 'Eejit', hint: 'fool' },
    { word: 'Gobshite', hint: 'idiot' }, { word: 'Gowl', hint: 'insult' },
    { word: 'Dose', hint: 'annoying' }, { word: 'Feck', hint: 'swear' },
    { word: 'Jaysus', hint: 'surprise' }, { word: 'Shift', hint: 'kiss' },
    { word: 'Mot', hint: 'girlfriend' }, { word: 'Lad', hint: 'male' },
    { word: 'Yer man', hint: 'person' }, { word: 'Yer wan', hint: 'person' },
    { word: 'Banjaxed', hint: 'broken' }, { word: 'Knackered', hint: 'tired' },
    { word: 'Scuttered', hint: 'drunk' }, { word: 'Plastered', hint: 'drunk' },
    { word: 'Locked', hint: 'drunk' }, { word: 'Hammered', hint: 'drunk' },
    { word: 'Pissed', hint: 'drunk' }, { word: 'Buzzin', hint: 'excited' },
    { word: 'Giving out', hint: 'complaining' }, { word: 'On the lash', hint: 'drinking' },
    { word: 'Up to 90', hint: 'busy' }, { word: 'Taking the piss', hint: 'mocking' },
    { word: 'Acting the maggot', hint: 'foolish' }, { word: 'Head melted', hint: 'overwhelmed' },
    { word: 'Notions', hint: 'pretentious' }, { word: 'Bogger', hint: 'rural' },
    { word: 'Cute hoor', hint: 'sly' }, { word: 'Scarlet', hint: 'embarrassed' },
    { word: 'Away with the fairies', hint: 'distracted' }, { word: 'Story horse', hint: 'greeting' },
    { word: 'Cop on', hint: 'sense' }, { word: 'Dry shite', hint: 'boring' },
    { word: 'Chancer', hint: 'opportunist' }, { word: 'Manky', hint: 'dirty' },
    { word: 'Skint', hint: 'broke' }, { word: 'Gaff', hint: 'home' },
    { word: 'Messages', hint: 'groceries' }, { word: 'Shifted', hint: 'kissed' },
    { word: 'Leg it', hint: 'run' }, { word: 'Sound out', hint: 'confirm' },
  ],
};

const premiumCategoriesEN = {
  'Professions': Array(50).fill({ word: 'Doctor', hint: 'healthcare' }),
  'Gen Z Mode': Array(50).fill({ word: 'Rizz', hint: 'confidence' }),
  'Adult Party Mode': Array(50).fill({ word: 'Hangover', hint: 'morning' }),
  'Movie & TV Characters': Array(50).fill({ word: 'Batman', hint: 'vigilante' }),
  'Fantasy & Mythology': Array(50).fill({ word: 'Dragon', hint: 'fire' }),
  'Famous Songs': Array(50).fill({ word: 'Billie Jean', hint: 'denim' }),
};

const freeCategoriesLT = {
  'Atsitiktinė': [
    { word: 'Dantų šepetėlis', hint: 'vonios kambarys' }, { word: 'Liūtas', hint: 'plėšrūnas' },
    { word: 'Elon Musk', hint: 'technologijos' }, { word: 'Grand', hint: 'gerai' },
    { word: 'Kėdė', hint: 'sėdėjimas' }, { word: 'Taylor Swift', hint: 'pop' },
    { word: 'Delfinas', hint: 'protingas' }, { word: 'Craic', hint: 'linksmybės' },
    { word: 'Veidrodis', hint: 'atspindys' }, { word: 'Cristiano Ronaldo', hint: 'futbolas' },
    { word: 'Erelis', hint: 'sparnai' }, { word: 'Deadly', hint: 'puiku' },
    { word: 'Nešiojamas', hint: 'kompiuteris' }, { word: 'Beyoncé', hint: 'dainininkė' },
    { word: 'Ryklys', hint: 'vandenynas' }, { word: 'Gobshite', hint: 'idiotas' },
    { word: 'Skėtis', hint: 'lietus' }, { word: 'LeBron James', hint: 'krepšinis' },
    { word: 'Pingvinas', hint: 'šaltis' }, { word: 'Knackered', hint: 'pavargęs' },
    { word: 'Šaldytuvas', hint: 'šaltis' }, { word: 'Gordon Ramsay', hint: 'virimas' },
    { word: 'Vilkas', hint: 'gauja' }, { word: 'Scarlet', hint: 'gėda' },
  ],
  'Kasdieniai Daiktai': [
    { word: 'Dantų šepetėlis', hint: 'vonios kambarys' }, { word: 'Kėdė', hint: 'sėdėjimas' },
    { word: 'Stalas', hint: 'paviršius' }, { word: 'Sofa', hint: 'svetainė' },
    { word: 'Pagalvė', hint: 'lova' }, { word: 'Antklodė', hint: 'šiluma' },
    { word: 'Lempa', hint: 'apšvietimas' }, { word: 'Veidrodis', hint: 'atspindys' },
    { word: 'Laikrodis', hint: 'laikas' }, { word: 'Durys', hint: 'įėjimas' },
    { word: 'Langas', hint: 'stiklas' }, { word: 'Kilimas', hint: 'grindys' },
    { word: 'Lentyna', hint: 'saugojimas' }, { word: 'Stalčius', hint: 'saugojimas' },
    { word: 'Spintelė', hint: 'virtuvė' }, { word: 'Televizorius', hint: 'ekranas' },
    { word: 'Nuotolinis', hint: 'valdymas' }, { word: 'Kroviklis', hint: 'energija' },
    { word: 'Nešiojamas', hint: 'kompiuteris' }, { word: 'Ausinės', hint: 'garsas' },
    { word: 'Kuprinė', hint: 'nešiojimas' }, { word: 'Piniginė', hint: 'pinigai' },
    { word: 'Raktai', hint: 'prieiga' }, { word: 'Rašiklis', hint: 'rašymas' },
    { word: 'Užrašų knygelė', hint: 'popierius' }, { word: 'Knyga', hint: 'skaitymas' },
    { word: 'Puodelis', hint: 'gėrimas' }, { word: 'Stiklinė', hint: 'gėrimas' },
    { word: 'Lėkštė', hint: 'maistas' }, { word: 'Šaukštas', hint: 'įrankis' },
    { word: 'Šakutė', hint: 'įrankis' }, { word: 'Peilis', hint: 'pjaustymas' },
    { word: 'Keptuvė', hint: 'virimas' }, { word: 'Puodas', hint: 'virimas' },
    { word: 'Virdulys', hint: 'vanduo' }, { word: 'Skrudintuvas', hint: 'duona' },
    { word: 'Mikrobangė', hint: 'šildymas' }, { word: 'Šaldytuvas', hint: 'šaltis' },
    { word: 'Šaldiklis', hint: 'šaldymas' }, { word: 'Šiukšlių dėžė', hint: 'atliekos' },
    { word: 'Rankšluostis', hint: 'džiovinimas' }, { word: 'Muilas', hint: 'valymas' },
    { word: 'Šampūnas', hint: 'plaukai' }, { word: 'Dantų pasta', hint: 'higiena' },
    { word: 'Šepetys', hint: 'šukavimas' }, { word: 'Skėtis', hint: 'lietus' },
    { word: 'Striukė', hint: 'apsauga' }, { word: 'Batai', hint: 'avalynė' },
    { word: 'Akiniai nuo saulės', hint: 'saulė' }, { word: 'Žadintuvas', hint: 'kėlimas' },
  ],
  'Garsūs Žmonės': [
    { word: 'Elon Musk', hint: 'technologijos' }, { word: 'Taylor Swift', hint: 'pop' },
    { word: 'Cristiano Ronaldo', hint: 'futbolas' }, { word: 'Lionel Messi', hint: 'futbolas' },
    { word: 'Dwayne Johnson', hint: 'imtynės' }, { word: 'Kim Kardashian', hint: 'realybė' },
    { word: 'Gordon Ramsay', hint: 'virimas' }, { word: 'MrBeast', hint: 'YouTube' },
    { word: 'Oprah Winfrey', hint: 'pokalbių laida' }, { word: 'Barack Obama', hint: 'prezidentas' },
    { word: 'Michael Jackson', hint: 'pop' }, { word: 'Beyoncé', hint: 'dainininkė' },
    { word: 'Johnny Depp', hint: 'aktoriaus' }, { word: 'Keanu Reeves', hint: 'veiksmas' },
    { word: 'Tom Cruise', hint: 'veiksmas' }, { word: 'Adele', hint: 'vokalas' },
    { word: 'Ed Sheeran', hint: 'gitara' }, { word: 'Drake', hint: 'repas' },
    { word: 'Rihanna', hint: 'mada' }, { word: 'Billie Eilish', hint: 'alternatyva' },
    { word: 'LeBron James', hint: 'krepšinis' }, { word: 'Chris Hemsworth', hint: 'Thor' },
    { word: 'Margot Robbie', hint: 'Barbie' }, { word: 'Pope Francis', hint: 'Vatikanas' },
  ],
  'Gyvūnai': [
    { word: 'Šuo', hint: 'augintinis' }, { word: 'Katė', hint: 'augintinis' },
    { word: 'Liūtas', hint: 'plėšrūnas' }, { word: 'Tigras', hint: 'dryžiai' },
    { word: 'Dramblys', hint: 'didžiulis' }, { word: 'Žirafa', hint: 'aukštas' },
    { word: 'Zebras', hint: 'dryžiai' }, { word: 'Kengūra', hint: 'šokinėjimas' },
    { word: 'Panda', hint: 'bambukas' }, { word: 'Koala', hint: 'eukaliptas' },
    { word: 'Delfinas', hint: 'protingas' }, { word: 'Banginis', hint: 'milžinas' },
    { word: 'Ryklys', hint: 'vandenynas' }, { word: 'Aštuonkojis', hint: 'čiulptuvai' },
    { word: 'Pingvinas', hint: 'šaltis' }, { word: 'Erelis', hint: 'sparnai' },
  ],
  'Airių Slangas': [
    { word: 'Grand', hint: 'gerai' }, { word: 'Craic', hint: 'linksmybės' },
    { word: 'Gas', hint: 'juokinga' }, { word: 'Deadly', hint: 'puiku' },
    { word: 'Savage', hint: 'nuostabu' }, { word: 'Sound', hint: 'malonus' },
    { word: 'Yoke', hint: 'daiktas' }, { word: 'Eejit', hint: 'kvailys' },
  ],
};

const premiumCategoriesLT = {
  'Profesijos': Array(50).fill({ word: 'Gydytojas', hint: 'sveikatos priežiūra' }),
  'Gen Z': Array(50).fill({ word: 'Rizz', hint: 'pasitikėjimas' }),
  'Suaugusiųjų Vakarėlis': Array(50).fill({ word: 'Pagirios', hint: 'rytas' }),
  'Filmų ir TV Personažai': Array(50).fill({ word: 'Betmenas', hint: 'globėjas' }),
  'Fantazija ir Mitologija': Array(50).fill({ word: 'Drakonas', hint: 'ugnis' }),
  'Garsios Dainos': Array(50).fill({ word: 'Billie Jean', hint: 'džinsai' }),
};

const translations = {
  en: {
    title: 'CREATE ROOM',
    players: 'PLAYERS',
    addPlayer: 'Add Player',
    playerPlaceholder: 'Enter name...',
    category: 'CATEGORY',
    random: 'Random',
    hiddenRoles: 'NUMBER OF SPIES',
    // Game mode labels & subtitles
    clueAssist: 'CLUE ASSIST',
    clueAssistSub: 'Spy gets category hint',
    assistOn: 'On',
    assistOff: 'Off',
    chaosRound: 'CHAOS ROUND',
    // ← Updated description
    chaosRoundSub: 'A chance all players become spies',
    chaosOn: 'On',
    chaosOff: 'Off',
    timeLimit: 'TIME LIMIT',
    timeLimitSub: '15s Per Person',
    timeOn: 'On',
    timeOff: 'Off',
    startGame: 'START GAME',
    back: 'BACK',
    minPlayers: 'Need at least 3 players!',
    noName: 'Please enter a name',
    duplicateName: 'Name already exists!',
    freeCategories: '🆓 FREE CATEGORIES',
    premiumCategories: '💰 PREMIUM',
    unlockPremium: 'Unlock Premium',
    premiumTitle: 'Unlock Premium Categories',
    premiumDesc: 'Get access to 300+ words across 6 exclusive categories!',
    premiumFeatures: '• Professions\n• Gen Z Mode\n• Adult Party Mode\n• Movie & TV Characters\n• Fantasy & Mythology\n• Famous Songs',
    unlockPrice: 'Unlock for $4.99',
    maybeLater: 'Maybe Later',
    needMorePlayers: (n) => `Add ${n} more player${n === 1 ? '' : 's'} to start.`,
    maxPlayers: 'Max 12 players',
    gameModes: 'GAME MODES',
  },
  lt: {
    title: 'SUKURTI KAMBARĮ',
    players: 'ŽAIDĖJAI',
    addPlayer: 'Pridėti žaidėją',
    playerPlaceholder: 'Įveskite vardą...',
    category: 'KATEGORIJA',
    random: 'Atsitiktinė',
    hiddenRoles: 'ŠNIPŲ SKAIČIUS',
    clueAssist: 'UŽUOMINŲ PAGALBA',
    clueAssistSub: 'Šnipas gauna kategorijos užuominą',
    assistOn: 'Įjungta',
    assistOff: 'Išjungta',
    chaosRound: 'CHAOS RATAS',
    chaosRoundSub: 'Galimybė visiems tapti šnipais',
    chaosOn: 'Įjungta',
    chaosOff: 'Išjungta',
    timeLimit: 'LAIKO RIBA',
    timeLimitSub: '15s Žmogui',
    timeOn: 'Įjungta',
    timeOff: 'Išjungta',
    startGame: 'PRADĖTI ŽAIDIMĄ',
    back: 'ATGAL',
    minPlayers: 'Reikia bent 3 žaidėjų!',
    noName: 'Įveskite vardą',
    duplicateName: 'Toks vardas jau yra!',
    freeCategories: '🆓 NEMOKAMOS KATEGORIJOS',
    premiumCategories: '💰 PREMIUM',
    unlockPremium: 'Atrakinti Premium',
    premiumTitle: 'Atrakinti Premium Kategorijas',
    premiumDesc: 'Gaukite prieigą prie 300+ žodžių iš 6 išskirtinių kategorijų!',
    premiumFeatures: '• Profesijos\n• Gen Z\n• Suaugusiųjų Vakarėlis\n• Filmų ir TV Personažai\n• Fantazija ir Mitologija\n• Garsios Dainos',
    unlockPrice: 'Atrakinti už $4.99',
    maybeLater: 'Galbūt Vėliau',
    needMorePlayers: (n) => `Pridėkite dar ${n} žaidėjus, kad galėtumėte žaisti.`,
    maxPlayers: 'Maks. 12 žaidėjų',
    gameModes: 'ŽAIDIMO REŽIMAI',
  },
};

/* -------------------- SCREEN -------------------- */
export default function CreateRoomScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const lang = route.params?.language || 'en';
  const t = translations[lang];

  const freeCategories = lang === 'lt' ? freeCategoriesLT : freeCategoriesEN;
  const premiumCategories = lang === 'lt' ? premiumCategoriesLT : premiumCategoriesEN;

  const MIN_PLAYERS = 3;
  const MAX_PLAYERS = 12;

  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(freeCategories)[0]);
  const [numImposters, setNumImposters] = useState(1);
  // ← All game modes default OFF
  const [clueAssist, setClueAssist] = useState(false); // OFF by default
  const [chaosRound, setChaosRound] = useState(false);
  const [timeLimit, setTimeLimit] = useState(false);
  const [pressedButton, setPressedButton] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const styles = getStyles(colors, isDarkMode);

  const remainingPlayers = Math.max(0, MIN_PLAYERS - players.length);
  const canStart = players.length >= MIN_PLAYERS;

  const normalizedPlayers = useMemo(
    () => players.map((p) => p.trim().toLowerCase()),
    [players]
  );

  const addPlayer = () => {
    const name = newPlayerName.trim();
    if (!name) { Alert.alert('Error', t.noName); return; }
    lightHaptic();
    if (players.length >= MAX_PLAYERS) { Alert.alert('Error', t.maxPlayers); return; }
    if (normalizedPlayers.includes(name.toLowerCase())) { Alert.alert('Error', t.duplicateName); return; }
    setPlayers((prev) => [...prev, name]);
    setNewPlayerName('');
  };

  const removePlayer = (index) => setPlayers((prev) => prev.filter((_, i) => i !== index));

  const selectCategory = (cat, isPremiumCat = false) => {
    if (isPremiumCat && !isPremium) { setShowPremiumModal(true); return; }
    lightHaptic();
    setSelectedCategory(cat);
  };

  const unlockPremium = () => { setIsPremium(true); setShowPremiumModal(false); };

  const startGame = () => {
    if (!canStart) { Alert.alert('Error', t.needMorePlayers(remainingPlayers)); return; }
    mediumHaptic();

    const categoryData = freeCategories[selectedCategory] || premiumCategories[selectedCategory];
    const randomItem = categoryData[Math.floor(Math.random() * categoryData.length)];
    const secretWord = typeof randomItem === 'object' ? randomItem.word : randomItem;
    const hintWord = typeof randomItem === 'object' ? randomItem.hint : '';

    // ← Chaos Round: 30% chance all players become spies
    const triggerChaos = chaosRound && Math.random() < 0.30;
    const actualNumImposters = triggerChaos ? players.length : numImposters;

    let imposterIndices = [];
    while (imposterIndices.length < Math.min(actualNumImposters, players.length)) {
      const idx = Math.floor(Math.random() * players.length);
      if (!imposterIndices.includes(idx)) imposterIndices.push(idx);
    }

    navigation.navigate('Game', {
      players,
      secretWord,
      hintWord,
      imposterIndices,
      clueAssist,
      category: selectedCategory,
      categoryId: selectedCategory,
      categoryName: selectedCategory,
      language: lang,
      timeLimit,
      timePerPerson: 15,
      numImposters: actualNumImposters,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Players */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.players} ({players.length}/{MAX_PLAYERS})</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={t.playerPlaceholder}
                placeholderTextColor={isDarkMode ? "#aaaaaa" : "#666666"}
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                maxLength={15}
                onSubmitEditing={addPlayer}
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addPlayer} activeOpacity={0.9}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {players.length === 0 ? (
            <Text style={styles.helperText}>{t.needMorePlayers(MIN_PLAYERS)}</Text>
          ) : !canStart ? (
            <Text style={styles.helperText}>{t.needMorePlayers(remainingPlayers)}</Text>
          ) : (
            <Text style={styles.helperTextOk}>Ready to start.</Text>
          )}

          <View style={styles.playersList}>
            {players.map((player, index) => (
              <View key={`${player}-${index}`} style={styles.playerChip}>
                <Text style={styles.playerName}>{player}</Text>
                <TouchableOpacity onPress={() => removePlayer(index)} hitSlop={10}>
                  <Ionicons name="close-circle" size={20} color="#ff1a1a" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Free Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.freeCategories}</Text>
          <View style={styles.categoryList}>
            {Object.keys(freeCategories).map((cat) => (
              <View key={cat} style={{ width: "100%" }}>
                <AppButton
                  title={cat === "Random" || cat === "Atsitiktinė" ? `🎲 ${t.random}` : cat}
                  onPress={() => selectCategory(cat)}
                  activeOpacity={0.8}
                  style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                  textStyle={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Premium Categories */}
        <View style={styles.section}>
          <View style={styles.premiumHeader}>
            <Text style={styles.sectionTitle}>{t.premiumCategories}</Text>
            {!isPremium && (
              <TouchableOpacity style={styles.unlockButton} onPress={() => setShowPremiumModal(true)}>
                <Text style={styles.unlockButtonText}>{t.unlockPremium}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.categoryList}>
            {Object.keys(premiumCategories).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip, styles.premiumChip,
                  selectedCategory === cat && isPremium && styles.categoryChipActive,
                  !isPremium && styles.lockedChip,
                ]}
                onPress={() => selectCategory(cat, true)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryText, !isPremium && styles.lockedText, selectedCategory === cat && isPremium && styles.categoryTextActive]}>
                  {cat}
                </Text>
                {!isPremium && <Text style={styles.lockIcon}>🔒</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Hidden Roles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.hiddenRoles}</Text>
          <View style={styles.counterContainer}>
            {[1, 2, 3].map((num) => (
              <TouchableOpacity
                key={num}
                style={[styles.counterButton, numImposters === num ? styles.counterButtonActive : styles.strongOutline]}
                onPress={() => setNumImposters(num)}
                activeOpacity={0.8}
              >
                <Text style={[styles.counterText, numImposters === num && styles.counterTextActive]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Game Modes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.gameModes}</Text>
          <View style={styles.toggleRow}>

            {/* Clue Assist — now has subtitle describing what it does */}
            <TouchableOpacity
              style={[styles.toggleSquare, clueAssist ? styles.toggleSquareActive : styles.strongOutline]}
              onPress={() => setClueAssist(!clueAssist)}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleSquareTitle, clueAssist && styles.toggleSquareTitleActive]}>{t.clueAssist}</Text>
              <Text style={[styles.toggleSquareSubtitle, clueAssist && styles.toggleSquareSubtitleActive]}>{t.clueAssistSub}</Text>
              <View style={[styles.toggleIndicator, clueAssist && styles.toggleIndicatorActive]}>
                <Text style={[styles.toggleIndicatorText, clueAssist && styles.toggleIndicatorTextActive]}>
                  {clueAssist ? t.assistOn : t.assistOff}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Chaos Round — renamed + new subtitle */}
            <TouchableOpacity
              style={[styles.toggleSquare, chaosRound ? styles.toggleSquareActive : styles.strongOutline]}
              onPress={() => setChaosRound(!chaosRound)}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleSquareTitle, chaosRound && styles.toggleSquareTitleActive]}>{t.chaosRound}</Text>
              <Text style={[styles.toggleSquareSubtitle, chaosRound && styles.toggleSquareSubtitleActive]}>{t.chaosRoundSub}</Text>
              <View style={[styles.toggleIndicator, chaosRound && styles.toggleIndicatorActive]}>
                <Text style={[styles.toggleIndicatorText, chaosRound && styles.toggleIndicatorTextActive]}>
                  {chaosRound ? t.chaosOn : t.chaosOff}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Time Limit */}
            <TouchableOpacity
              style={[styles.toggleSquare, timeLimit ? styles.toggleSquareActive : styles.strongOutline]}
              onPress={() => setTimeLimit(!timeLimit)}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleSquareTitle, timeLimit && styles.toggleSquareTitleActive]}>{t.timeLimit}</Text>
              <Text style={[styles.toggleSquareSubtitle, timeLimit && styles.toggleSquareSubtitleActive]}>{t.timeLimitSub}</Text>
              <View style={[styles.toggleIndicator, timeLimit && styles.toggleIndicatorActive]}>
                <Text style={[styles.toggleIndicatorText, timeLimit && styles.toggleIndicatorTextActive]}>
                  {timeLimit ? t.timeOn : t.timeOff}
                </Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>

        <AppButton
          title={!canStart ? t.needMorePlayers(remainingPlayers) : t.startGame}
          onPress={startGame}
          disabled={!canStart}
          onPressIn={() => setPressedButton("start")}
          onPressOut={() => setPressedButton(null)}
          style={[styles.startButton, pressedButton === "start" && styles.startButtonPressed, !canStart && styles.startButtonDisabled]}
          textStyle={styles.startButtonText}
          rightIcon={<Ionicons name="play" size={20} color="#fff" />}
        />
      </ScrollView>

      {/* Premium modal */}
      <Modal visible={showPremiumModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.premiumTitle}</Text>
            <Text style={styles.modalDesc}>{t.premiumDesc}</Text>
            <Text style={styles.modalFeatures}>{t.premiumFeatures}</Text>
            <TouchableOpacity style={styles.unlockPriceButton} onPress={unlockPremium}>
              <Text style={styles.unlockPriceText}>{t.unlockPrice}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.maybeLaterButton} onPress={() => setShowPremiumModal(false)}>
              <Text style={styles.maybeLaterText}>{t.maybeLater}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* -------------------- STYLES -------------------- */
const getStyles = (colors, isDarkMode) => {
  const border = isDarkMode ? '#ffffff' : '#000000';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 20, paddingTop: 36 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
    backButton: {
      width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface,
      justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: border,
    },
    strongOutline: { borderWidth: 2, borderColor: border, backgroundColor: colors.surface },
    title: { fontSize: 26, fontWeight: '900', color: isDarkMode ? '#fff' : '#000', letterSpacing: 3 },
    placeholder: { width: 44 },
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: isDarkMode ? '#ffffff' : '#000000', marginBottom: 14, letterSpacing: 3 },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    inputContainer: {
      flex: 1, borderWidth: 1, borderColor: isDarkMode ? '#444444' : '#cccccc',
      borderRadius: 14, backgroundColor: colors.surface, overflow: 'hidden',
    },
    input: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, fontSize: 18, color: isDarkMode ? '#ffffff' : '#000000' },
    addButton: {
      width: 52, height: 52, backgroundColor: colors.primary, borderRadius: 14,
      justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: border,
    },
    helperText: { marginTop: 10, color: isDarkMode ? '#aaaaaa' : '#666666', fontWeight: '600', fontSize: 15 },
    helperTextOk: { marginTop: 10, color: isDarkMode ? '#9dffb3' : '#0a6b2d', fontWeight: '700', fontSize: 15 },
    playersList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
    playerChip: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
      paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20,
      borderWidth: 1, borderColor: isDarkMode ? '#444444' : '#cccccc', gap: 10,
    },
    playerName: { color: isDarkMode ? '#ffffff' : '#000000', fontWeight: '600', fontSize: 16 },
    categoryList: { gap: 8 },
    categoryChip: {
      backgroundColor: colors.surface, paddingVertical: 14, paddingHorizontal: 20,
      borderRadius: 14, borderWidth: 2, borderColor: border,
    },
    categoryChipActive: { backgroundColor: colors.primary, borderColor: border },
    categoryText: { color: isDarkMode ? '#ffffff' : '#000000', fontWeight: '600', fontSize: 17 },
    categoryTextActive: { color: '#fff', fontWeight: '700' },
    premiumHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    unlockButton: {
      backgroundColor: colors.accent, paddingVertical: 8, paddingHorizontal: 16,
      borderRadius: 20, borderWidth: 2, borderColor: border,
    },
    unlockButtonText: { color: isDarkMode ? '#000' : '#000', fontWeight: '800', fontSize: 14 },
    premiumChip: { position: 'relative' },
    lockedChip: { borderWidth: 1, borderColor: colors.primary, backgroundColor: 'transparent' },
    lockedText: { color: isDarkMode ? '#888888' : '#999999' },
    lockIcon: { position: 'absolute', right: 20, fontSize: 20 },
    counterContainer: { flexDirection: 'row', gap: 12 },
    counterButton: { flex: 1, backgroundColor: colors.surface, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
    counterButtonActive: {
      backgroundColor: colors.primary, borderWidth: 2, borderColor: border,
      shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    counterText: { color: isDarkMode ? '#ffffff' : '#000000', fontSize: 24, fontWeight: '700' },
    counterTextActive: { color: '#fff' },
    toggleRow: { flexDirection: 'row', gap: 10 },
    toggleSquare: {
      flex: 1, backgroundColor: colors.surface, padding: 12, borderRadius: 14,
      alignItems: 'center', minHeight: 120, justifyContent: 'space-between',
    },
    toggleSquareActive: { borderWidth: 2, borderColor: border, backgroundColor: colors.primary + '15' },
    toggleSquareTitle: { color: isDarkMode ? '#ffffff' : '#000000', fontWeight: '800', fontSize: 12, letterSpacing: 1, textAlign: 'center' },
    toggleSquareTitleActive: { color: isDarkMode ? '#fff' : '#000' },
    toggleSquareSubtitle: { color: isDarkMode ? '#aaaaaa' : '#666666', fontSize: 11, textAlign: 'center', marginTop: 4 },
    toggleSquareSubtitleActive: { color: isDarkMode ? '#fff' : '#000', opacity: 0.8 },
    toggleIndicator: {
      backgroundColor: isDarkMode ? '#333333' : '#e0e0e0', paddingVertical: 4, paddingHorizontal: 10,
      borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#555555' : '#999999',
    },
    toggleIndicatorActive: { backgroundColor: colors.primary, borderColor: border },
    toggleIndicatorText: { color: isDarkMode ? '#888888' : '#666666', fontWeight: '700', fontSize: 12 },
    toggleIndicatorTextActive: { color: '#fff' },
    startButton: {
      backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      paddingVertical: 20, borderRadius: 16, marginTop: 10, gap: 12, borderWidth: 2, borderColor: border,
      shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
    },
    startButtonDisabled: { opacity: 0.45 },
    startButtonPressed: { transform: [{ scale: 0.97 }], shadowOpacity: 0.2 },
    startButtonText: { color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: 2 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { backgroundColor: colors.surface, padding: 30, borderRadius: 20, width: '100%', maxWidth: 350, borderWidth: 2, borderColor: border },
    modalTitle: { fontSize: 22, fontWeight: '900', color: isDarkMode ? '#fff' : '#000', marginBottom: 15, textAlign: 'center', letterSpacing: 2 },
    modalDesc: { fontSize: 16, color: isDarkMode ? '#ffffff' : '#000000', marginBottom: 15, textAlign: 'center', lineHeight: 20 },
    modalFeatures: { fontSize: 15, color: isDarkMode ? '#aaaaaa' : '#666666', marginBottom: 25, lineHeight: 22 },
    unlockPriceButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: border },
    unlockPriceText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
    maybeLaterButton: { paddingVertical: 12, alignItems: 'center' },
    maybeLaterText: { color: isDarkMode ? '#888888' : '#666666', fontSize: 16, fontWeight: '600' },
  });
};