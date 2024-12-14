<script>
	import Slider from './Slider.svelte';
	import { status, isPlaying, showLyric, audioPlayer, index, trackList } from './../../stores';
	import { format } from './utilities.js';
	import PlayButton from './PlayButton.svelte';
	import { onMount } from 'svelte';

	import { BottomNav, Button, Dropdown, DropdownItem } from 'flowbite-svelte';

	import AudioVisualizer from './AudioVisualizer.svelte';


	let {
		isMobile = false,
	} = $props();

	let duration = $state(0);
	let currentTime = $state(0);
	let formattedTime = format(currentTime);
	let paused = $state(true);
	let volume = $state(0.5);

	let slider;
	let rAF = null;

	let repeat = $state(false);
	let speed = $state(1);

	let trackOn = $state($trackList[$index]);

	let title = $state(trackOn.title);
	let artist = $state(trackOn.artist);
	let src = $state(trackOn.file);
	let img = $state(trackOn.img);

	$effect(() => {
		title = $trackList[$index].title;
		artist = $trackList[$index].artist;
		img = $trackList[$index].img;
		imageSrc = $trackList[$index].img;
	});

	//TEST
	// Paramètres personnalisés
	let imageSrc = $state(img);
	let visualizationMode = 'frequency';
	let fftSize = 1024;
	let backgroundColor = '#0000';
	let themeColor = '#ff4500';

	function whilePlaying() {
		slider.value = currentTime;
		currentTime = slider.value;
		rAF = requestAnimationFrame(whilePlaying);
	}

	function changeSpeed(v) {
		if (speed == v) {
			return;
		}
		speed = v;
	}

	function loadTrackTest() {
		/* title = $trackList[$index].title;
		artist = $trackList[$index].artist;
		img = $trackList[$index].img; */
		$audioPlayer.src = $trackList[$index].file;
		$audioPlayer.load();
	}

	function loadTrack($index) {
		title = $trackList[$index].title;
		artist = $trackList[$index].artist;
		img = $trackList[$index].img;
		$audioPlayer.src = $trackList[$index].file;
		$audioPlayer.load();
	}

	function playTrack() {
		$isPlaying = true;
		requestAnimationFrame(whilePlaying);
		$audioPlayer.play();
	}

	function pauseTrack() {
		$isPlaying = false;
		cancelAnimationFrame(rAF);
		$audioPlayer.pause();
	}

	function movePosition() {
		time = slider.value;
		if (!paused) {
			cancelAnimationFrame(rAF);
		}
	}

	function updatePosition() {
		currentTime = slider.value;
		if (!paused) {
			requestAnimationFrame(whilePlaying);
		}
	}

	function updateMinus10() {
		currentTime = currentTime - 10;
		if (!paused) {
			requestAnimationFrame(whilePlaying);
		}
	}

	function updatePlus10() {
		currentTime = currentTime + 10;
		if (!paused) {
			requestAnimationFrame(whilePlaying);
		}
	}

	function previousTrack() {
		$isPlaying = false;
		currentTime = 0;
		if ($index > 0) {
			$index -= 1;
		} else {
			$index = $trackList.length - 1;
		}
		loadTrack($index);
		playTrack();
	}

	function nextTrack() {
		$isPlaying = false;
		currentTime = 0;

		if (repeat) {
			//loadTrack($index);
			playTrack();
			return;
		}

		if ($index < $trackList.length - 1) {
			$index += 1;
		} else {
			$index = 0;
		}
		loadTrack($index);
		playTrack();
	}

	onMount(() => {
		$audioPlayer.load();
	});

	// 	on:progress="{() => $status = 'loading'}"
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<audio
	bind:this={$audioPlayer}
	bind:duration
	bind:currentTime
	bind:paused
	bind:volume
	bind:playbackRate={speed}
	on:canplay={() => ($status = 'can play some')}
	on:canplaythrough={() => ($status = 'can play all')}
	on:waiting={() => ($status = 'waiting')}
	on:timeupdate={() => ($status = 'playing')}
	on:seeking={() => ($status = 'seeking')}
	on:ended={() => {
		//$isPlaying = false;
		currentTime = 0;
		nextTrack();
	}}
	{src}
></audio>

