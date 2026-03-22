// CreateRoomScreen.js
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { usePremium } from '../context/PremiumContext';

import AppButton from "../components/AppButton";
import WeeklyCategoriesModal from "../components/WeeklyCategoriesModal";
import { LinearGradient } from 'expo-linear-gradient';

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
  'Professions': [
    { word: 'Doctor', hint: 'healthcare' }, { word: 'Engineer', hint: 'building' }, { word: 'Chef', hint: 'cooking' }, { word: 'Teacher', hint: 'education' },
    { word: 'Lawyer', hint: 'law' }, { word: 'Nurse', hint: 'hospital' }, { word: 'Pilot', hint: 'flying' }, { word: 'Architect', hint: 'design' },
    { word: 'Accountant', hint: 'money' }, { word: 'Mechanic', hint: 'cars' }, { word: 'Electrician', hint: 'wiring' }, { word: 'Plumber', hint: 'pipes' },
    { word: 'Carpenter', hint: 'wood' }, { word: 'Surgeon', hint: 'operating' }, { word: 'Dentist', hint: 'teeth' }, { word: 'Psychologist', hint: 'mind' },
    { word: 'Programmer', hint: 'coding' }, { word: 'Designer', hint: 'art' }, { word: 'Manager', hint: 'leadership' }, { word: 'Consultant', hint: 'advice' },
    { word: 'Firefighter', hint: 'fire' }, { word: 'Police Officer', hint: 'law' }, { word: 'Veterinarian', hint: 'animals' }, { word: 'Pharmacist', hint: 'drugs' },
    { word: 'Barber', hint: 'haircut' }, { word: 'Hairdresser', hint: 'styling' }, { word: 'Realtor', hint: 'housing' }, { word: 'Banker', hint: 'finance' },
    { word: 'Journalist', hint: 'news' }, { word: 'Photographer', hint: 'pictures' }, { word: 'Artist', hint: 'painting' }, { word: 'Musician', hint: 'instruments' },
    { word: 'Actor', hint: 'theater' }, { word: 'Athlete', hint: 'sports' }, { word: 'Coach', hint: 'training' }, { word: 'Chef', hint: 'restaurant' },
    { word: 'Waiter', hint: 'serving' }, { word: 'Bartender', hint: 'drinks' }, { word: 'Farmer', hint: 'crops' }, { word: 'Sailor', hint: 'ocean' },
    { word: 'Astronaut', hint: 'space' }, { word: 'Scientist', hint: 'research' }, { word: 'Cleaner', hint: 'sanitation' }, { word: 'Security Guard', hint: 'protection' },
    { word: 'Lifeguard', hint: 'swimming' }, { word: 'Florist', hint: 'flowers' }, { word: 'Baker', hint: 'bread' }, { word: 'Butcher', hint: 'meat' },
  ],
  'Gen Z Mode': [
    { word: 'Rizz', hint: 'charm' }, { word: 'Slay', hint: 'excel' }, { word: 'No cap', hint: 'truth' }, { word: 'Bussin', hint: 'amazing' },
    { word: 'Sheesh', hint: 'impressive' }, { word: 'Lowkey', hint: 'secretly' }, { word: 'Highkey', hint: 'obviously' }, { word: 'Bet', hint: 'agree' },
    { word: 'Sus', hint: 'suspicious' }, { word: 'Vibe check', hint: 'mood' }, { word: 'No shot', hint: 'deny' }, { word: 'Hits different', hint: 'special' },
    { word: 'Periodt', hint: 'final' }, { word: 'Tea', hint: 'gossip' }, { word: 'Salty', hint: 'bitter' }, { word: 'Ghosting', hint: 'disappear' },
    { word: 'Catfish', hint: 'fake' }, { word: 'Thirsty', hint: 'desperate' }, { word: 'GOAT', hint: 'greatest' }, { word: 'Flex', hint: 'brag' },
    { word: 'Salty', hint: 'upset' }, { word: 'Stan', hint: 'support' }, { word: 'Fax', hint: 'truth' }, { word: 'Ate', hint: 'did well' },
    { word: 'Understood the assignment', hint: 'delivered' }, { word: 'It\'s giving', hint: 'vibes' }, { word: 'Cheugy', hint: 'outdated' }, { word: 'Snatched', hint: 'winning' },
    { word: 'Not it', hint: 'reject' }, { word: 'Slaps', hint: 'great' }, { word: 'Mid', hint: 'mediocre' }, { word: 'Slinky', hint: 'trendy' },
    { word: 'Skibidi', hint: 'silly' }, { word: 'Sigma', hint: 'independent' }, { word: 'Fanum tax', hint: 'steal' }, { word: 'Unhinged', hint: 'wild' },
    { word: 'Seething', hint: 'angry' }, { word: 'Based', hint: 'authentic' }, { word: 'Cringe', hint: 'embarrassing' }, { word: 'Salty', hint: 'mad' },
    { word: 'Vibe', hint: 'feeling' }, { word: 'Chill', hint: 'relax' }, { word: 'Mood', hint: 'relate' }, { word: 'Oof', hint: 'yikes' },
  ],
  'Adult Party Mode': [
    { word: 'Hangover', hint: 'morning after' }, { word: 'Karaoke', hint: 'singing' }, { word: 'Shots', hint: 'drinking' }, { word: 'Beer pong', hint: 'game' },
    { word: 'Tequila', hint: 'agave' }, { word: 'Vodka', hint: 'russian' }, { word: 'Whiskey', hint: 'bourbon' }, { word: 'Keg stand', hint: 'stunt' },
    { word: 'Drunk dial', hint: 'call' }, { word: 'Taxi', hint: 'ride' }, { word: 'Bouncer', hint: 'security' }, { word: 'ID check', hint: 'verification' },
    { word: 'DJ', hint: 'music' }, { word: 'Dance floor', hint: 'moving' }, { word: 'Mosh pit', hint: 'crowd' }, { word: 'Mixer', hint: 'drink' },
    { word: 'Bottle service', hint: 'expensive' }, { word: 'Nightclub', hint: 'dancing' }, { word: 'Bar stool', hint: 'seating' }, { word: 'Bartender', hint: 'server' },
    { word: 'Jager bomb', hint: 'drink' }, { word: 'Pong table', hint: 'game' }, { word: 'Flip cup', hint: 'race' }, { word: 'Rule breaker', hint: 'fun' },
    { word: 'Hangry', hint: 'hungry4' }, { word: 'Pregame', hint: 'before' }, { word: 'Afterparty', hint: 'later' }, { word: 'Tipsy', hint: 'buzzed' },
    { word: 'Wasted', hint: 'verydrunk' }, { word: 'Blackout', hint: 'forgot' }, { word: 'Whiskey shots', hint: 'burning' }, { word: 'Beer bong', hint: 'chug' },
    { word: 'Two-faced', hint: 'false' }, { word: 'Slut drop', hint: 'dance' }, { word: 'Grinding', hint: 'dancing' }, { word: 'Bass', hint: 'loud' },
    { word: 'Strobe lights', hint: 'flashing' }, { word: 'Champagne', hint: 'fancy' }, { word: 'Chasers', hint: 'following' }, { word: 'Flip off', hint: 'ignore' },
    { word: 'Talk smack', hint: 'insult' }, { word: 'Comedy show', hint: 'entertainment' }, { word: 'Party foul', hint: 'mistake' }, { word: 'Wild night', hint: 'crazy' },
  ],
  'Movie & TV Characters': [
    { word: 'Batman', hint: 'vigilante' }, { word: 'Superman', hint: 'kryptonian' }, { word: 'Spider-Man', hint: 'web' }, { word: 'Wonder Woman', hint: 'amazonian' },
    { word: 'Hermione', hint: 'intelligent' }, { word: 'Harry Potter', hint: 'scar' }, { word: 'Ron Weasley', hint: 'friend' }, { word: 'Frodo', hint: 'ring' },
    { word: 'Gandalf', hint: 'wizard' }, { word: 'Daenerys', hint: 'dragon' }, { word: 'Jon Snow', hint: 'bastard' }, { word: 'Walter White', hint: 'chemistry' },
    { word: 'Jesse Pinkman', hint: 'crystal' }, { word: 'Tony Soprano', hint: 'mob' }, { word: 'Tyrion Lannister', hint: 'dwarf' }, { word: 'Arya Stark', hint: 'list' },
    { word: 'Luke Skywalker', hint: 'force' }, { word: 'Darth Vader', hint: 'dark' }, { word: 'Princess Leia', hint: 'rebel' }, { word: 'Yoda', hint: 'wisdom' },
    { word: 'Terminator', hint: 'robot' }, { word: 'RoboCop', hint: 'cyborg' }, { word: 'Deadpool', hint: 'merc' }, { word: 'Wolverine', hint: 'healing' },
    { word: 'Iron Man', hint: 'armor' }, { word: 'Captain America', hint: 'shield' }, { word: 'Thor', hint: 'hammer' }, { word: 'Hulk', hint: 'angry' },
    { word: 'Black Widow', hint: 'spy' }, { word: 'Thanos', hint: 'titan' }, { word: 'Joker', hint: 'clown' }, { word: 'Catwoman', hint: 'thief' },
    { word: 'Penguin', hint: 'villain' }, { word: 'Riddler', hint: 'puzzle' }, { word: 'Scarecrow', hint: 'fear' }, { word: 'Harley Quinn', hint: 'admirer' },
    { word: 'Lex Luthor', hint: 'bald' }, { word: 'Doctor Octopus', hint: 'tentacles' }, { word: 'Green Goblin', hint: 'pumpkin' }, { word: 'Venom', hint: 'symbiote' },
    { word: 'Magneto', hint: 'metal' }, { word: 'Storm', hint: 'weather' }, { word: 'Professor X', hint: 'telepath' }, { word: 'Mystique', hint: 'shapeshifter' },
  ],
  'Fantasy & Mythology': [
    { word: 'Dragon', hint: 'fire' }, { word: 'Phoenix', hint: 'rebirth' }, { word: 'Unicorn', hint: 'magical' }, { word: 'Centaur', hint: 'hybrid' },
    { word: 'Pegasus', hint: 'winged' }, { word: 'Cerberus', hint: 'hound' }, { word: 'Minotaur', hint: 'maze' }, { word: 'Basilisk', hint: 'serpent' },
    { word: 'Sphinx', hint: 'riddle' }, { word: 'Hydra', hint: 'heads' }, { word: 'Kraken', hint: 'tentacle' }, { word: 'Werewolf', hint: 'lunar' },
    { word: 'Vampire', hint: 'undead' }, { word: 'Witch', hint: 'spell' }, { word: 'Wizard', hint: 'magic' }, { word: 'Fairy', hint: 'tiny' },
    { word: 'Elf', hint: 'pointed' }, { word: 'Giant', hint: 'huge' }, { word: 'Dwarf', hint: 'short' }, { word: 'Goblin', hint: 'mischievous' },
    { word: 'Orc', hint: 'warrior' }, { word: 'Troll', hint: 'bridge' }, { word: 'Demon', hint: 'evil' }, { word: 'Angel', hint: 'heavenly' },
    { word: 'Griffon', hint: 'halfbird' }, { word: 'Chimera', hint: 'multiple' }, { word: 'Medusa', hint: 'snakes' }, { word: 'Gorgon', hint: 'petrify' },
    { word: 'Hecatonchires', hint: 'hundredarms' }, { word: 'Siren', hint: 'song' }, { word: 'Banshee', hint: 'wail' }, { word: 'Leviathan', hint: 'beast' },
    { word: 'Chimera', hint: 'hybrid' }, { word: 'Djinn', hint: 'wish' }, { word: 'Cyclops', hint: 'oneeye' }, { word: 'Sasquatch', hint: 'bigfoot' },
    { word: 'Yeti', hint: 'snow' }, { word: 'Nessie', hint: 'loch' }, { word: 'Chupacabra', hint: 'goatsucker' }, { word: 'Mothman', hint: 'wings' },
    { word: 'Golem', hint: 'clay' }, { word: 'Gargoyle', hint: 'stone' }, { word: 'Will-o\'-the-wisp', hint: 'light' }, { word: 'Valkyrie', hint: 'norse' },
  ],
  'Famous Songs': [
    { word: 'Billie Jean', hint: 'not mine' }, { word: 'Bohemian Rhapsody', hint: 'opera' }, { word: 'Imagine', hint: 'lennon' }, { word: 'Yesterday', hint: 'beatles' },
    { word: 'Thriller', hint: 'jackson' }, { word: 'Like a Virgin', hint: 'madonna' }, { word: 'Hotel California', hint: 'eagles' }, { word: 'Stairway to Heaven', hint: 'zeppelin' },
    { word: 'Smells Like Teen Spirit', hint: 'nirvana' }, { word: 'One', hint: 'metallica' }, { word: 'Hallelujah', hint: 'cohen' }, { word: 'Wonderwall', hint: 'oasis' },
    { word: 'Sweet Home Alabama', hint: 'skynyrd' }, { word: 'Hello Darkness', hint: 'simon' }, { word: 'Black', hint: 'pearl' }, { word: 'Comfortably Numb', hint: 'floyd' },
    { word: 'Dream On', hint: 'aerosmith' }, { word: 'Paranoid Android', hint: 'radiohead' }, { word: 'Toxic', hint: 'britney' }, { word: 'Single Ladies', hint: 'beyonce' },
    { word: 'Bad Guy', hint: 'eilish' }, { word: 'Blinding Lights', hint: 'weeknd' }, { word: 'old town road', hint: 'nas' }, { word: 'Levitating', hint: 'dua' },
    { word: 'Uptown Funk', hint: 'bruno' }, { word: 'Gangsta\'s Paradise', hint: 'coolio' }, { word: 'Baby', hint: 'bieber' }, { word: 'Umbrella', hint: 'rihanna' },
    { word: 'Rolling in the Deep', hint: 'adele' }, { word: 'Someone Like You', hint: 'adele' }, { word: 'Royals', hint: 'lorde' }, { word: 'Chandelier', hint: 'sia' },
    { word: 'Hotline Bling', hint: 'drake' }, { word: 'In da Club', hint: '50cent' }, { word: 'Lose Yourself', hint: 'eminem' }, { word: 'Without Me', hint: 'eminem' },
    { word: 'Gold Digger', hint: 'kanye' }, { word: '22', hint: 'taylor' }, { word: 'Shake It Off', hint: 'taylor' }, { word: 'Bad Blood', hint: 'taylor' },
    { word: 'Love Story', hint: 'taylor' }, { word: 'Blank Space', hint: 'taylor' }, { word: 'All Too Well', hint: 'taylor' }, { word: 'Anti-Hero', hint: 'taylor' },
  ],
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
};

