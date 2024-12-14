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

	function cond(){
		if(controls) return true;
		return title === $trackList[$index].title
	}

</script>


	{#if !cond() }
		<button class="play-button" class:controls={controls} class:track={track}  on:click={addAndPlayTrack}>
			<PlayIcon size={(controls) ? 1.5 : 1 } />
		</button>
	{:else if cond() && $isPlaying === true && ($status === 'waiting' || $status === 'loading' || $status === 'can play some' || $status === 'can play all')}
		<button class="play-button" class:controls={controls} class:track={track} class:playing={$isPlaying}  on:click={pauseTrack}>
			<LoadingIcon size={(controls) ? 1.5 : 1 } />
		</button>

	{:else if cond() && $isPlaying === true}
		<button class="play-button " class:controls={controls} class:playing={$isPlaying} class:track={track} on:click={pauseTrack}>
			<PauseIcon size={(controls) ? 1.5 : 1 } />
		</button>
	
	{:else if cond() && $isPlaying === false}
		<button class="play-button" class:controls={controls} class:track={track} class:playing={$isPlaying}  on:click={playTrack}>
			<PlayIcon size={(controls) ? 1.5 : 1 } />
		</button>
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
		width: 2.25rem;
		height: 2.25rem;	
	}

</style>
