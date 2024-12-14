<script>
	import Track from '$lib/player/Track.svelte';
	import la_team_music from '$lib/music/LA TEAM.mp3';

	import { status, isPlaying, audioPlayer, index, trackList } from './../../stores';

	import Controls from '$lib/player/Controls.svelte';

	import { onMount } from 'svelte';

	import { flip } from 'svelte/animate';
	import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';

	import Liricle from 'liricle';

	// get DOM elements
	let duration = $state(0);
	let currentTime = $state(0);
	let paused = $state(true);
	let volume = $state(0.5);
	let speed = $state(0);

	let trackOn = $state($trackList[$index]);

	let title = $state(trackOn.title);
	let artist = $state(trackOn.artist);
	let src = $state(trackOn.file);
	let img = $state(trackOn.img);
	let lyric = $state(trackOn.lyric);

	let show_lyric = $state(false);

	$effect(() => {
		title = $trackList[$index].title;
		artist = $trackList[$index].artist;
		img = $trackList[$index].img;
		src = $trackList[$index].img;
		lyric = $trackList[$index].lyric;

		if (lyric) {
			liricle.load({ url: lyric });
			show_lyric = true;
		} else {
			show_lyric = false;
		}
	});

	let file = la_team_music;

	let lyric_word = $state();
	let lyric_line = $state();

	let lyric_after = $state('');
	let lyric_before = $state('');

	let lists = $state([]);

	const liricle = new Liricle();

	/////////////////////////////////////////////////////////////////////////////////////////

	onMount(() => {
		// create Liricle instance
		const liricle = new Liricle();

		// listen to on load event
		liricle.on('load', (data) => {
			console.log(data);
		});

		// if you load lyrics from a URL, you can listen for the loaderror event when loading fails
		liricle.on('loaderror', (error) => {
			console.error('Failed to load lyrics:', error.message);
		});

		// listen to on sync event
		liricle.on('sync', (line, word) => {
			console.log('current line => ', line);
			console.log('current word => ', word);

			lyric_line = line.text;

			if (line?.index == 0) {
				lists.push(line);
				lists.push(liricle.data?.lines[line?.index + 1]);

				lyric_after = liricle.data?.lines[line?.index + 1].text;
			} else if (line?.index > liricle.data?.lines.length - 2) {
				console.log('fin');
			} else {
				if (line?.index != 1) {
					if (lists.length > 2) {
						while (lists.length > 2) {
							lists.shift();
						}
					}
				}

				lists.push(liricle.data?.lines[line?.index + 1]);

				lyric_before = liricle.data?.lines[line?.index - 1].text;
				lyric_after = liricle.data?.lines[line?.index + 1].text;
			}
			// please always check the word value before using it.
			if (word) $lyric_word = word.text;
		});

		// load lyric
		if (lyric) {
			liricle.load({ url: lyric });
			show_lyric = true;
		} else {
			show_lyric = false;
		}

		// adjust lyric speed
		// positive value => speed up
		// negative value ​​=> slow down
		liricle.offset = 400; // value in milliseconds.

		$audioPlayer.addEventListener('timeupdate', () => {
			const time = $audioPlayer.currentTime;

			if (time < 1.0) {
				lists = [];
			}
			// sync lyric when the audio time updated
			liricle.sync(time, false);
		});
	});
</script>

<!-- <div class="flex flex-col rounded-t-xl border-b border-slate-100 bg-slate-400 bg-opacity-90 p-4 pb-6 transition-all transition-all duration-500">
    <div class="text-slate-100 ">{lyric_before}</div>
    <div class="text-zinc-100 text-lg translate-y-6 transition-all duration-500">{lyric_line}</div>
    <div class="text-zinc-950 ">{lyric_after}</div>
</div> -->

<div
	class="z-50 flex min-h-[200px] w-full min-w-[300px] flex-col justify-center rounded-xl border-b border-slate-100 bg-slate-400 bg-opacity-80 p-4 transition-all transition-all duration-500"
>
	{#if show_lyric}
		<div class="flex w-full flex-col content-center justify-center">
			{#each lists as line, index (line)}
				<div
					transition:fly
					class="text-4xl transition-all duration-500 {line.text == lyric_line
						? 'text-4xl  text-slate-100 '
						: line.text == lyric_after
							? 'text-slate-900'
							: 'text-slate-100'}  "
				>
					{line.text}
				</div>
			{/each}
		</div>
	
		{:else}
		<div
					transition:fly
					class="text-4xl transition-all duration-500 text-5xl  text-slate-100">
					 Aucune parole pour cette musique
				</div>
	
		{/if}
</div>

<style>
</style>