{#if isMobile}
	<div
		class="h-22 fixed bottom-0 left-0 z-50 w-full bg-slate-50 border-t border-slate-200  dark:border-gray-700 dark:bg-slate-800"
	>
		<!-- <div class="absolute mx-auto flex h-full max-w-lg grid-cols-4 flex-col justify-end font-medium">
			<div
				class="min-w-[10%] space-y-2 rounded-t-xl border-b border-slate-100 bg-slate-700 p-4 pb-2 transition-all transition-all duration-500 duration-500 sm:space-y-2 sm:p-2 sm:pb-2 md:max-w-[200px] lg:max-w-[300px] md:w-[800px] lg:space-y-2 lg:p-2 xl:space-y-2 xl:p-4 xl:pb-2 dark:border-slate-500 dark:bg-slate-800"
			>
				<div class="flex items-center space-x-4 object-fill">
					<img
						src={img}
						loading="lazy"
						decoding="async"
						alt=""
						class="w-12 flex-none rounded-lg bg-slate-100 bg-cover lg:w-20"
					/>
					<div class="min-w-0 flex-auto space-y-1 font-semibold">
						<p
							class="text-xs text-slate-100 transition-all duration-500 md:text-lg dark:text-slate-50"
						>
							{title}
						</p>
						<h2
							class="truncate text-xs leading-6 text-slate-300 transition-all duration-500 md:text-sm dark:text-slate-400"
						>
							{artist}
						</h2>
					</div>
				</div>
			</div>
		</div> -->

		
		<div class="flex w-full min-w-0 flex-row justify-evenly font-semibold">

			<div class="w-1/4">
			
				<div
				class="min-w-[10%] space-y-2 rounded-t-xl  border-slate-100 bg-slate-50 p-4 pb-2 transition-all transition-all duration-500 duration-500 sm:space-y-2 sm:p-2 sm:pb-2 md:max-w-[200px] lg:max-w-[300px] md:w-[800px] lg:space-y-2 lg:p-2 xl:space-y-2 xl:p-4 xl:pb-2 dark:border-slate-500 dark:bg-slate-800"
			>
				<div class="flex items-center space-x-4 object-fill">
					<img
						src={img}
						loading="lazy"
						decoding="async"
						alt=""
						class="w-12 flex-none rounded-lg bg-slate-100 bg-cover lg:w-20"
					/>
					<div class="min-w-0 flex-auto space-y-1 font-semibold">
						<p
							class="text-xs text-slate-700 transition-all duration-500 md:text-lg dark:text-slate-50"
						>
							{title}
						</p>
						<h2
							class="truncate text-xs leading-6 text-slate-500 transition-all duration-500 md:text-sm dark:text-slate-400"
						>
							{artist}
						</h2>
					</div>
				</div>
			</div>

			</div>
			
			<div class="flex w-1/2 min-w-0 flex-col grow-2  font-semibold content-center justify-center">

				<div
					class="flex items-center rounded-b-xl bg-slate-50 text-slate-500 transition-all transition-all duration-500 duration-500 dark:bg-slate-800 dark:text-slate-200"
				>
					<div class="flex flex-auto items-center justify-evenly">
						<button
							type="button"
							class="hidden rounded sm:block lg:hidden xl:block"
							class:bg-slate-200={repeat}
							aria-label="Next"
							on:click={() => (repeat = !repeat)}
						>
							<svg
								class="h-6 w-6 text-slate-500 dark:text-white"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
								/>
							</svg>
						</button>
						<button
							type="button"
							class="sm:block xl:block"
							aria-label="Previous"
							on:click={previousTrack}
						>
							<svg width="24" height="24" fill="none">
								<path
									d="m10 12 8-6v12l-8-6Z"
									fill="currentColor"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
								<path
									d="M6 6v12"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
							</svg>
						</button>
						<!-- <button
							type="button"
							aria-label="Rewind 10 seconds"
							class="hidden sm:block lg:hidden xl:block"
							on:click={updateMinus10}
						>
							<svg width="24" height="24" fill="none">
								<path
									d="M6.492 16.95c2.861 2.733 7.5 2.733 10.362 0 2.861-2.734 2.861-7.166 0-9.9-2.862-2.733-7.501-2.733-10.362 0A7.096 7.096 0 0 0 5.5 8.226"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
								<path
									d="M5 5v3.111c0 .491.398.889.889.889H9"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
							</svg>
						</button> -->
					</div>
					<!-- 		<button
				type="button"
				class="-my-2 mx-auto flex h-20 w-20 flex-none items-center justify-center rounded-full bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5 transition-all transition-all duration-500 duration-500 dark:bg-slate-100 dark:text-slate-700"
				aria-label="Pause" 
			>
				<svg width="30" height="32" fill="currentColor">
					<rect x="6" y="4" width="4" height="24" rx="2"></rect>
					<rect x="20" y="4" width="4" height="24" rx="2"></rect>
					</svg>
					</button> -->
					<div class="test">
						<PlayButton
							controls
						/>
					</div>
	
					<div class="flex flex-auto items-center justify-evenly">
						<!-- <button
							type="button"
							aria-label="Skip 10 seconds"
							class="hidden sm:block lg:hidden xl:block"
							on:click={updatePlus10}
						>
							<svg width="24" height="24" fill="none">
								<path
									d="M17.509 16.95c-2.862 2.733-7.501 2.733-10.363 0-2.861-2.734-2.861-7.166 0-9.9 2.862-2.733 7.501-2.733 10.363 0 .38.365.711.759.991 1.176"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
								<path
									d="M19 5v3.111c0 .491-.398.889-.889.889H15"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
							</svg>
						</button> -->
						<button type="button" class="xl:block" aria-label="Next" on:click={nextTrack}>
							<svg width="24" height="24" fill="none">
								<path
									d="M14 12 6 6v12l8-6Z"
									fill="currentColor"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
								<path
									d="M18 6v12"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
							</svg>
						</button>
	
						<Dropdown class="m-4" placement="top" triggeredBy="#top-dd">
							<DropdownItem on:click={() => changeSpeed(0.5)}>
								<div class="mb-1 font-medium">x0.5</div>
							</DropdownItem>
							<DropdownItem on:click={() => changeSpeed(0.75)}>
								<div class="mb-1 font-medium">x0.75</div>
							</DropdownItem>
							<DropdownItem on:click={() => changeSpeed(1)}>
								<div class="mb-1 font-medium">x1</div>
							</DropdownItem>
							<DropdownItem on:click={() => changeSpeed(1.25)}>
								<div class="mb-1 font-medium">x1.25</div>
							</DropdownItem>
							<DropdownItem on:click={() => changeSpeed(1.5)}
								><div class="mb-1 font-medium">x1.5</div></DropdownItem
							>
							<DropdownItem on:click={() => changeSpeed(2)}
								><div class="mb-1 font-medium">x 2</div></DropdownItem
							>
						</Dropdown>
	
						<button
							id="top-dd"
							type="button"
							class="hidden rounded sm:block lg:hidden xl:block"
							aria-label="Next"
						>
							x{speed}
						</button>
					</div>
				</div>
	
	
				
	
				<div class="flex flex-row ">
					<div class="text-grey-400 text-xs transition-all duration-500 dark:text-slate-100 mr-1">
						{format(currentTime)}
					</div>
					<div class="w-full space-y-2 content-center">
						<div class="relative">
							<div
								class="slider-min overflow-hidden rounded-full bg-slate-100 transition-all duration-500 dark:bg-slate-700"
							>
								<Slider
									bind:this={slider}
									min={0}
									bind:value={currentTime}
									max={duration}
									step={0.01}
									precision={2}
									formatter={(v) => format(v)}
									on:input={movePosition}
									on:change={updatePosition}
								/>
							</div>
						</div>
					</div>
					<div class="text-xs text-grey-400 transition-all duration-500 dark:text-slate-400 ml-1">
						{format(duration)}
					</div>
				</div>
			</div>

			<div class="w-1/6  md:w-1/4 content-center">

				<div
				class="m-auto flex w-2/3 items-center rounded-b-xl bg-slate-50 text-slate-500 transition-all transition-all duration-500 duration-500 dark:bg-slate-800 dark:text-slate-200"
			>
				<div class="flex flex-auto items-center justify-evenly">
					<div class="flex space-y-2 w-full">
						<div class="pr-2">
							<svg
								class="h-5 w-5 text-slate-500 dark:text-white "
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M15 6.037c0-1.724-1.978-2.665-3.28-1.562L7.638 7.933H6c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z"
								/>
								<path
									fill-rule="evenodd"
									d="M16.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 20 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 18 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
	
						<div class="relative min-w-[50px] w-full max-w-[200px]">
							<div
								class="overflow-hidden rounded-full bg-slate-100 transition-all duration-500 dark:bg-slate-700 slider-min"
							>
								<Slider
									min={0}
									max={1}
									step={0.01}
									precision={2}
									formatter={(v) => Math.round(v * 100)}
									bind:value={volume}
								/>
							</div>
						</div>
					</div>

					<div>
						<button type="button" class="xl:block" aria-label="Next" on:click={()=> { $showLyric = !$showLyric }}>
							{#if $showLyric}
							<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-microphone-2 h-5 w-5 text-slate-500 dark:text-white"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 12.9a5 5 0 1 0 -3.902 -3.9" /><path d="M15 12.9l-3.902 -3.899l-7.513 8.584a2 2 0 1 0 2.827 2.83l8.588 -7.515z" /></svg>
							{:else}
							<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-microphone-2-off h-5 w-5 text-slate-500 dark:text-white"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16.908 12.917a5 5 0 1 0 -5.827 -5.819" /><path d="M10.116 10.125l-6.529 7.46a2 2 0 1 0 2.827 2.83l7.461 -6.529" /><path d="M3 3l18 18" /></svg>
							{/if}
						</button>
					</div>

				</div>
			</div>
			</div>

		</div>
		


		<div></div>
	</div>


{:else}
	<div class="relative z-10 mt-6 rounded-xl shadow-xl sm:mt-5">
		<div
			class="min-w-[400px] space-y-6 rounded-t-xl border-b border-slate-100 bg-slate-700 bg-opacity-90 p-4 pb-6 transition-all transition-all duration-500 duration-500 sm:space-y-8 sm:p-10 sm:pb-8 lg:space-y-6 lg:p-6 xl:space-y-8 xl:p-10 xl:pb-8 dark:border-slate-500 dark:bg-slate-800"
		>
			<div class="flex items-center space-x-4 object-fill">
				<img
					src={img}
					loading="lazy"
					decoding="async"
					alt=""
					class="w-32 flex-none rounded-lg bg-slate-100 bg-cover"
				/>
				<div class="min-w-0 flex-auto space-y-1 font-semibold">
					<p class="text-lg text-slate-100 transition-all duration-500 dark:text-slate-50">
						{title}
					</p>
					<h2
						class="truncate text-sm leading-6 text-slate-300 transition-all duration-500 dark:text-slate-400"
					>
						{artist}
					</h2>
				</div>
			</div>
			<div class="space-y-2">
				<div class="relative">
					<div
						class="overflow-hidden rounded-full bg-slate-100 transition-all duration-500 dark:bg-slate-700"
					>
						<Slider
							bind:this={slider}
							min={0}
							bind:value={currentTime}
							max={duration}
							step={0.01}
							precision={2}
							formatter={(v) => format(v)}
							on:input={movePosition}
							on:change={updatePosition}
						/>
					</div>
				</div>
				<div class="flex justify-between text-sm font-medium tabular-nums leading-6">
					<div class="text-cyan-400 transition-all duration-500 dark:text-slate-100">
						{format(currentTime)}
					</div>
					<div class="text-slate-200 transition-all duration-500 dark:text-slate-400">
						{format(duration)}
					</div>
				</div>
			</div>
		</div>

		<div
			class="flex items-center rounded-b-xl bg-slate-50 text-slate-500 transition-all transition-all duration-500 duration-500 dark:bg-slate-600 dark:text-slate-200"
		>
			<div class="flex flex-auto items-center justify-evenly">
				<button
					type="button"
					class="hidden rounded sm:block lg:hidden xl:block"
					class:bg-slate-200={repeat}
					aria-label="Next"
					on:click={() => (repeat = !repeat)}
				>
					<svg
						class="h-6 w-6 text-gray-800 dark:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
						/>
					</svg>
				</button>
				<button
					type="button"
					class="sm:block xl:block"
					aria-label="Previous"
					on:click={previousTrack}
				>
					<svg width="24" height="24" fill="none">
						<path
							d="m10 12 8-6v12l-8-6Z"
							fill="currentColor"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
						<path
							d="M6 6v12"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
				</button>
				<button
					type="button"
					aria-label="Rewind 10 seconds"
					class="hidden sm:block lg:hidden xl:block"
					on:click={updateMinus10}
				>
					<svg width="24" height="24" fill="none">
						<path
							d="M6.492 16.95c2.861 2.733 7.5 2.733 10.362 0 2.861-2.734 2.861-7.166 0-9.9-2.862-2.733-7.501-2.733-10.362 0A7.096 7.096 0 0 0 5.5 8.226"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
						<path
							d="M5 5v3.111c0 .491.398.889.889.889H9"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
				</button>
			</div>
			<!-- 		<button
		type="button"
		class="-my-2 mx-auto flex h-20 w-20 flex-none items-center justify-center rounded-full bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5 transition-all transition-all duration-500 duration-500 dark:bg-slate-100 dark:text-slate-700"
		aria-label="Pause" 
		>
			<svg width="30" height="32" fill="currentColor">
				<rect x="6" y="4" width="4" height="24" rx="2"></rect>
				<rect x="20" y="4" width="4" height="24" rx="2"></rect>
			</svg>
			</button> --><PlayButton
				controls
			/>

			<div class="flex flex-auto items-center justify-evenly">
				<button
					type="button"
					aria-label="Skip 10 seconds"
					class="hidden sm:block lg:hidden xl:block"
					on:click={updatePlus10}
				>
					<svg width="24" height="24" fill="none">
						<path
							d="M17.509 16.95c-2.862 2.733-7.501 2.733-10.363 0-2.861-2.734-2.861-7.166 0-9.9 2.862-2.733 7.501-2.733 10.363 0 .38.365.711.759.991 1.176"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
						<path
							d="M19 5v3.111c0 .491-.398.889-.889.889H15"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
				</button>
				<button type="button" class=" xl:block" aria-label="Next" on:click={nextTrack}>
					<svg width="24" height="24" fill="none">
						<path
							d="M14 12 6 6v12l8-6Z"
							fill="currentColor"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
						<path
							d="M18 6v12"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
				</button>

				<Dropdown class="m-4" placement="top" triggeredBy="#top-dd">
					<DropdownItem on:click={() => changeSpeed(0.5)}>
						<div class="mb-1 font-medium">x0.5</div>
					</DropdownItem>
					<DropdownItem on:click={() => changeSpeed(0.75)}>
						<div class="mb-1 font-medium">x0.75</div>
					</DropdownItem>
					<DropdownItem on:click={() => changeSpeed(1)}>
						<div class="mb-1 font-medium">x1</div>
					</DropdownItem>
					<DropdownItem on:click={() => changeSpeed(1.25)}>
						<div class="mb-1 font-medium">x1.25</div>
					</DropdownItem>
					<DropdownItem on:click={() => changeSpeed(1.5)}
						><div class="mb-1 font-medium">x1.5</div></DropdownItem
					>
					<DropdownItem on:click={() => changeSpeed(2)}
						><div class="mb-1 font-medium">x 2</div></DropdownItem
					>
				</Dropdown>

				<button
					id="top-dd"
					type="button"
					class="hidden rounded sm:block lg:hidden xl:block"
					aria-label="Next"
				>
					x{speed}
				</button>
			</div>
		</div>

		<div
			class="m-auto flex w-2/3 items-center rounded-b-xl bg-slate-50 text-slate-500 transition-all transition-all duration-500 duration-500 dark:bg-slate-600 dark:text-slate-200"
		>
			<div class="flex flex-auto items-center justify-evenly">
				<div class="flex space-y-2">
					<div class="pr-2">
						<svg
							class="h-6 w-6 text-slate-500 dark:text-white"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M15 6.037c0-1.724-1.978-2.665-3.28-1.562L7.638 7.933H6c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z"
							/>
							<path
								fill-rule="evenodd"
								d="M16.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 20 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 18 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>

					<div class="relative w-[200px]">
						<div
							class="overflow-hidden rounded-full bg-slate-100 transition-all duration-500 dark:bg-slate-700"
						>
							<Slider
								min={0}
								max={1}
								step={0.01}
								precision={2}
								formatter={(v) => Math.round(v * 100)}
								bind:value={volume}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.slider-min {
		--size: 0.25rem;
		position: relative;
		margin: 0;
		padding: 0;
		height: var(--size);
		border-radius: var(--size);
	}

	div.test button {
		width: 1rem;
		height: 1rem;
	}
</style>
