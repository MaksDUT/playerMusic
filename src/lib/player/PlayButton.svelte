<script>
	import { status, isPlaying, audioPlayer, index, trackList, addTrack } from './../../stores';
	import PlayIcon from './play-icon.svelte';
	import PauseIcon from './pause-icon.svelte';
	import LoadingIcon from './loading-icon.svelte';

	export let controls = false;
	export let track = false;
	export let title = '';
	export let artist = '';
	export let file = '';
	export let img = '';

	function playTrack() {
		$audioPlayer.play();
		$isPlaying = true;
	}

	function pauseTrack() {
		$audioPlayer.pause();
		$isPlaying = false;
	}

	function loadTrack($index) {
		
		title = $trackList[$index].title;
		artist = $trackList[$index].artist;
		$audioPlayer.src = $trackList[$index].file;
		$audioPlayer.load();
	}

	function addAndPlayTrack() {
		let i = 0;
		if ((i = $trackList.findIndex((track) => track.title == title)) != -1) {
			$index = i;
		} else {
			addTrack({ title, artist, file, img });
			$index = $trackList.length - 1;
			// 		$currentTime = 0;
			// Load and play the new track
		}
		loadTrack($index);
		playTrack();
	}
</script>

{#if controls}
	{#if $isPlaying === false}
		<button class="play-button controls" on:click={playTrack}>
			<PlayIcon size=2 />
		</button>
	{:else if $isPlaying === true && ($status === 'waiting' || $status === 'loading' || $status === 'can play some' || $status === 'can play all')}
		<button class="play-button controls" on:click={pauseTrack}>
			<LoadingIcon />
		</button>
	{:else if $isPlaying === true}
		<button class="play-button controls" on:click={pauseTrack}>
			<PauseIcon />
		</button>
	{/if}
{:else if track}
	{#if title !== $trackList[$index].title}
		<button class="play-button track" on:click={addAndPlayTrack}>
			<PlayIcon size={1.5} />
		</button>
	{:else if title === $trackList[$index].title && $isPlaying === true && ($status === 'loading' || $status === 'can play some' || $status === 'can play all' || $status === 'waiting')}
		<button class="play-button track playing" on:click={pauseTrack}>
			<LoadingIcon size={1.5} />
		</button>
	{:else if title === $trackList[$index].title && $isPlaying === true}
		<button class="play-button track playing" on:click={pauseTrack}>
			<PauseIcon size={1.5} />
		</button>
	{:else if title === $trackList[$index].title && $isPlaying === false}
		<button class="play-button track playing" on:click={playTrack}>
			<PlayIcon size={1.5} />
		</button>
	{/if}
{/if}

<style>
	.play-button {
		margin: 0;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 2rem;
		background: #fcfcfc;
	}

    .play-button:hover{
        background: #e7e7e7;
    }

	.controls {
		width: 4rem;
		height: 4rem;
		
	}

</style>
