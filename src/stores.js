import { writable, get } from 'svelte/store'

import coach from '$lib/music/coach ping pong.mp3'
import frigi from '$lib/images/frigi.png'

import avengerMusic from '$lib/music/AVENGERS.mp3'
import avenger from '$lib/images/avenger.png'


import la_team_music from '$lib/music/LA TEAM.mp3'
import la_team from '$lib/images/lateam.png'


import la_guerre_music from '$lib/music/la guerre.mp3'
import la_guerre from '$lib/images/laguerre.png'




export const audioPlayer = writable();
export const status = writable('default');
export const isPlaying = writable(false);
export const showLyric = writable(false);
export const index = writable(0);

export const trackList = writable([
    
	/* {
		img: la_team,
        title: 'La team',
		artist: 'Test',
		file: la_team_music,
		lyric: la_team_lyric,
	},
	{
		img: frigi,
        title: 'Coach ping pong',
		artist: 'Test',
		file: coach,
	},
	{
		img: avenger,
        title: 'Avengers',
		artist: 'Test',
		file: avengerMusic,
	},

	{
		img: la_guerre,
        title: 'La guerre',
		artist: 'Frigi',
		file: la_guerre_music,
	}, */
	

]);

export const addTrack = track => {
	trackList.update(v => [...v, track])
};