const premiumCategoriesLT = {
  'Lietuviškas Slangas': [
    { word: 'Bičas', hint: 'draugas' }, { word: 'Šaunu', hint: 'gerai' },
    { word: 'Kaifas', hint: 'malonumas' }, { word: 'Žiauriai', hint: 'labai' },
    { word: 'Nieko sau', hint: 'neblogai' }, { word: 'Geras', hint: 'puiku' },
    { word: 'Bambizas', hint: 'vaikas' }, { word: 'Smagiai', hint: 'džiaugsmas' },
    { word: 'Dūmas', hint: 'rūkymas' }, { word: 'Baisi', hint: 'labai' },
    { word: 'Pūdyti', hint: 'erzinti' }, { word: 'Čiupas', hint: 'geras' },
    { word: 'Viščiukas', hint: 'bailys' }, { word: 'Nusibodo', hint: 'atsibodo' },
    { word: 'Susimesti', hint: 'pinigai' }, { word: 'Nutekinti', hint: 'pasprukti' },
    { word: 'Šokoladas', hint: 'lengva' }, { word: 'Kelti karštį', hint: 'pykdyti' },
    { word: 'Pamauti', hint: 'apgauti' }, { word: 'Kibti', hint: 'lipti' },
    { word: 'Lygintuvas', hint: 'tingus' }, { word: 'Briedis', hint: 'nesąmonė' },
    { word: 'Pasiutusi', hint: 'labai geras' }, { word: 'Traiškyti', hint: 'mušti' },
    { word: 'Pliusas', hint: 'gerai' }, { word: 'Minusas', hint: 'blogai' },
    { word: 'Pagauti bangas', hint: 'džiaugtis' }, { word: 'Nuleisti', hint: 'atsipalaiduoti' },
    { word: 'Dūšia', hint: 'geras žmogus' }, { word: 'Skrebas', hint: 'niekas' },
  ],
  'Profesijos': [
    { word: 'Gydytojas', hint: 'medicina' }, { word: 'Inžinierius', hint: 'statybos' }, { word: 'Šefas', hint: 'virtuvė' }, { word: 'Mokytojas', hint: 'išsilavinimas' },
    { word: 'Advokatas', hint: 'teisė' }, { word: 'Medicinos sesuo', hint: 'ligoninė' }, { word: 'Pilotas', hint: 'skridimas' }, { word: 'Architektas', hint: 'dizainas' },
    { word: 'Buhalteris', hint: 'finansai' }, { word: 'Automechanikas', hint: 'automobiliai' }, { word: 'Elektrikas', hint: 'laidai' }, { word: 'Instaliacininkas', hint: 'vamzdžiai' },
    { word: 'Staliaus', hint: 'medis' }, { word: 'Chirurgas', hint: 'operacija' }, { word: 'Dantistas', hint: 'dantys' }, { word: 'Psichologas', hint: 'protas' },
    { word: 'Programuotojas', hint: 'kodas' }, { word: 'Dizaineris', hint: 'menas' }, { word: 'Vadovas', hint: 'lyderystė' }, { word: 'Konsultantas', hint: 'patarimas' },
    { word: 'Gaisrininkas', hint: 'gaisras' }, { word: 'Policininkas', hint: 'įstatymas' }, { word: 'Veterinaras', hint: 'gyvūnai' }, { word: 'Farmacininkas', hint: 'vaistai' },
    { word: 'Barberis', hint: 'plaukų kirpimas' }, { word: 'Kirpėja', hint: 'šukavimas' }, { word: 'Nekilnojamo turto agentas', hint: 'namai' }, { word: 'Bankininkre', hint: 'pinigai' },
    { word: 'Žurnalistas', hint: 'naujienos' }, { word: 'Fotografas', hint: 'nuotraukos' }, { word: 'Menininkas', hint: 'piešimas' }, { word: 'Muzikantas', hint: 'instrumentai' },
    { word: 'Aktorius', hint: 'teatro' }, { word: 'Sportininkas', hint: 'sportas' }, { word: 'Treneris', hint: 'mokymas' }, { word: 'Restoran šefas', hint: 'maistas' },
    { word: 'Padavėjas', hint: 'tarnavimas' }, { word: 'Barmeno', hint: 'gėrimai' }, { word: 'Ūkininkas', hint: 'ūkis' }, { word: 'Jūreivis', hint: 'jūra' },
    { word: 'Astronautas', hint: 'kosmosas' }, { word: 'Mokslininkas', hint: 'tyrimas' }, { word: 'Valytoja', hint: 'švarumas' }, { word: 'Saugumo sargybinis', hint: 'apsauga' },
    { word: 'Gelbėtoja', hint: 'plaukimas' }, { word: 'Žiedų pardavėja', hint: 'gėlės' }, { word: 'Kepėja', hint: 'duona' }, { word: 'Mėsininkas', hint: 'mėsa' },
  ],
  'Gen Z': [
    { word: 'Rizz', hint: 'šarmas' }, { word: 'Žvaigždžia', hint: 'išsiskirti' }, { word: 'Tikrai', hint: 'tiesa' }, { word: 'Nuostabi', hint: 'gražu' },
    { word: 'Vauu', hint: 'šaunu' }, { word: 'Slapčiau', hint: 'slaptai' }, { word: 'Aiškiai', hint: 'akivaizdžiai' }, { word: 'Žodžiui', hint: 'sutikti' },
    { word: 'Keistas', hint: 'įtartinas' }, { word: 'Nuotaikos čekis', hint: 'emocijos' }, { word: 'Jokių šansų', hint: 'atmesti' }, { word: 'Skiriasi' }, { word: 'Speciali' },
    { word: 'Baigta', hint: 'galas' }, { word: 'Žinia', hint: 'tvirtinimas' }, { word: 'Pikta', hint: 'nusivylimas' }, { word: 'Pasimetimas', hint: 'dingimas' },
    { word: 'Netikra', hint: 'apgaulė' }, { word: 'Alkana', hint: 'desperacija' }, { word: 'Karališkiausias', hint: 'geriausias' }, { word: 'Pasigyrimas', hint: 'gira' },
    { word: 'Pikta', hint: 'nusivylimas' }, { word: 'Remti', hint: 'palaikymas' }, { word: 'TIKROVA', hint: 'tiesa' }, { word: 'Gerai padaryta', hint: 'sėkmė' },
    { word: 'Suprato pasiūlymą', hint: 'atlikta' }, { word: 'Tai jiems šneka', hint: 'vibracijos' }, { word: 'Senus mados', hint: 'pasenimas' }, { word: 'Nuplėšta', hint: 'laime' },
    { word: 'Tada ne', hint: 'atmesti' }, { word: 'Nuostabu dainu', hint: 'geras' }, { word: 'Vidutinis', hint: 'vidutinis' }, { word: 'Šlaičioja', hint: 'trendi' },
    { word: 'Absurdas', hint: 'kvailas' }, { word: 'Sigma', hint: 'nepriklausomas' }, { word: 'Pasiima mokestį', hint: 'pavogti' }, { word: 'Bepročiai', hint: 'sumišę' },
    { word: 'Virimas', hint: 'piktas' }, { word: 'Remtas', hint: 'autentiškas' }, { word: 'Gėdintis', hint: 'nemalonu' }, { word: 'Pikta', hint: 'piktas' },
    { word: 'Vibracijos', hint: 'pojūtis' }, { word: 'Šalti', hint: 'atsipalaidoti' }, { word: 'Nuotaika', hint: 'susijieti' }, { word: 'Oi', hint: 'jėzaa' },
  ],
  'Suaugusiųjų Vakarėlis': [
    { word: 'Pagirios', hint: 'rytas po' }, { word: 'Karaokė', hint: 'dainai' }, { word: 'Taurai', hint: 'gėrimas' }, { word: 'Pingpongo stalo žaidimas', hint: 'žaidimas' },
    { word: 'Tekila', hint: 'agava' }, { word: 'Vodka', hint: 'rusa' }, { word: 'Viskis', hint: 'išlaida' }, { word: 'Kegs nusilenkimas', hint: 'triukas' },
    { word: 'Girtas skambutis', hint: 'skambutis' }, { word: 'Taksi', hint: 'važiavimas namo' }, { word: 'Išmetėjas', hint: 'saugumas' }, { word: 'ID patikri', hint: 'amžius' },
    { word: 'DJ', hint: 'muzika' }, { word: 'Šokių grindys', hint: 'judėjimas' }, { word: 'Beždžionės bėgimas' }, { word: 'Kokteilių', hint: 'gėrimas' },
    { word: 'Butelių paslauga', hint: 'brangiai' }, { word: 'Naktinis klubas', hint: 'šokimas' }, { word: 'Baro kėdė', hint: 'sėdimas' }, { word: 'Barno meistras', hint: 'tarnautojas' },
    { word: 'Jager bomba', hint: 'gėrimas' }, { word: 'Ping pongo stalas', hint: 'žaidimas' }, { word: 'Puodelio užsukirti', hint: 'lenktynės' }, { word: 'Taisyklių laužytojas', hint: 'linksmybės' },
    { word: 'Badimas', hint: 'alkanas' }, { word: 'Prišokimas', hint: 'prieš' }, { word: 'Po vakarėlio', hint: 'vėliau' }, { word: 'Šiek tiek girtas', hint: 'gundų' },
    { word: 'Itin girtas', hint: 'išgirtas' }, { word: 'Nepamintis', hint: 'užmiršti' }, { word: 'Viskio taurai', hint: 'kaipin' }, { word: 'Alaus gėrimas', hint: 'pradžia' },
    { word: 'Dviveidiška', hint: 'apgaulė' }, { word: 'Šokimo judesi', hint: 'šokimas' }, { word: 'Šokimas arti', hint: 'šokimas' }, { word: 'Basas', hint: 'garsiai' },
    { word: 'Stroboskopo šviesos', hint: 'šviesimas' }, { word: 'Šampanas', hint: 'nuostabu' }, { word: 'Sekalai', hint: 'po šūvio' }, { word: 'Nukreipti nuo' }, { word: 'Bekalbėti' },
    { word: 'Komedijos šou', hint: 'pramoga' }, { word: 'Vakarėlio klaida', hint: 'priešlapys' }, { word: 'Baisus vakaras', hint: 'šėlstis' },
  ],
  'Filmų ir TV Personažai': [
    { word: 'Betmenas', hint: 'globėjas' }, { word: 'Supermenas', hint: 'kriptonianas' }, { word: 'Žmogus voras', hint: 'interneto' }, { word: 'Nuostabi moteris', hint: 'amazonė' },
    { word: 'Hermijon', hint: 'protingas' }, { word: 'Haris Poteris', hint: 'randas' }, { word: 'Ronas Vizslys', hint: 'draugas' }, { word: 'Frodo', hint: 'žiedas' },
    { word: 'Gandas', hint: 'burtininkas' }, { word: 'Daenerys', hint: 'drakonas' }, { word: 'Jonui Snieguota', hint: 'nėštusis' }, { word: 'Valteris Vaitas', hint: 'chemija' },
    { word: 'Džesis Pinkermenas', hint: 'kristalai' }, { word: 'Tonis Sopranas', hint: 'nusikaltimai' }, { word: 'Tiriojnas Lanisteras', hint: 'nykščias' }, { word: 'Aria Stark', hint: 'sąrašas' },
    { word: 'Lūkas Skaikvokeris', hint: 'jėga' }, { word: 'Dartas Veideris', hint: 'tamsa' }, { word: 'Čebiorkė Leia', hint: 'sukilimas' }, { word: 'Ioda', hint: 'išmintis' },
    { word: 'Terminiatorius', hint: 'robotas' }, { word: 'Robokopas', hint: 'kiborg' }, { word: 'Negailestingas', hint: 'naujasis' }, { word: 'Vilko žmogus', hint: 'gijimas' },
    { word: 'Geležies žmogus', hint: 'šarvai' }, { word: 'Amerikos kapitanas', hint: 'skydas' }, { word: 'Toras', hint: 'kūjis' }, { word: 'Milžinas', hint: 'piktas' },
    { word: 'Juoda našlė', hint: 'šnipas' }, { word: 'Tanosas', hint: 'titanas' }, { word: 'Juokadarys', hint: 'klionas' }, { word: 'Katė moteris', hint: 'žvaagė' },
    { word: 'Pingvinas', hint: 'priešininkas' }, { word: 'Uždegėjas', hint: 'pagalbininkes' }, { word: 'Išgandų šuva', hint: 'baimė' }, { word: 'Harlė Kvinas', hint: 'gerbėjas' },
    { word: 'Leksas Lutoris', hint: 'nupliko' }, { word: 'Daktaras Oktopusas', hint: 'kojos' }, { word: 'Žalias žabnas', hint: 'moliūga' }, { word: 'Nuodingas', hint: 'simbioto' },
    { word: 'Magnetis', hint: 'metalis' }, { word: 'Audra', hint: 'oras' }, { word: 'Profesorius X', hint: 'telepatija' }, { word: 'Mistikas', hint: 'persivaizdavimas' },
  ],
  'Fantazija ir Mitologija': [
    { word: 'Drakonas', hint: 'ugnis' }, { word: 'Feniksas', hint: 'atgimimas' }, { word: 'Inorogas', hint: 'magiškas' }, { word: 'Kentavras', hint: 'hibridinis' },
    { word: 'Pegasas', hint: 'sparnytas' }, { word: 'Kerberas', hint: 'šuo' }, { word: 'Minotauras', hint: 'labirintas' }, { word: 'Baziliskas', hint: 'gyvatė' },
    { word: 'Sfingė', hint: 'mįslė' }, { word: 'Hidra', hint: 'galvos' }, { word: 'Krakenas', hint: 'dantis' }, { word: 'Vilkacis', hint: 'mėnulis' },
    { word: 'Vampyras', hint: 'nemirčius' }, { word: 'Ragana', hint: 'žynybė' }, { word: 'Raganas', hint: 'žynybė' }, { word: 'Fėja', hint: 'maža' },
    { word: 'Elfas', hint: 'kyšiuši' }, { word: 'Jotūnas', hint: 'didžiulis' }, { word: 'Nykštukis', hint: 'trumpas' }, { word: 'Bezdžionė', hint: 'nepatikli' },
    { word: 'Urkas', hint: 'karys' }, { word: 'Trolius', hint: 'tiltas' }, { word: 'Demonas', hint: 'blogas' }, { word: 'Angelas', hint: 'dangus' },
    { word: 'Grifinas', hint: 'pusė paukščio' }, { word: 'Chimera', hint: 'daugybė' }, { word: 'Meduza', hint: 'vorai' }, { word: 'Gorgona', hint: 'petrifikacija' },
    { word: 'Škaičiujas', hint: 'šimtas rankų' }, { word: 'Sirenė', hint: 'daina' }, { word: 'Banšė', hint: 'klyksmas' }, { word: 'Leviatanis', hint: 'žvėrys' },
    { word: 'Hibridinis', hint: 'su keliomis galvomis' }, { word: 'Džinas', hint: 'pageidimas' }, { word: 'Kilopas', hint: 'viena akis' }, { word: 'Bigfūtą', hint: 'kojų' },
    { word: 'Jeti', hint: 'sniegas' }, { word: 'Nesė', hint: 'ežeras' }, { word: 'Čiupakabra', hint: 'koze suikdausys' }, { word: 'Motėlmentas', hint: 'sparnai' },
    { word: 'Golemas', hint: 'molis' }, { word: 'Gargulė', hint: 'akmuo' }, { word: 'Vilkakus šviesa', hint: 'šviesa' }, { word: 'Valkirija', hint: 'germanai' },
  ],
  'Garsios Dainos': [
    { word: 'Billie Jean', hint: 'ne mano' }, { word: 'Bohemiško Rapsodija', hint: 'opera' }, { word: 'Įsivaizduok', hint: 'lenono' }, { word: 'Vakar', hint: 'beatlai' },
    { word: 'Siaubo', hint: 'džeksonas' }, { word: 'Kaip Mergelė', hint: 'madonna' }, { word: 'Hotel Kalifornija', hint: 'ereliai' }, { word: 'Laiptai į dangų', hint: 'cepelinas' },
    { word: 'Kvėpuoja paauglies dvasia', hint: 'nirvana' }, { word: 'Vienas', hint: 'metallika' }, { word: 'Alelūja', hint: 'koenas' }, { word: 'Stebuklingasis sienas', hint: 'oasis' },
    { word: 'Saldi namų Alabama', hint: 'skinyrdas' }, { word: 'Sveikas Tamsa', hint: 'simonas' }, { word: 'Juodas', hint: 'perlas' }, { word: 'Patogiai Nebylus', hint: 'floydas' },
    { word: 'Svajau toliau', hint: 'aerosmitis' }, { word: 'Paranormic Androidas', hint: 'radiohead' }, { word: 'Nuodus', hint: 'britni' }, { word: 'Vieniai moterys', hint: 'beyonce' },
    { word: 'Blogas vaikinas', hint: 'eilišas' }, { word: 'Nublokavos švieus', hint: 'vikentas' }, { word: 'Senas gatvės kelias', hint: 'nasas' }, { word: 'Levitavimas', hint: 'dua' },
    { word: 'Uptown Funk', hint: 'bruno' }, { word: 'Gangsterio Rojus', hint: 'koolis' }, { word: 'Vaikas', hint: 'bibearis' }, { word: 'Skėtis', hint: 'riyana' },
    { word: 'Rimdama, šiurkščiai rolės', hint: 'adelė' }, { word: 'Kažkas panašaus į jus', hint: 'adelė' }, { word: 'Karalystė', hint: 'lordė' }, { word: 'Žibintuvėlis', hint: 'sia' },
    { word: 'Karštoji linija blingsą', hint: 'drėkas' }, { word: 'Klube', hint: 'penkiasdešimt' }, { word: 'Pametokite save', hint: 'eminemas' }, { word: 'Be manęs', hint: 'eminemas' },
    { word: 'Aukso kasyklininkas', hint: 'kanėta' }, { word: '22', hint: 'tailoras' }, { word: 'Pajudinkitę tai', hint: 'tailoras' }, { word: 'Bloga kraujo', hint: 'tailoras' },
    { word: 'Meilės istorija', hint: 'tailoras' }, { word: 'Blank Space', hint: 'tailoras' }, { word: 'Per daug', hint: 'tailoras' }, { word: 'Priešo herojus', hint: 'tailoras' },
  ],
};

