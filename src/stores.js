import { writable, get } from 'svelte/store'

import coach from '$lib/music/coach ping pong.mp3'
import frigi from '$lib/images/frigi.png'

export const audioPlayer = writable();
export const status = writable('default');
export const isPlaying = writable(false);
export const index = writable(0);

export const trackList = writable([
    {
		img: frigi,
        title: 'Coach ping pong',
		artist: 'Test',
		file: coach
	},
	{
		img:"https://tailwindcss.com/_next/static/media/full-stack-radio.afb14e4e.png",
        title: 'Requiem in D minor, K. 626',
		artist: 'Wolfgang Amadeus Mozart',
		file: 'https://sveltejs.github.io/assets/music/mozart.mp3',
	},
	{
		img:"https://tailwindcss.com/_next/static/media/full-stack-radio.afb14e4e.png",
        title: 'Symphony no. 5 in Cm, Op. 67',
		artist: 'Ludwig van Beethoven',
		file: 'https://sveltejs.github.io/assets/music/beethoven.mp3'
	},

]);

export const addTrack = track => {
	trackList.update(v => [...v, track])
};