<script lang="ts">
	import { onMount } from 'svelte';
	import { addDays, format, isAfter, parseISO, set, startOfDay } from 'date-fns';

	import type { Reservation } from '../../../../shared/types/Reservation';

	import { fetchMyReservations } from '$lib/api/reservations';
	import Calendar from '$lib/assets/icons/Calendar.svelte';
	import Clock from '$lib/assets/icons/Clock.svelte';
	import Ticket from '$lib/assets/icons/Ticket.svelte';

	let reservations = $state<Reservation[]>([]);
	let view = $state<'upcoming' | 'past'>('upcoming');
	let isLoading = $state(true);
	let error = $state('');

	let hasLoaded = false;

	const getMeetAt = (reservation: Reservation) => {
		const submittedAt = parseISO(reservation.submittedAt);
		const submittedDay = startOfDay(submittedAt);

		let meetDay = submittedDay;

		if (reservation.meet.dayLabel.toLowerCase() === 'tomorrow') {
			meetDay = addDays(submittedDay, 1);
		}

		const [hours, minutes] = reservation.meet.time.split(':').map(Number);

		return set(meetDay, {
			hours,
			minutes,
			seconds: 0,
			milliseconds: 0
		});
	};

	const formatMeetTime = (reservation: Reservation) => format(getMeetAt(reservation), 'h:mm a');

	const formatMeetDate = (reservation: Reservation) =>
		format(getMeetAt(reservation), 'EEEE, MMMM d');

	const statusLabel = (status: Reservation['status']) => {
		switch (status) {
			case 'submitted':
				return 'Pending';
			case 'confirmed':
				return 'Confirmed';
			case 'completed':
				return 'Completed';
			case 'cancelled':
				return 'Cancelled';
			default:
				return status;
		}
	};

	const statusClasses = (status: Reservation['status']) => {
		switch (status) {
			case 'confirmed':
				return 'border-success/40 bg-success-background text-success';
			case 'completed':
				return 'border-accent/40 bg-accent/10 text-accent';
			case 'cancelled':
				return 'border-error/40 bg-error-background text-error';
			default:
				return 'border-warning/40 bg-warning-background text-warning';
		}
	};

	onMount(async () => {
		if (hasLoaded) return;

		hasLoaded = true;
		try {
			reservations = await fetchMyReservations();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unable to load your reservations.';
		} finally {
			isLoading = false;
		}
	});

	let upcomingReservations = $derived(
		reservations.filter((reservation) => {
			if (reservation.status === 'completed' || reservation.status === 'cancelled') {
				return false;
			}

			return isAfter(getMeetAt(reservation), new Date());
		})
	);

	let pastReservations = $derived(
		reservations.filter((reservation) => {
			if (reservation.status === 'completed' || reservation.status === 'cancelled') {
				return true;
			}

			return !isAfter(getMeetAt(reservation), new Date());
		})
	);

	let visibleReservations = $derived(view === 'upcoming' ? upcomingReservations : pastReservations);
</script>

<svelte:head>
	<title>Reservations | Bayou Boy Exotics</title>
</svelte:head>

<section class="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
	<div class="mb-8">
		<p class="mb-2 text-xs font-semibold tracking-[0.32em] text-accent uppercase">Your Account</p>

		<h1 class="text-3xl font-bold sm:text-4xl">Reservations</h1>

		<p class="mt-3 max-w-2xl text-sm leading-6 text-muted">
			Keep track of your upcoming reservations and review your reservation history.
		</p>
	</div>

	<div class="mb-7 grid grid-cols-2 rounded-vintage border border-border bg-black/20 p-1">
		<button
			type="button"
			on:click={() => (view = 'upcoming')}
			class="rounded-lg px-4 py-3 text-sm font-semibold transition"
			class:bg-surface={view === 'upcoming'}
			class:text-accent={view === 'upcoming'}
			class:text-muted={view !== 'upcoming'}
		>
			Upcoming
			<span class="ml-1 text-xs opacity-70">
				{upcomingReservations.length}
			</span>
		</button>

		<button
			type="button"
			on:click={() => (view = 'past')}
			class="rounded-lg px-4 py-3 text-sm font-semibold transition"
			class:bg-surface={view === 'past'}
			class:text-accent={view === 'past'}
			class:text-muted={view !== 'past'}
		>
			Past
			<span class="ml-1 text-xs opacity-70">
				{pastReservations.length}
			</span>
		</button>
	</div>

	{#if isLoading}
		<div
			class="flex min-h-52 items-center justify-center rounded-vintage border border-border bg-black/20"
		>
			<div class="flex items-center gap-3 text-muted">
				<span class="text-sm">Loading reservations...</span>
			</div>
		</div>
	{:else if error}
		<div class="rounded-vintage border border-error/30 bg-error-background p-5">
			<p class="text-sm text-error">{error}</p>
		</div>
	{:else if visibleReservations.length === 0}
		<div class="rounded-vintage border border-border bg-black/20 px-6 py-14 text-center">
			<div
				class="mx-auto flex size-12 items-center justify-center rounded-vintage border border-border bg-surface"
			>
				<Calendar class="size-5 text-accent" />
			</div>

			<h2 class="mt-4 text-xl font-semibold">
				{view === 'upcoming' ? 'No upcoming reservations' : 'No past reservations'}
			</h2>

			<p class="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
				{view === 'upcoming'
					? 'Your next reservation will appear here once you submit a request.'
					: 'Your reservation history will appear here.'}
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each visibleReservations as reservation (reservation.reservationId)}
				<article
					class="overflow-hidden rounded-vintage border border-border bg-black/25 shadow-soft"
				>
					<div
						class="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-start sm:justify-between"
					>
						<div>
							<div class="flex flex-wrap items-center gap-3">
								<h2 class="text-xl font-semibold">
									{formatMeetDate(reservation)}
								</h2>

								<span
									class={`rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${statusClasses(
										reservation.status
									)}`}
								>
									{statusLabel(reservation.status)}
								</span>
							</div>

							<div class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
								<span class="flex items-center gap-2">
									<Clock class="size-4 text-accent" />
									{formatMeetTime(reservation)}
								</span>

								{#if reservation.meet.label}
									<span>{reservation.meet.label}</span>
								{/if}
							</div>
						</div>

						<p class="text-xl font-bold text-accent">
							${reservation.total}
						</p>
					</div>

					<div class="px-5 py-5">
						<div class="mb-3 flex items-center gap-2">
							<Ticket class="size-4 text-accent" />

							<p class="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Reservation</p>
						</div>

						<div class="space-y-2">
							{#each reservation.items as item (item.id)}
								<div class="flex items-start justify-between gap-4 text-sm">
									<div class="min-w-0">
										<p class="font-medium text-foreground">
											{item.listingName}
										</p>

										<p class="mt-0.5 text-xs text-muted">
											{item.priceLabel}
										</p>
									</div>

									{#if item.price}
										<p class="shrink-0 font-semibold">
											${item.price}
										</p>
									{/if}
								</div>
							{/each}
						</div>

						{#if reservation.status === 'confirmed' && reservation.meetupAddress}
							<div class="mt-5 rounded-vintage border border-accent/20 bg-surface/50 p-4">
								<p class="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
									Meet Location
								</p>

								<p class="mt-2 text-sm text-foreground">
									{reservation.meetupAddress}
								</p>
							</div>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>