const categoryNameTranslations = {
  'Everyday Objects': { lt: 'Kasdieniai daiktai', es: 'Objetos cotidianos', fr: 'Objets du quotidien', de: 'Alltagsgegenstände', pl: 'Codzienne przedmioty', pt: 'Objetos do cotidiano', it: 'Oggetti quotidiani', nl: 'Alledaagse voorwerpen', ro: 'Obiecte de zi cu zi' },
  'Famous People':   { lt: 'Žymūs žmonės', es: 'Personas famosas', fr: 'Personnes célèbres', de: 'Berühmte Persönlichkeiten', pl: 'Sławne osoby', pt: 'Pessoas famosas', it: 'Personaggi famosi', nl: 'Beroemde mensen', ro: 'Persoane celebre' },
  'Animals':         { lt: 'Gyvūnai', es: 'Animales', fr: 'Animaux', de: 'Tiere', pl: 'Zwierzęta', pt: 'Animais', it: 'Animali', nl: 'Dieren', ro: 'Animale' },
  'Irish Slang':     { lt: 'Airių Slangas' },
};

const localSlangByLang = {
  es: {
    'Argot Español': [
      { word: 'Guay', hint: 'genial' }, { word: 'Tío', hint: 'amigo' },
      { word: 'Mola', hint: 'gusta' }, { word: 'Chulo', hint: 'guapo' },
      { word: 'Flipar', hint: 'sorpresa' }, { word: 'Chaval', hint: 'joven' },
      { word: 'Mazo', hint: 'mucho' }, { word: 'Pasta', hint: 'dinero' },
      { word: 'Currar', hint: 'trabajar' }, { word: 'Pillar', hint: 'agarrar' },
      { word: 'Pijo', hint: 'rico' }, { word: 'Coña', hint: 'broma' },
      { word: 'Chévere', hint: 'genial' }, { word: 'Fome', hint: 'aburrido' },
      { word: 'Pibe', hint: 'joven' }, { word: 'Caña', hint: 'cerveza' },
      { word: 'Enrollarse', hint: 'beso' }, { word: 'Joder', hint: 'maldición' },
      { word: 'Mogollón', hint: 'montón' }, { word: 'Chetado', hint: 'roto' },
      { word: 'Listo', hint: 'inteligente' }, { word: 'Guiri', hint: 'extranjero' },
      { word: 'Tronco', hint: 'amigo' }, { word: 'Pasarse', hint: 'exagerar' },
      { word: 'Molar', hint: 'gustar' }, { word: 'Bocazas', hint: 'chismoso' },
      { word: 'Cantamañanas', hint: 'mentiroso' }, { word: 'Liarse', hint: 'confundirse' },
      { word: 'Petarlo', hint: 'triunfar' }, { word: 'Estar pedo', hint: 'borracho' },
    ],
  },
  fr: {
    'Argot Français': [
      { word: 'Kiffer', hint: 'aimer' }, { word: 'Ouf', hint: 'fou' },
      { word: 'Chelou', hint: 'bizarre' }, { word: 'Zarbi', hint: 'étrange' },
      { word: 'Meuf', hint: 'femme' }, { word: 'Mec', hint: 'homme' },
      { word: 'Boloss', hint: 'nul' }, { word: 'Fric', hint: 'argent' },
      { word: 'Bouffer', hint: 'manger' }, { word: 'Flemme', hint: 'paresse' },
      { word: 'Galère', hint: 'problème' }, { word: 'Relou', hint: 'ennuyeux' },
      { word: 'Boulot', hint: 'travail' }, { word: 'Pote', hint: 'ami' },
      { word: 'Canon', hint: 'beau' }, { word: 'Chiller', hint: 'relaxer' },
      { word: 'Balèze', hint: 'fort' }, { word: 'Truc', hint: 'chose' },
      { word: 'Péter les plombs', hint: 'énerver' }, { word: 'Claquer', hint: 'dépenser' },
      { word: 'Bosser', hint: 'travailler' }, { word: 'Baraque', hint: 'grand' },
      { word: 'Céfran', hint: 'français' }, { word: 'Vachement', hint: 'très' },
      { word: 'Niquer', hint: 'détruire' }, { word: 'Tchatche', hint: 'parler' },
      { word: 'Beauf', hint: 'vulgaire' }, { word: 'Graille', hint: 'nourriture' },
      { word: 'Plouc', hint: 'provincial' }, { word: 'Se casser', hint: 'partir' },
    ],
  },
  de: {
    'Deutscher Slang': [
      { word: 'Geil', hint: 'toll' }, { word: 'Alter', hint: 'freund' },
      { word: 'Krass', hint: 'extrem' }, { word: 'Chillen', hint: 'entspannen' },
      { word: 'Digga', hint: 'kumpel' }, { word: 'Mies', hint: 'schlecht' },
      { word: 'Babo', hint: 'chef' }, { word: 'Opfer', hint: 'verlierer' },
      { word: 'Läuft', hint: 'gut' }, { word: 'Cringe', hint: 'peinlich' },
      { word: 'Alder', hint: 'freund' }, { word: 'Abgehen', hint: 'wild' },
      { word: 'Ballern', hint: 'feiern' }, { word: 'Penner', hint: 'obdachlos' },
      { word: 'Schräg', hint: 'seltsam' }, { word: 'Assi', hint: 'sozial' },
      { word: 'Schnitte', hint: 'mädchen' }, { word: 'Hackfressen', hint: 'gesicht' },
      { word: 'Lästermaul', hint: 'tratsch' }, { word: 'Abzocke', hint: 'betrug' },
      { word: 'Bratan', hint: 'bruder' }, { word: 'Versaut', hint: 'kaputt' },
      { word: 'Durchdrehen', hint: 'verrückt' }, { word: 'Abhauen', hint: 'weggehen' },
      { word: 'Vollpfosten', hint: 'dummkopf' }, { word: 'Klasse', hint: 'super' },
      { word: 'Spitze', hint: 'toll' }, { word: 'Affig', hint: 'albern' },
      { word: 'Scheiß drauf', hint: 'egal' }, { word: 'Durchmarsch', hint: 'sieg' },
    ],
  },
  pl: {
    'Polski Slang': [
      { word: 'Spoko', hint: 'okej' }, { word: 'Luz', hint: 'spokój' },
      { word: 'Ziomek', hint: 'przyjaciel' }, { word: 'Git', hint: 'dobrze' },
      { word: 'Ogień', hint: 'super' }, { word: 'Beka', hint: 'śmiech' },
      { word: 'Jazda', hint: 'ruszamy' }, { word: 'Masakra', hint: 'katastrofa' },
      { word: 'Odlot', hint: 'świetny' }, { word: 'Elo', hint: 'cześć' },
      { word: 'Kumać', hint: 'rozumieć' }, { word: 'Dno', hint: 'zły' },
      { word: 'Imprezka', hint: 'zabawa' }, { word: 'Mordo', hint: 'twarz' },
      { word: 'Słabo', hint: 'kiepsko' }, { word: 'Paka', hint: 'paczka' },
      { word: 'Nara', hint: 'do widzenia' }, { word: 'Hajs', hint: 'pieniądze' },
      { word: 'Seba', hint: 'koleś' }, { word: 'Zajarać się', hint: 'zainteresowanie' },
      { word: 'Kox', hint: 'świetny' }, { word: 'Odpalić', hint: 'zacząć' },
      { word: 'Wypas', hint: 'luksus' }, { word: 'Łapa', hint: 'ręka' },
      { word: 'Palma', hint: 'głupi' }, { word: 'Ciachać', hint: 'iść' },
      { word: 'Fura', hint: 'samochód' }, { word: 'Petla', hint: 'problem' },
      { word: 'Ryj', hint: 'twarz' }, { word: 'Zmykać', hint: 'uciekać' },
    ],
  },
  pt: {
    'Gíria Brasileira': [
      { word: 'Cara', hint: 'pessoa' }, { word: 'Mano', hint: 'irmão' },
      { word: 'Legal', hint: 'bom' }, { word: 'Show', hint: 'ótimo' },
      { word: 'Véi', hint: 'amigo' }, { word: 'Trampo', hint: 'trabalho' },
      { word: 'Rolar', hint: 'acontecer' }, { word: 'Vacilão', hint: 'tolo' },
      { word: 'Sinistro', hint: 'incrível' }, { word: 'Firmeza', hint: 'bom' },
      { word: 'Fodão', hint: 'incrível' }, { word: 'Balada', hint: 'festa' },
      { word: 'Pegar', hint: 'beijar' }, { word: 'Gato', hint: 'bonito' },
      { word: 'Bicho', hint: 'amigo' }, { word: 'Sossego', hint: 'paz' },
      { word: 'Mó', hint: 'muito' }, { word: 'Irado', hint: 'incrível' },
      { word: 'Saudade', hint: 'falta' }, { word: 'Baratear', hint: 'estranhar' },
      { word: 'Zoar', hint: 'brincar' }, { word: 'Maluco', hint: 'louco' },
      { word: 'Caminhão', hint: 'grande' }, { word: 'Tá ligado', hint: 'entendeu' },
      { word: 'Maneiro', hint: 'legal' }, { word: 'Dar o fora', hint: 'sair' },
      { word: 'Foda', hint: 'difícil' }, { word: 'Bagunça', hint: 'desordem' },
      { word: 'Tirar sarro', hint: 'zoar' }, { word: 'Pagar mico', hint: 'vergonha' },
    ],
  },
  it: {
    'Slang Italiano': [
      { word: 'Figo', hint: 'bello' }, { word: 'Roba', hint: 'cosa' },
      { word: 'Ganzo', hint: 'bravo' }, { word: 'Scemo', hint: 'stupido' },
      { word: 'Matto', hint: 'pazzo' }, { word: 'Sfigato', hint: 'perdente' },
      { word: 'Sballo', hint: 'divertimento' }, { word: 'Tamarro', hint: 'volgare' },
      { word: 'Fichissimo', hint: 'fantastico' }, { word: 'Spaccare', hint: 'dominare' },
      { word: 'Sgamato', hint: 'scoperto' }, { word: 'Stronzata', hint: 'stupidaggine' },
      { word: 'Ammazzare', hint: 'sorpresa' }, { word: 'Bello', hint: 'amico' },
      { word: 'Coglione', hint: 'stupido' }, { word: 'Bischero', hint: 'sciocco' },
      { word: 'Prendere in giro', hint: 'burla' }, { word: 'Fare il figo', hint: 'posare' },
      { word: 'Andare forte', hint: 'successo' }, { word: 'Rincoglionito', hint: 'confuso' },
      { word: 'Fico', hint: 'bello' }, { word: 'Boh', hint: 'non so' },
      { word: 'Dai', hint: 'andiamo' }, { word: 'Mannaggia', hint: 'accidenti' },
      { word: 'Cazzo', hint: 'sorpresa' }, { word: 'Cavolo', hint: 'accidenti' },
      { word: 'Sgobbone', hint: 'studioso' }, { word: 'Troia', hint: 'insulto' },
      { word: 'Culo', hint: 'fortuna' }, { word: 'Rompere le scatole', hint: 'disturbare' },
    ],
  },
  nl: {
    'Nederlandse Slang': [
      { word: 'Vet', hint: 'gaaf' }, { word: 'Gaaf', hint: 'cool' },
      { word: 'Lekker', hint: 'fijn' }, { word: 'Sick', hint: 'geweldig' },
      { word: 'Klote', hint: 'slecht' }, { word: 'Gozer', hint: 'man' },
      { word: 'Tof', hint: 'fijn' }, { word: 'Chillen', hint: 'ontspannen' },
      { word: 'Balen', hint: 'teleurstelling' }, { word: 'Moppie', hint: 'meisje' },
      { word: 'Kut', hint: 'slecht' }, { word: 'Ouwe', hint: 'man' },
      { word: 'Stront', hint: 'rommel' }, { word: 'Nerd', hint: 'slim' },
      { word: 'Kapper', hint: 'goed' }, { word: 'Hufter', hint: 'vervelend' },
      { word: 'Lullen', hint: 'praten' }, { word: 'Ophouden', hint: 'stoppen' },
      { word: 'Grappig', hint: 'humor' }, { word: 'Afknapper', hint: 'tegenvaller' },
      { word: 'Gestoord', hint: 'gek' }, { word: 'Brutaal', hint: 'brutaal' },
      { word: 'Drempel', hint: 'probleem' }, { word: 'Aanpakken', hint: 'doen' },
      { word: 'Pokkeweer', hint: 'slecht weer' }, { word: 'Loser', hint: 'verliezer' },
      { word: 'Janken', hint: 'huilen' }, { word: 'Zwansen', hint: 'gek doen' },
      { word: 'Mafkees', hint: 'rare man' }, { word: 'Bek houden', hint: 'stil zijn' },
    ],
  },
  ro: {
    'Argou Românesc': [
      { word: 'Mișto', hint: 'bun' }, { word: 'Fain', hint: 'bun' },
      { word: 'Nasol', hint: 'rău' }, { word: 'Nașpa', hint: 'rău' },
      { word: 'Boss', hint: 'șef' }, { word: 'Bă', hint: 'hey' },
      { word: 'Fraier', hint: 'prost' }, { word: 'Marfă', hint: 'bun' },
      { word: 'Tare', hint: 'puternic' }, { word: 'Hai', hint: 'vino' },
      { word: 'Șmecherie', hint: 'truc' }, { word: 'Gagică', hint: 'fată' },
      { word: 'Dubios', hint: 'suspect' }, { word: 'Sictir', hint: 'pleacă' },
      { word: 'Bulă', hint: 'glumă' }, { word: 'Dă-i drumul', hint: 'începe' },
      { word: 'A da în bară', hint: 'greșeală' }, { word: 'Mă-sa', hint: 'injurătură' },
      { word: 'Pirat', hint: 'hoț' }, { word: 'Puștan', hint: 'copil' },
      { word: 'Băiat bun', hint: 'prieten' }, { word: 'Sclifosit', hint: 'prețios' },
      { word: 'Muie', hint: 'înfrângere' }, { word: 'Baftă', hint: 'noroc' },
      { word: 'Leșinat', hint: 'obosit' }, { word: 'Moca', hint: 'gratis' },
      { word: 'Câcat', hint: 'rău' }, { word: 'Prinde', hint: 'înțelege' },
      { word: 'Dobitoc', hint: 'prost' }, { word: 'Fițe', hint: 'capricii' },
    ],
  },
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
    clueAssistSub: 'Spy gets a secret hint',
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
    freeCategories: 'FREE CATEGORIES',
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
    voteCategories: '🗳️ VOTE FOR CATEGORIES',
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
    freeCategories: 'NEMOKAMOS KATEGORIJOS',
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
    voteCategories: '🗳️ BALSUOTI UŽ KATEGORIJAS',
  },
  es: {
    title: 'CREAR SALA',
    players: 'JUGADORES',
    addPlayer: 'Añadir jugador',
    playerPlaceholder: 'Escribe el nombre...',
    category: 'CATEGORÍA',
    random: 'Aleatoria',
    hiddenRoles: 'NÚMERO DE ESPÍAS',
    clueAssist: 'AYUDA DE PISTAS',
    clueAssistSub: 'El espía obtiene una pista secreta',
    assistOn: 'Activada',
    assistOff: 'Desactivada',
    chaosRound: 'RONDA CAOS',
    chaosRoundSub: 'Posibilidad de que todos sean espías',
    chaosOn: 'Activada',
    chaosOff: 'Desactivada',
    timeLimit: 'LÍMITE DE TIEMPO',
    timeLimitSub: '15s por persona',
    timeOn: 'Activado',
    timeOff: 'Desactivado',
    startGame: 'INICIAR JUEGO',
    back: 'ATRÁS',
    minPlayers: '¡Se necesitan al menos 3 jugadores!',
    noName: 'Por favor ingresa un nombre',
    duplicateName: '¡El nombre ya existe!',
    freeCategories: 'CATEGORÍAS GRATIS',
    premiumCategories: '💰 PREMIUM',
    unlockPremium: 'Desbloquear Premium',
    premiumTitle: 'Desbloquear categorías Premium',
    premiumDesc: '¡Accede a más de 300 palabras en 6 categorías exclusivas!',
    premiumFeatures: '• Profesiones\n• Modo Gen Z\n• Fiesta Adultos\n• Personajes de Cine y TV\n• Fantasía y Mitología\n• Canciones Famosas',
    unlockPrice: 'Desbloquear por $4.99',
    maybeLater: 'Quizás después',
    needMorePlayers: (n) => `Añade ${n} jugador${n === 1 ? '' : 'es'} más para empezar.`,
    maxPlayers: 'Máx. 12 jugadores',
    gameModes: 'MODOS DE JUEGO',
    voteCategories: '🗳️ VOTAR POR CATEGORÍAS',
  },
  fr: {
    title: 'CRÉER UNE SALLE',
    players: 'JOUEURS',
    addPlayer: 'Ajouter un joueur',
    playerPlaceholder: 'Entrez un nom...',
    category: 'CATÉGORIE',
    random: 'Aléatoire',
    hiddenRoles: 'NOMBRE D\'ESPIONS',
    clueAssist: 'AIDE AUX INDICES',
    clueAssistSub: 'L\'espion reçoit un indice secret',
    assistOn: 'Activé',
    assistOff: 'Désactivé',
    chaosRound: 'ROUND CHAOS',
    chaosRoundSub: 'Possibilité que tous soient espions',
    chaosOn: 'Activé',
    chaosOff: 'Désactivé',
    timeLimit: 'LIMITE DE TEMPS',
    timeLimitSub: '15s par personne',
    timeOn: 'Activé',
    timeOff: 'Désactivé',
    startGame: 'DÉMARRER LE JEU',
    back: 'RETOUR',
    minPlayers: 'Il faut au moins 3 joueurs !',
    noName: 'Veuillez entrer un nom',
    duplicateName: 'Ce nom existe déjà !',
    freeCategories: 'CATÉGORIES GRATUITES',
    premiumCategories: '💰 PREMIUM',
    unlockPremium: 'Débloquer Premium',
    premiumTitle: 'Débloquer les catégories Premium',
    premiumDesc: 'Accédez à plus de 300 mots dans 6 catégories exclusives !',
    premiumFeatures: '• Professions\n• Mode Gen Z\n• Soirée Adultes\n• Personnages Films & TV\n• Fantaisie & Mythologie\n• Chansons Célèbres',
    unlockPrice: 'Débloquer pour 4,99 $',
    maybeLater: 'Peut-être plus tard',
    needMorePlayers: (n) => `Ajoutez ${n} joueur${n === 1 ? '' : 's'} pour commencer.`,
    maxPlayers: 'Max. 12 joueurs',
    gameModes: 'MODES DE JEU',
    voteCategories: '🗳️ VOTER POUR DES CATÉGORIES',
  },
  de: {
    title: 'RAUM ERSTELLEN',
    players: 'SPIELER',
    addPlayer: 'Spieler hinzufügen',
    playerPlaceholder: 'Name eingeben...',
    category: 'KATEGORIE',
    random: 'Zufällig',
    hiddenRoles: 'ANZAHL DER SPIONE',
    clueAssist: 'HINWEIS-HILFE',
    clueAssistSub: 'Der Spion erhält einen geheimen Hinweis',
    assistOn: 'An',
    assistOff: 'Aus',
    chaosRound: 'CHAOS-RUNDE',
    chaosRoundSub: 'Chance, dass alle Spieler Spione werden',
    chaosOn: 'An',
    chaosOff: 'Aus',
    timeLimit: 'ZEITLIMIT',
    timeLimitSub: '15s pro Person',
    timeOn: 'An',
    timeOff: 'Aus',
    startGame: 'SPIEL STARTEN',
    back: 'ZURÜCK',
    minPlayers: 'Mindestens 3 Spieler benötigt!',
    noName: 'Bitte einen Namen eingeben',
    duplicateName: 'Name existiert bereits!',
    freeCategories: 'KOSTENLOSE KATEGORIEN',
    premiumCategories: '💰 PREMIUM',
    unlockPremium: 'Premium freischalten',
    premiumTitle: 'Premium-Kategorien freischalten',
    premiumDesc: 'Erhalte Zugang zu 300+ Wörtern in 6 exklusiven Kategorien!',
    premiumFeatures: '• Berufe\n• Gen Z Modus\n• Erwachsenenparty\n• Film- & TV-Charaktere\n• Fantasy & Mythologie\n• Berühmte Songs',
    unlockPrice: 'Freischalten für $4,99',
    maybeLater: 'Vielleicht später',
    needMorePlayers: (n) => `Füge noch ${n} Spieler${n === 1 ? '' : ''} hinzu.`,
    maxPlayers: 'Max. 12 Spieler',
    gameModes: 'SPIELMODI',
    voteCategories: '🗳️ FÜR KATEGORIEN ABSTIMMEN',
  },
  pl: {
    title: 'UTWÓRZ POKÓJ',
    players: 'GRACZE',
    addPlayer: 'Dodaj gracza',
    playerPlaceholder: 'Wpisz imię...',
    category: 'KATEGORIA',
    random: 'Losowa',
    hiddenRoles: 'LICZBA SZPIEGÓW',
    clueAssist: 'POMOC W WSKAZÓWKACH',
    clueAssistSub: 'Szpieg otrzymuje tajną wskazówkę',
    assistOn: 'Włączona',
    assistOff: 'Wyłączona',
    chaosRound: 'RUNDA CHAOSU',
    chaosRoundSub: 'Szansa, że wszyscy gracze zostaną szpiegami',
    chaosOn: 'Włączona',
    chaosOff: 'Wyłączona',
    timeLimit: 'LIMIT CZASU',
    timeLimitSub: '15s na osobę',
    timeOn: 'Włączony',
    timeOff: 'Wyłączony',
    startGame: 'ROZPOCZNIJ GRĘ',
    back: 'WRÓĆ',
    minPlayers: 'Potrzeba co najmniej 3 graczy!',
    noName: 'Proszę wpisać imię',
    duplicateName: 'To imię już istnieje!',
    freeCategories: 'DARMOWE KATEGORIE',
    premiumCategories: '💰 PREMIUM',
    unlockPremium: 'Odblokuj Premium',
    premiumTitle: 'Odblokuj kategorie Premium',
    premiumDesc: 'Uzyskaj dostęp do 300+ słów w 6 ekskluzywnych kategoriach!',
    premiumFeatures: '• Zawody\n• Tryb Gen Z\n• Impreza dla Dorosłych\n• Postacie Filmowe i TV\n• Fantasy i Mitologia\n• Znane Piosenki',
    unlockPrice: 'Odblokuj za $4.99',
    maybeLater: 'Może później',
    needMorePlayers: (n) => `Dodaj jeszcze ${n} graczy, aby zacząć.`,
    maxPlayers: 'Maks. 12 graczy',
    gameModes: 'TRYBY GRY',
    voteCategories: '🗳️ GŁOSUJ NA KATEGORIE',
  },
  pt: {
    title: 'CRIAR SALA',
    players: 'JOGADORES',
    addPlayer: 'Adicionar jogador',
    playerPlaceholder: 'Digite o nome...',
    category: 'CATEGORIA',
    random: 'Aleatória',
    hiddenRoles: 'NÚMERO DE ESPIÕES',
    clueAssist: 'AJUDA DE PISTAS',
    clueAssistSub: 'O espião recebe uma dica secreta',
    assistOn: 'Ativada',
    assistOff: 'Desativada',
    chaosRound: 'RODADA CAOS',
    chaosRoundSub: 'Chance de todos serem espiões',
    chaosOn: 'Ativada',
    chaosOff: 'Desativada',
    timeLimit: 'LIMITE DE TEMPO',
    timeLimitSub: '15s por pessoa',
    timeOn: 'Ativado',
    timeOff: 'Desativado',
    startGame: 'INICIAR JOGO',
    back: 'VOLTAR',
    minPlayers: 'São necessários pelo menos 3 jogadores!',
    noName: 'Por favor insira um nome',
    duplicateName: 'Nome já existe!',
    freeCategories: 'CATEGORIAS GRÁTIS',
    premiumCategories: '💰 PREMIUM',
    unlockPremium: 'Desbloquear Premium',
    premiumTitle: 'Desbloquear categorias Premium',
    premiumDesc: 'Acesse mais de 300 palavras em 6 categorias exclusivas!',
    premiumFeatures: '• Profissões\n• Modo Gen Z\n• Festa Adultos\n• Personagens de Filmes e TV\n• Fantasia e Mitologia\n• Músicas Famosas',
    unlockPrice: 'Desbloquear por $4.99',
    maybeLater: 'Talvez depois',
    needMorePlayers: (n) => `Adicione mais ${n} jogador${n === 1 ? '' : 'es'} para começar.`,
    maxPlayers: 'Máx. 12 jogadores',
    gameModes: 'MODOS DE JOGO',
    voteCategories: '🗳️ VOTAR EM CATEGORIAS',
  },
  it: {
    title: 'CREA STANZA',
    players: 'GIOCATORI',
    addPlayer: 'Aggiungi giocatore',
    playerPlaceholder: 'Inserisci nome...',
    category: 'CATEGORIA',
    random: 'Casuale',
    hiddenRoles: 'NUMERO DI SPIE',
    clueAssist: 'AIUTO INDIZI',
    clueAssistSub: 'La spia riceve un indizio segreto',
    assistOn: 'Attivato',
    assistOff: 'Disattivato',
    chaosRound: 'ROUND CAOS',
    chaosRoundSub: 'Possibilità che tutti siano spie',
    chaosOn: 'Attivato',
    chaosOff: 'Disattivato',
    timeLimit: 'LIMITE DI TEMPO',
    timeLimitSub: '15s a persona',
    timeOn: 'Attivato',
    timeOff: 'Disattivato',
    startGame: 'INIZIA IL GIOCO',
    back: 'INDIETRO',
    minPlayers: 'Servono almeno 3 giocatori!',
    noName: 'Inserisci un nome',
    duplicateName: 'Il nome esiste già!',
    freeCategories: 'CATEGORIE GRATUITE',
    premiumCategories: '💰 PREMIUM',
    unlockPremium: 'Sblocca Premium',
    premiumTitle: 'Sblocca le categorie Premium',
    premiumDesc: 'Accedi a più di 300 parole in 6 categorie esclusive!',
    premiumFeatures: '• Professioni\n• Modalità Gen Z\n• Festa Adulti\n• Personaggi Film e TV\n• Fantasia e Mitologia\n• Canzoni Famose',
    unlockPrice: 'Sblocca per $4.99',
    maybeLater: 'Forse dopo',
    needMorePlayers: (n) => `Aggiungi altri ${n} giocator${n === 1 ? 'e' : 'i'} per iniziare.`,
    maxPlayers: 'Max. 12 giocatori',
    gameModes: 'MODALITÀ DI GIOCO',
    voteCategories: '🗳️ VOTA PER CATEGORIE',
  },
  nl: {
    title: 'KAMER AANMAKEN',
    players: 'SPELERS',
    addPlayer: 'Speler toevoegen',
    playerPlaceholder: 'Naam invoeren...',
    category: 'CATEGORIE',
    random: 'Willekeurig',
    hiddenRoles: 'AANTAL SPIONNEN',
    clueAssist: 'AANWIJZINGSHULP',
    clueAssistSub: 'De spion krijgt een geheime aanwijzing',
    assistOn: 'Aan',
    assistOff: 'Uit',
    chaosRound: 'CHAOSRONDE',
    chaosRoundSub: 'Kans dat alle spelers spionnen worden',
    chaosOn: 'Aan',
    chaosOff: 'Uit',
    timeLimit: 'TIJDSLIMIET',
    timeLimitSub: '15s per persoon',
    timeOn: 'Aan',
    timeOff: 'Uit',
    startGame: 'SPEL STARTEN',
    back: 'TERUG',
    minPlayers: 'Minimaal 3 spelers nodig!',
    noName: 'Vul een naam in',
    duplicateName: 'Naam bestaat al!',
    freeCategories: 'GRATIS CATEGORIEËN',
    premiumCategories: '💰 PREMIUM',
    unlockPremium: 'Premium ontgrendelen',
    premiumTitle: 'Premium-categorieën ontgrendelen',
    premiumDesc: 'Krijg toegang tot 300+ woorden in 6 exclusieve categorieën!',
    premiumFeatures: '• Beroepen\n• Gen Z-modus\n• Volwassenenfeest\n• Film- & TV-personages\n• Fantasy & Mythologie\n• Beroemde Nummers',
    unlockPrice: 'Ontgrendelen voor $4,99',
    maybeLater: 'Misschien later',
    needMorePlayers: (n) => `Voeg nog ${n} speler${n === 1 ? '' : 's'} toe om te starten.`,
    maxPlayers: 'Max. 12 spelers',
    gameModes: 'SPELMODI',
    voteCategories: '🗳️ STEM OP CATEGORIEËN',
  },
  ro: {
    title: 'CREEAZĂ CAMERĂ',
    players: 'JUCĂTORI',
    addPlayer: 'Adaugă jucător',
    playerPlaceholder: 'Introdu numele...',
    category: 'CATEGORIE',
    random: 'Aleatoriu',
    hiddenRoles: 'NUMĂR DE SPIONI',
    clueAssist: 'AJUTOR INDICII',
    clueAssistSub: 'Spionul primește un indiciu secret',
    assistOn: 'Activat',
    assistOff: 'Dezactivat',
    chaosRound: 'RUNDĂ HAOS',
    chaosRoundSub: 'Șansa ca toți să fie spioni',
    chaosOn: 'Activat',
    chaosOff: 'Dezactivat',
    timeLimit: 'LIMITĂ DE TIMP',
    timeLimitSub: '15s per persoană',
    timeOn: 'Activat',
    timeOff: 'Dezactivat',
    startGame: 'ÎNCEPE JOCUL',
    back: 'ÎNAPOI',
    minPlayers: 'Sunt necesari cel puțin 3 jucători!',
    noName: 'Vă rugăm să introduceți un nume',
    duplicateName: 'Numele există deja!',
    freeCategories: 'CATEGORII GRATUITE',
    premiumCategories: '💰 PREMIUM',
    unlockPremium: 'Deblochează Premium',
    premiumTitle: 'Deblochează categoriile Premium',
    premiumDesc: 'Accesează peste 300 de cuvinte în 6 categorii exclusive!',
    premiumFeatures: '• Profesii\n• Modul Gen Z\n• Petrecere Adulți\n• Personaje Film & TV\n• Fantasy & Mitologie\n• Cântece Celebre',
    unlockPrice: 'Deblochează pentru $4.99',
    maybeLater: 'Poate mai târziu',
    needMorePlayers: (n) => `Adaugă încă ${n} jucător${n === 1 ? '' : 'i'} pentru a începe.`,
    maxPlayers: 'Max. 12 jucători',
    gameModes: 'MODURI DE JOC',
    voteCategories: '🗳️ VOTEAZĂ PENTRU CATEGORII',
  },
};

