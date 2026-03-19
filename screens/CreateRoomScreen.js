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
  'Airių Slangas': [
    { word: 'Grand', hint: 'gerai' }, { word: 'Craic', hint: 'linksmybės' },
    { word: 'Gas', hint: 'juokinga' }, { word: 'Deadly', hint: 'puiku' },
    { word: 'Savage', hint: 'nuostabu' }, { word: 'Sound', hint: 'malonus' },
    { word: 'Yoke', hint: 'daiktas' }, { word: 'Eejit', hint: 'kvailys' },
  ],
};

const premiumCategoriesLT = {
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
  },
};

/* -------------------- SCREEN -------------------- */
export default function CreateRoomScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const { isPremium, isLoading, error, purchasePremium, clearError } = usePremium();
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
          setShowWeeklyModal(true);
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
    navigation.navigate('VoteCategories');
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
      />
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
      width: 44, height: 44, borderRadius: 22, backgroundColor: isDarkMode ? colors.primary : colors.surface,
      justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: isDarkMode ? '#fff' : colors.text,
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
    helperText: { marginTop: 10, color: isDarkMode ? '#aaaaaa' : colors.text, fontWeight: '600', fontSize: 15 },
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
    lockedChip: { borderWidth: 2, borderColor: isDarkMode ? colors.primary : '#000000', backgroundColor: 'transparent' },
    lockedText: { color: isDarkMode ? '#888888' : '#000', textShadowColor: 'rgba(180,0,0,0.35)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 4 },
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
    toggleSquareTitle: { color: isDarkMode ? '#ffffff' : '#000000', fontWeight: '800', fontSize: 14, letterSpacing: 1, textAlign: 'center' },
    toggleSquareTitleActive: { color: isDarkMode ? '#fff' : '#000' },
    toggleSquareSubtitle: { color: isDarkMode ? '#aaaaaa' : colors.text, fontSize: 13, textAlign: 'center', marginTop: 4 },
    toggleSquareSubtitleActive: { color: isDarkMode ? '#fff' : '#000', opacity: 0.8 },
    toggleIndicator: {
      backgroundColor: isDarkMode ? '#333333' : colors.surfaceElevated, paddingVertical: 4, paddingHorizontal: 10,
      borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#555555' : colors.text,
    },
    toggleIndicatorActive: { backgroundColor: colors.primary, borderColor: border },
    toggleIndicatorText: { color: isDarkMode ? '#888888' : colors.text, fontWeight: '700', fontSize: 12 },
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
    modalFeatures: { fontSize: 15, color: isDarkMode ? '#aaaaaa' : colors.text, marginBottom: 25, lineHeight: 22 },
    unlockPriceButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: border },
    unlockPriceText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
    maybeLaterButton: { paddingVertical: 12, alignItems: 'center' },
    maybeLaterText: { color: isDarkMode ? '#888888' : colors.text, fontSize: 16, fontWeight: '600' },
    errorContainer: { backgroundColor: '#ff1a1a' + '22', borderColor: '#ff1a1a', borderWidth: 1, borderRadius: 8, padding: 12, marginVertical: 12 },
    errorText: { color: '#ff1a1a', fontSize: 14, fontWeight: '600', textAlign: 'center' },
    buttonDisabled: { opacity: 0.6 },
  });
};