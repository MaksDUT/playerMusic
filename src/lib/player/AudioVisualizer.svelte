<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import ColorThief from 'colorthief'; // Bibliothèque pour extraire les couleurs dominantes
	import { status, isPlaying, audioPlayer, index, trackList } from './../../stores';

	/*     export let audioElement: HTMLAudioElement | null = null;
    export let fftSize = 2048;
    export let visualizationMode: 'waveform' | 'frequency' | 'circular-frequency' = 'circular-frequency';
    export let imageSrc: string | null = null;
    export let backgroundColor = '#000';
    export let imageSize = 150; */
	let {
		audioElement = null,
		fftSize = 2048,
		visualizationMode = 'circular-frequency',
		imageSrc = $bindable(null),
		backgroundColor = '#000',
		imageSize = "200",
		width = "200",
		height = "200"
	} = $props();

	let canvasElement: HTMLCanvasElement = $state();
	let audioContext: AudioContext | null = $state(null);
	let analyser: AnalyserNode | null = $state(null);
	let animationFrameId: number = $state(0);

	let img = $state();

	let themeColors: string[] = $state(['#ff4500']); // Par défaut, couleurs dynamiques

	let isMount = $state(false);

	// Charger l'image pour le traitement

	$effect(() => {
		if (isMount) {
			img.src = imageSrc;
			img.onload = () => extractThemeColors();
			//console.log("SUPER")
		}
	});

	$effect(() => {
		if ($isPlaying) {
			initAudioContext();
		}
	});

	onMount(() => {
		img = new Image();
		img.src = imageSrc;
		img.onload = () => extractThemeColors();
		isMount = true;
	});

	// Extraire les couleurs dominantes avec ColorThief
	async function extractThemeColors() {
		const colorThief = new ColorThief();
		if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
			const palette = colorThief.getPalette(img, 5); // Extraire 5 couleurs dominantes
			themeColors = palette.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);
		}
	}

	function initAudioContext() {
		if (!audioElement) {
			console.error('Aucun élément audio fourni au composant AudioVisualizer.');
			return;
		}
		if (audioContext == null) {
			audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

			const source = audioContext.createMediaElementSource(audioElement);
			analyser = audioContext.createAnalyser();
			analyser.fftSize = fftSize;

			source.connect(analyser);
			analyser.connect(audioContext.destination);

			drawVisualization();
		}
	}

	function drawVisualization() {
		if (!analyser || !canvasElement) return;

		const canvas = canvasElement;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = width;
		canvas.height = height;

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			switch (visualizationMode) {
				case 'waveform':
					drawWaveform(ctx, canvas);
					break;
				case 'frequency':
					drawFrequencyBars(ctx, canvas);
					break;
				case 'circular-frequency':
					drawCircularFrequency(ctx, canvas);
					if (imageSrc) {
						drawCenterImage(ctx, canvas);
					}
					break;
			}

			animationFrameId = requestAnimationFrame(draw);
		};

		draw();
	}

	function drawWaveform(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		const bufferLength = analyser!.fftSize;
		const dataArray = new Uint8Array(bufferLength);
		analyser!.getByteTimeDomainData(dataArray);

		ctx.lineWidth = 2;
		//ctx.strokeStyle = themeColors[0] || '#ff4500';

		ctx.beginPath();
		const sliceWidth = (canvas.width * 1.0) / bufferLength;
		let x = 0;

		for (let i = 0; i < bufferLength; i++) {
			const v = dataArray[i] / 128.0;
			const y = (v * canvas.height) / 2;

			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		ctx.lineTo(canvas.width, canvas.height / 2);
		ctx.stroke();
	}

	// Fonction pour déterminer la couleur en fonction de la hauteur
	function getColor(value, maxValue) {
		const range = maxValue / 5; // Diviser la plage en 5 parties
		if (value < range)
			return themeColors[0]; // Première plage
		else if (value < range * 2)
			return themeColors[1]; // Deuxième plage
		else if (value < range * 3)
			return themeColors[2]; // Troisième plage
		else if (value < range * 4)
			return themeColors[3]; // Quatrième plage
		else return themeColors[4]; // Cinquième plage
	}

	function drawFrequencyBars(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		const bufferLength = analyser!.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);
		analyser!.getByteFrequencyData(dataArray);

		const barWidth = (canvas.width / bufferLength) * 2.5;
		let x = 0;

		for (let i = 0; i < bufferLength; i++) {
			const barHeight = dataArray[i];
			const colorIndex = Math.floor((i / bufferLength) * themeColors.length);
			//ctx.fillStyle = themeColors[colorIndex] || themeColors[0];
			ctx.fillStyle = getColor(dataArray[i], 255);
			ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
			x += barWidth + 1;
		}
	}

	function drawCircularFrequency(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		const bufferLength = analyser!.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);
		analyser!.getByteFrequencyData(dataArray);

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const radius = imageSize / 2;
		const maxBarLength = imageSize / 2;
		const angleIncrement = (2 * Math.PI) / bufferLength;

		for (let i = 0; i < bufferLength; i++) {
			const value = dataArray[i];
			const barLength = (value / 255) * maxBarLength;
			const angle = i * angleIncrement;

			const xStart = centerX + radius * Math.cos(angle);
			const yStart = centerY + radius * Math.sin(angle);

			const xEnd = centerX + (radius + barLength) * Math.cos(angle);
			const yEnd = centerY + (radius + barLength) * Math.sin(angle);

			const colorIndex = Math.floor((i / bufferLength) * themeColors.length);
			//ctx.strokeStyle = themeColors[colorIndex] || themeColors[0];
			ctx.strokeStyle = getDynamicColor(value);
			ctx.lineWidth = 2;

			ctx.beginPath();
			ctx.moveTo(xStart, yStart);
			ctx.lineTo(xEnd, yEnd);
			ctx.stroke();
		}
	}

	// Générer une couleur dynamique
	function getDynamicColor(value: number) {
		const hueShift = (value / 255) * 360;
		return `hsl(${hueShift}, 70%, 50%)`;
	}

	function drawCenterImage(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const halfSize = imageSize / 2;

		if (img.complete) {
			ctx.save();
			ctx.beginPath();
			ctx.arc(centerX, centerY, halfSize, 0, Math.PI * 2);
			ctx.clip();
			ctx.drawImage(img, centerX - halfSize, centerY - halfSize, imageSize, imageSize);
			ctx.restore();
		}
	}

	onDestroy(() => {
		//cancelAnimationFrame(animationFrameId);
		audioContext?.close();
	});
</script>

<canvas bind:this={canvasElement}></canvas>

<style>
	canvas {
		display: block;
		margin: 0 auto;
	}
</style>