/* -------------------- SCREEN -------------------- */
export default function CreateRoomScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const { isPremium, isLoading, error, purchasePremium, clearError } = usePremium();
  const lang = route.params?.language || 'en';
  const t = translations[lang];

  const baseFreeCategories = lang === 'lt' ? freeCategoriesLT : freeCategoriesEN;
  const freeCategories = lang === 'en'
    ? baseFreeCategories
    : Object.fromEntries(Object.entries(baseFreeCategories).filter(([k]) => k !== 'Irish Slang'));
  const basePremiumCategories = lang === 'lt' ? premiumCategoriesLT : premiumCategoriesEN;
  const premiumCategories = localSlangByLang[lang]
    ? { ...localSlangByLang[lang], ...basePremiumCategories }
    : basePremiumCategories;
  const getCategoryDisplayName = (cat) => {
    if (cat === 'Random' || cat === 'Atsitiktinė') return `🎲 ${t.random}`;
    return categoryNameTranslations[cat]?.[lang] || cat;
  };

  const MIN_PLAYERS = 3;
  const MAX_PLAYERS = 12;

  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(freeCategories)[0]);
  const [numImposters, setNumImposters] = useState(1);
  const [clueAssist, setClueAssist] = useState(false);
  const [chaosRound, setChaosRound] = useState(false);
  const [timeLimit, setTimeLimit] = useState(false);
  const [pressedButton, setPressedButton] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  const styles = getStyles(colors, isDarkMode);

  // Show weekly categories modal when screen opens
  useEffect(() => {
    const showPromotionalModal = async () => {
      try {
        if (!isPremium) {
          setTimeout(() => setShowWeeklyModal(true), 1000);
        }
      } catch (e) {
        console.warn('Error showing modal:', e);
      }
    };

    showPromotionalModal();
  }, [isPremium]);

  const remainingPlayers = Math.max(0, MIN_PLAYERS - players.length);
  const canStart = players.length >= MIN_PLAYERS;

  const normalizedPlayers = useMemo(
    () => players.map((p) => p.trim().toLowerCase()),
    [players]
  );

  const addPlayer = () => {
    const name = newPlayerName.trim();
    if (!name) { Alert.alert('Error', t.noName); return; }
    if (players.length >= MAX_PLAYERS) { Alert.alert('Error', t.maxPlayers); return; }
    if (normalizedPlayers.includes(name.toLowerCase())) { Alert.alert('Error', t.duplicateName); return; }
    setPlayers((prev) => [...prev, name]);
    setNewPlayerName('');
  };

  const removePlayer = (index) => setPlayers((prev) => prev.filter((_, i) => i !== index));

  const selectCategory = (cat, isPremiumCat = false) => {
    if (isPremiumCat && !isPremium) { setShowPremiumModal(true); return; }
    setSelectedCategory(cat);
  };

  const handlePurchasePremium = async () => {
    const result = await purchasePremium();
    if (result.success) {
      setShowPremiumModal(false);
      Alert.alert('Success', result.message);
    } else {
      Alert.alert('Purchase Failed', result.message);
    }
  };

  const handleWeeklyModalClose = () => {
    setShowWeeklyModal(false);
  };

  const handleWeeklyModalPurchase = async () => {
    const result = await purchasePremium();
    if (result.success) {
      setShowWeeklyModal(false);
    }
  };

  const handleWeeklyModalVote = () => {
    setShowWeeklyModal(false);
    navigation.navigate('VoteCategories', { language: lang });
  };

  const startGame = () => {
    if (!canStart) { Alert.alert('Error', t.needMorePlayers(remainingPlayers)); return; }

    const categoryData = freeCategories[selectedCategory] || premiumCategories[selectedCategory];
    const randomItem = categoryData[Math.floor(Math.random() * categoryData.length)];
    const secretWord = typeof randomItem === 'object' ? randomItem.word : randomItem;
    const hintWord = typeof randomItem === 'object' ? randomItem.hint : '';

    // ← Chaos Round: 30% chance all players become spies
    const triggerChaos = chaosRound && Math.random() < 0.30;
    const actualNumImposters = triggerChaos ? players.length : numImposters;

   const previousImposterIndices = route.params?.previousImposterIndices ?? [];
const eligible = players.map((_, i) => i).filter(i => !previousImposterIndices.includes(i));
const pool = eligible.length >= Math.min(actualNumImposters, players.length) ? eligible : players.map((_, i) => i);
const shuffled = [...pool].sort(() => Math.random() - 0.5);
const imposterIndices = shuffled.slice(0, Math.min(actualNumImposters, players.length));

    navigation.navigate('Game', {
      players,
      secretWord,
      hintWord,
      imposterIndices,
      previousImposterIndices: imposterIndices,
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
      {!isDarkMode && <LinearGradient colors={['#3EC9C1', '#1a7ac7']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none" />}
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? colors.background : '#3EC9C1'} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : colors.text} />
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
                  title={getCategoryDisplayName(cat)}
                  onPress={() => selectCategory(cat)}
                  activeOpacity={0.8}
                  style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                  textStyle={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Vote for Categories */}
        <TouchableOpacity
          style={styles.voteBtn}
          onPress={() => navigation.navigate('VoteCategories', { language: lang })}
          activeOpacity={0.8}
        >
          <Text style={styles.voteBtnNew}>NEW</Text>
          <Text style={styles.voteBtnText}>{t.voteCategories}</Text>
        </TouchableOpacity>

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
          textStyle={[styles.startButtonText, !canStart && { flex: 1, textAlign: 'center' }]}
          rightIcon={canStart ? <Ionicons name="play" size={20} color="#fff" /> : null}
        />
      </ScrollView>

      {/* Premium modal */}
      <Modal visible={showPremiumModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.premiumTitle}</Text>
            <Text style={styles.modalDesc}>{t.premiumDesc}</Text>
            <Text style={styles.modalFeatures}>{t.premiumFeatures}</Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.unlockPriceButton, isLoading && styles.buttonDisabled]}
              onPress={handlePurchasePremium}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.unlockPriceText}>{t.unlockPrice}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.maybeLaterButton}
              onPress={() => {
                setShowPremiumModal(false);
                clearError();
              }}
              disabled={isLoading}
            >
              <Text style={styles.maybeLaterText}>{t.maybeLater}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Weekly Categories Modal */}
      <WeeklyCategoriesModal
        visible={showWeeklyModal}
        onClose={handleWeeklyModalClose}
        onPurchase={handleWeeklyModalPurchase}
        onVote={handleWeeklyModalVote}
        isPremium={isPremium}
        language={lang}
      />
    </SafeAreaView>
  );
}

