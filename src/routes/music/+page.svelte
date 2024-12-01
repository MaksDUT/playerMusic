<script lang="ts">
	import Controls from '$lib/player/Controls.svelte';
	import Track from '$lib/player/Track.svelte';
	import PlayerMusic from '$lib/player/PlayerMusic.svelte';

	import coatch from '$lib/music/coach ping pong.mp3';
	import frigi from '$lib/images/frigi.png';

	import avengerMusic from '$lib/music/AVENGERS.mp3';
	import avenger from '$lib/images/avenger.png';
</script>

<svelte:head>
	<title>Music</title>
	<meta name="description" content="Music for fun" />
</svelte:head>

<section>
	<Controls />
</section>

<div class="app">
	<Track img={frigi} title="Coach ping pong" artist="en attente" file={coatch} />

	<Track img={avenger} title="Avengers" artist="en attente" file={avengerMusic} />
	
</div>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
