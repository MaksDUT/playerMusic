<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';

	import { trackList, showLyric} from  './../stores';

	import Track from '$lib/player/Track.svelte';

	import { onMount } from 'svelte';

	let { children } = $props();

	let isMount = $state(false);

	onMount(() => {
		isMount = true;
	});
</script>

<div class="app">
	<Header />

	<div class="h-full px-4 py-8">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
			<!-- Large item -->

			<div
				class="group relative h-[80vh] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-lg"
			>
				<div class="w-100">
					<div class="relative z-10 flex h-full flex-col items-center justify-end">
						{#if isMount}
							{#each $trackList as track}
								<Track
									img={track.img}
									title={track.title}
									artist={track.artist}
									file={track.file}
									isNew
								></Track>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<div
				class="group relative h-[80vh] w-full overflow-hidden rounded-2xl shadow-lg md:col-span-3 md:row-span-2"
			>
				{@render children()}
			</div>
		</div>
	</div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: rgb(64, 76, 88);
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