/* -------------------- STYLES -------------------- */
const getStyles = (colors, isDarkMode) => {
  const border = isDarkMode ? '#ffffff' : '#000000';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 20, paddingTop: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
    backButton: {
      width: 44, height: 44, borderRadius: 22, backgroundColor: isDarkMode ? colors.primary : colors.surface,
      justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: isDarkMode ? '#fff' : colors.text,
    },
    strongOutline: { borderWidth: 2, borderColor: border, backgroundColor: colors.surface },
    title: { fontSize: 23, fontFamily: 'Special_Elite_400Regular', color: isDarkMode ? '#fff' : '#000', letterSpacing: 3 },
    placeholder: { width: 44 },
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 14, fontFamily: 'Special_Elite_400Regular', color: isDarkMode ? '#ffffff' : '#000000', marginBottom: 14, letterSpacing: 3 },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    inputContainer: {
      flex: 1, borderWidth: 1, borderColor: isDarkMode ? '#444444' : '#cccccc',
      borderRadius: 14, backgroundColor: colors.surface, overflow: 'hidden',
    },
    input: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, fontSize: 16, color: isDarkMode ? '#ffffff' : '#000000' },
    addButton: {
      width: 52, height: 52, backgroundColor: colors.primary, borderRadius: 14,
      justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: border,
    },
    helperText: { marginTop: 10, color: isDarkMode ? '#aaaaaa' : colors.text, fontFamily: 'Special_Elite_400Regular', fontSize: 13 },
    helperTextOk: { marginTop: 10, color: isDarkMode ? '#9dffb3' : '#0a6b2d', fontFamily: 'Special_Elite_400Regular', fontSize: 13 },
    playersList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
    playerChip: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
      paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20,
      borderWidth: 1, borderColor: isDarkMode ? '#444444' : '#cccccc', gap: 10,
    },
    playerName: { color: isDarkMode ? '#ffffff' : '#000000', fontFamily: 'Special_Elite_400Regular', fontSize: 14 },
    voteBtn: {
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      marginBottom: 24, paddingVertical: 12, paddingHorizontal: 20,
      borderRadius: 12, borderWidth: 2,
      borderColor: isDarkMode ? '#ffffff55' : '#1d355766',
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(29,53,87,0.08)',
    },
    voteBtnNew: { fontSize: 10, fontFamily: 'Special_Elite_400Regular', color: colors.primary, letterSpacing: 3, marginBottom: 2 },
    voteBtnText: { fontSize: 13, fontFamily: 'Special_Elite_400Regular', color: isDarkMode ? '#fff' : '#1d3557', letterSpacing: 1 },
    categoryList: { gap: 8 },
    categoryChip: {
      backgroundColor: colors.surface, paddingVertical: 14, paddingHorizontal: 20,
      borderRadius: 14, borderWidth: 2, borderColor: border,
    },
    categoryChipActive: { backgroundColor: colors.primary, borderColor: border },
    categoryText: { color: isDarkMode ? '#ffffff' : '#000000', fontFamily: 'Special_Elite_400Regular', fontSize: 15 },
    categoryTextActive: { color: '#fff', fontFamily: 'Special_Elite_400Regular' },
    premiumHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    unlockButton: {
      backgroundColor: colors.accent, paddingVertical: 8, paddingHorizontal: 16,
      borderRadius: 20, borderWidth: 2, borderColor: border,
    },
    unlockButtonText: { color: isDarkMode ? '#000' : '#000', fontFamily: 'Special_Elite_400Regular', fontSize: 13 },
    premiumChip: { position: 'relative' },
    lockedChip: { borderWidth: 2, borderColor: isDarkMode ? colors.primary : '#000000', backgroundColor: 'transparent' },
    lockedText: { color: isDarkMode ? '#888888' : '#000', textShadowColor: 'rgba(180,0,0,0.35)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 4 },
    lockIcon: { position: 'absolute', right: 20, fontSize: 18 },
    counterContainer: { flexDirection: 'row', gap: 12 },
    counterButton: { flex: 1, backgroundColor: colors.surface, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
    counterButtonActive: {
      backgroundColor: colors.primary, borderWidth: 2, borderColor: border,
      shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    counterText: { color: isDarkMode ? '#ffffff' : '#000000', fontSize: 21, fontFamily: 'Special_Elite_400Regular' },
    counterTextActive: { color: '#fff' },
    toggleRow: { flexDirection: 'row', gap: 10 },
    toggleSquare: {
      flex: 1, backgroundColor: colors.surface, padding: 12, borderRadius: 14,
      alignItems: 'center', minHeight: 120, justifyContent: 'space-between',
    },
    toggleSquareActive: { borderWidth: 2, borderColor: border, backgroundColor: colors.primary + '15' },
    toggleSquareTitle: { color: isDarkMode ? '#ffffff' : '#000000', fontFamily: 'Special_Elite_400Regular', fontSize: 13, letterSpacing: 1, textAlign: 'center' },
    toggleSquareTitleActive: { color: isDarkMode ? '#fff' : '#000' },
    toggleSquareSubtitle: { color: isDarkMode ? '#aaaaaa' : colors.text, fontSize: 13, textAlign: 'center', marginTop: 4 },
    toggleSquareSubtitleActive: { color: isDarkMode ? '#fff' : '#000', opacity: 0.8 },
    toggleIndicator: {
      backgroundColor: isDarkMode ? '#333333' : colors.surfaceElevated, paddingVertical: 4, paddingHorizontal: 10,
      borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#555555' : colors.text,
    },
    toggleIndicatorActive: { backgroundColor: colors.primary, borderColor: border },
    toggleIndicatorText: { color: isDarkMode ? '#888888' : colors.text, fontFamily: 'Special_Elite_400Regular', fontSize: 12 },
    toggleIndicatorTextActive: { color: '#fff' },
    startButton: {
      backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      paddingVertical: 20, borderRadius: 16, marginTop: 10, gap: 12, borderWidth: 2, borderColor: border,
      shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
    },
    startButtonDisabled: { opacity: 0.45 },
    startButtonPressed: { transform: [{ scale: 0.97 }], shadowOpacity: 0.2 },
    startButtonText: { color: '#fff', fontSize: 18, fontFamily: 'Special_Elite_400Regular', letterSpacing: 2 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { backgroundColor: colors.surface, padding: 30, borderRadius: 20, width: '100%', maxWidth: 350, borderWidth: 2, borderColor: border },
    modalTitle: { fontSize: 20, fontFamily: 'Special_Elite_400Regular', color: isDarkMode ? '#fff' : '#000', marginBottom: 15, textAlign: 'center', letterSpacing: 2 },
    modalDesc: { fontSize: 14, color: isDarkMode ? '#ffffff' : '#000000', marginBottom: 15, textAlign: 'center', lineHeight: 20 },
    modalFeatures: { fontSize: 13, color: isDarkMode ? '#aaaaaa' : colors.text, marginBottom: 25, lineHeight: 22 },
    unlockPriceButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: border },
    unlockPriceText: { color: '#fff', fontSize: 16, fontFamily: 'Special_Elite_400Regular', letterSpacing: 2 },
    maybeLaterButton: { paddingVertical: 12, alignItems: 'center' },
    maybeLaterText: { color: isDarkMode ? '#888888' : colors.text, fontSize: 14, fontFamily: 'Special_Elite_400Regular' },
    errorContainer: { backgroundColor: '#ff1a1a' + '22', borderColor: '#ff1a1a', borderWidth: 1, borderRadius: 8, padding: 12, marginVertical: 12 },
    errorText: { color: '#ff1a1a', fontSize: 13, fontFamily: 'Special_Elite_400Regular', textAlign: 'center' },
    buttonDisabled: { opacity: 0.6 },
  });
};