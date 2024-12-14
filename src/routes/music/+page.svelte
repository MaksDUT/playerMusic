<script lang="ts">
	import Controls from '$lib/player/Controls.svelte';
	import Track from '$lib/player/Track.svelte';
	import PlayerMusic from '$lib/player/PlayerMusic.svelte';

	import { status, isPlaying, audioPlayer, index, trackList } from './../../stores';
	import AudioVisualizer from '$lib/player/AudioVisualizer.svelte';

	import arcane from '$lib/images/arcane3.png';

	import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';

	import { onMount } from 'svelte';

	let trackOn = $state($trackList[$index]);

	let img = $state(trackOn.img);

	$effect(() => {
		img = $trackList[$index].img;
		imageSrc = $trackList[$index].img;
	});

	//TEST
	// Paramètres personnalisés
	let imageSrc = $state();
	let visualizationMode = 'frequency';
	let fftSize = 1024;
	let backgroundColor = '#0000';
	let themeColor = '#ff4500';

	let isMount = $state(false);

	onMount(()=> {
		isMount = true;
	})



</script>

<svelte:head>
	<title>Music</title>
	<meta name="description" content="Music for fun" />
</svelte:head>

<div class="relative h-screen w-full">
	<div
		class="absolute inset-0 bg-cover bg-center {$isPlaying ? 'hallucination' : ''}"
		style="background-image: url('{arcane}');"
	></div>
	<div class="absolute inset-0 bg-black opacity-50"></div>

	<div class="relative z-10 flex h-full flex-col items-center justify-end">
		{#if isMount}
			<Listgroup active class="w-96 transition-all duration-500">
				{#each $trackList as track}
					<ListgroupItem class="gap-2 text-base font-semibold">
						<Track
							img={track.img}
							title={track.title}
							artist={track.artist}
							file={track.file}
							isNew
						></Track>
					</ListgroupItem>
				{/each}
			</Listgroup>
		{/if}

		<section>
			<Controls />
		</section>

		<div class="app overflow-hidden">
			{#if isMount}
			<AudioVisualizer
				audioElement={$audioPlayer}
				{fftSize}
				{visualizationMode}
				{backgroundColor}
				bind:imageSrc={img}
				imageSize="200"
				width="2000"
				height="200"
			/>
			{/if}
		</div>
	</div>
</div>

<style>
	.app {
		width: 100%;
	}
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

	.hallucination {
		overflow: hidden;
		background-color: magenta;
		background-blend-mode: screen;
	}

	.hallucination::before,
	.hallucination::after {
		display: block;
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		right: 2px;
		bottom: 2px;
		background: inherit;
		mix-blend-mode: multiply;
		transform: scale(1.01);
		animation: hallucinate 0.5s infinite alternate;
	}

	.hallucination::before {
		background-color: yellow;
		background-blend-mode: screen;
		transform-origin: top right;
	}

	.hallucination::after {
		background-color: cyan;
		background-blend-mode: screen;
		transform-origin: bottom left;
	}

	@keyframes hallucinate {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(1.01);
		}
	}
</style>
