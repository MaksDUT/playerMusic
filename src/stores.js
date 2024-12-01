import { writable, get } from 'svelte/store'

import coach from '$lib/music/coach ping pong.mp3'
import frigi from '$lib/images/frigi.png'

import avengerMusic from '$lib/music/AVENGERS.mp3'
import avenger from '$lib/images/avenger.png'

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
		img: avenger,
        title: 'Avenger',
		artist: 'Test',
		file: avengerMusic
	},
	

]);

export const addTrack = track => {
	trackList.update(v => [...v, track])
};