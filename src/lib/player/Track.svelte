<script>
	import { status, isPlaying, audioPlayer, index, trackList, addTrack } from './../../stores';
	import PlayButton from './PlayButton.svelte';

	import { Avatar } from 'flowbite-svelte';
	import { Badge } from 'flowbite-svelte';

	export let img;
	export let title;
	export let artist;
	export let file;
	export let isNew = false;

	setInterval(handleHover, 500);

	let color = 'yellow';
	function handleHover() {
		color = color === 'yellow' ? 'dark' : 'yellow';
	}
</script>

<div
	class="flex w-full items-center  bg-white p-3 pb-3 transition-all transition-all duration-500 duration-500 sm:p-2 sm:pb-2 lg:p-2 xl:p-2 xl:pb-2 dark:border-slate-500 dark:bg-slate-800  dark:border-slate-500 dark:border-b"
	class:playing={title === $trackList[$index].title}
>
	<div class="play-button m-1">
		<PlayButton track {title} {artist} {file} {img} />
	</div>

	<div class="flex w-32 space-x-2">
		<Avatar src={img} rounded />
	</div>

	<div class="m-2 flex w-full flex-col content-center items-start dark:text-white">
		<div class="font-semibold">{title}</div>
		<div class="font-medium">{artist}</div>
	</div>

</div>

<style>
</style>
