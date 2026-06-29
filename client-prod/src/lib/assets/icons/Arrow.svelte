<script lang="ts">
	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class={className}>
	<path
		d="m268 112 144 144-144 144M392 256H100"
		fill="none"
		stroke="currentColor"
		stroke-linecap="square"
		stroke-miterlimit="10"
		stroke-width="48px"
	/>
</svg>
