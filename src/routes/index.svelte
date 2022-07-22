<script lang="ts">
	import { browser } from '$app/env';
	import { flip } from 'svelte/animate';
	import { nanoid } from 'nanoid';
	import clsx from 'clsx';
	import Icon from '@krowten/svelte-heroicons/Icon.svelte';
	import { dndzone } from 'svelte-dnd-action';

	import { todos } from '$lib/stores/todos';

	let name: string = '';
	const flipDurationMs = 300;

	if (browser) {
		todos.subscribe((todos) => {
			localStorage.setItem('todos', JSON.stringify(todos));
		});
	}

	function addTodo() {
		if (name.length > 0) {
			todos.update((todos) => [...todos, { id: nanoid(), name, completed: false }]);
		}
	}

	function removeTodo(id: string) {
		todos.update((todos) => todos.filter((todo) => todo.id !== id));
	}

	function handleSubmit() {
		addTodo();
		name = '';
	}

	function handleSort(e: any) {
		todos.update((todos) => [...e.detail.items]);
	}
</script>

<div class="w-[600px]">
	<form on:submit|preventDefault={handleSubmit}>
		<input
			type="text"
			name="name"
			id="name"
			bind:value={name}
			class="mb-6 py-4 shadow-sm bg-white/80 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
			placeholder="Add new task"
		/>
	</form>

	<div class="bg-white/80 rounded-md shadow-lg">
		<ul
			use:dndzone={{ items: $todos, flipDurationMs }}
			on:consider={handleSort}
			on:finalize={handleSort}
			class="space-y-4 p-4 h-[500px] max-h-[500px] overflow-y-auto"
		>
			{#each $todos as todo (todo.id)}
				<li
					class={clsx(
						'px-4 py-4 bg-white/90 shadow-lg rounded-md',
						todo.completed && 'bg-white/40'
					)}
					animate:flip={{ duration: flipDurationMs }}
				>
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<input
								class="focus:ring-indigo-500 mr-3 h-4 w-4 text-indigo-600 border-gray-300 rounded"
								type="checkbox"
								bind:checked={todo.completed}
							/>
							<span class={clsx('text-gray-700', todo.completed && 'line-through text-gray-400')}
								>{todo.name}</span
							>
						</div>

						<div class="flex items-center">
							<button
								on:click={() => removeTodo(todo.id)}
								class="rounded-full p-2 bg-red-600/30 hover:bg-red-600/40 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
							>
								<Icon name="trash" class="h-3.5 w-3.5 text-red-500" />
							</button>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
