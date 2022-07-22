import { browser } from '$app/env';
import { writable } from 'svelte/store';

export type Todo = {
	id: string;
	name: string;
	completed: boolean;
};

export const todos = writable<Todo[]>(
	browser ? JSON.parse(localStorage.getItem('todos') || '[]') : []
);
