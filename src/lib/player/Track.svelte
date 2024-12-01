<script>
	import { status, isPlaying, audioPlayer, index, trackList, addTrack } from './../../stores';
	import PlayButton from './PlayButton.svelte';

	export let img;
	export let title;
	export let artist;
	export let file;
</script>

<div
	class="flex items-center rounded-t-xl border-b border-slate-100 bg-white p-4 pb-6 transition-all transition-all duration-500 duration-500 sm:p-10 sm:pb-8 lg:p-6 xl:p-2 xl:pb-2 dark:border-slate-500 dark:bg-slate-800"
	class:playing={title === $trackList[$index].title}
>
	<div class="play-button">
		<PlayButton track {title} {artist} {file} {img} />
	</div>

	<div class="m-2 flex flex-col content-center">
		<div><strong>{title}</strong></div>

		<div>{artist}</div>
	</div>
</div>

<style>
</style>
