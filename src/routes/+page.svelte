<script lang="ts">
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';

	import LyricsPlayer from '$lib/lyrics/LyricsPlayer.svelte';
	import { onMount } from 'svelte';

	import {isPlaying, showLyric } from './../stores';

	import { Listgroup, ListgroupItem, Button } from 'flowbite-svelte';
	import Controls from '$lib/player/Controls.svelte';
	import Track from '$lib/player/Track.svelte';

	import arcane from '$lib/images/arcane3.png';

	import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';

	let { data}: Props = $props();


	let isMount = $state(false);

	onMount(() => {
		isMount = true;
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Controls isMobile="true" />


<div class="relative h-[80vh] flex flex-col justify-center">
	<div
		class="absolute inset-0 bg-cover bg-center {$isPlaying ? 'hallucination' : ''}"
		style="background-image: url('{arcane}');"
	></div>
	<div class="absolute inset-0 bg-black opacity-50"></div>

	<section class=" flex justify-center content-center w-full flex-row content-center h-1/2 p-3">
		<!-- ici la liste -->
		<!-- <div class="w-1/2">
			<div class="relative z-10 flex h-full flex-col items-center justify-end">
				{#if isMount && showList}
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

				<section></section>
			</div>
		</div> -->
		<!-- ici le text -->

		{#if isMount && $showLyric}
			<div transition:blur class="flex z-50 w-[100vw] content-center justify-center h-full transition-all duration-500">
				<LyricsPlayer></LyricsPlayer>
			</div>
		{/if}

<!-- 		<Button
			class="z-50 m-2 h-10 w-10   {!showList
				? 'bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700'
				: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700'} "
			on:click={() => (showList = !showList)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-list h-6 w-6"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 6l11 0" /><path
					d="M9 12l11 0"
				/><path d="M9 18l11 0" /><path d="M5 6l0 .01" /><path d="M5 12l0 .01" /><path
					d="M5 18l0 .01"
				/></svg
			>
		</Button>

		<Button
			class="z-50 m-2 h-10 w-10 {!showLyric
				? 'bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700'
				: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700'}"
			on:click={() => (showLyric = !showLyric)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-playlist"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
					d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
				/><path d="M17 17v-13h4" /><path d="M13 5h-10" /><path d="M3 9l10 0" /><path
					d="M9 13h-6"
				/></svg
			>
		</Button> -->
	</section>
</div>

<style>
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
