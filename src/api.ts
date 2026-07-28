import type { Recipe, Note } from "@/types";

const BASE = "/api";

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ statusMessage: res.statusText }));
    throw new Error(err.statusMessage || "Request failed");
  }
  return res.json();
}

export async function getRecipes(): Promise<Recipe[]> {
  return fetchJSON<Recipe[]>(`${BASE}/recipes`);
}

export async function getRecipe(id: number): Promise<Recipe> {
  return fetchJSON<Recipe>(`${BASE}/recipes/${id}`);
}

export async function getNotes(recipeId: number): Promise<Note[]> {
  return fetchJSON<Note[]>(`${BASE}/recipes/${recipeId}/notes`);
}

export async function createNote(recipeId: number, content_markdown: string): Promise<Note> {
  return fetchJSON<Note>(`${BASE}/recipes/${recipeId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content_markdown }),
  });
}

export async function updateNote(noteId: number, content_markdown: string): Promise<Note> {
  return fetchJSON<Note>(`${BASE}/notes/${noteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content_markdown }),
  });
}

export async function deleteNote(noteId: number): Promise<void> {
  await fetchJSON<void>(`${BASE}/notes/${noteId}`, { method: "DELETE" });
}

// --- Auth ---

export async function checkAuth(): Promise<boolean> {
  const res = await fetchJSON<{ authenticated: boolean }>(`${BASE}/auth/me`);
  return res.authenticated;
}

export async function login(password: string): Promise<void> {
  await fetchJSON(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
}

export async function logout(): Promise<void> {
  await fetchJSON(`${BASE}/auth/logout`, { method: "POST" });
}
