<template>
  <!--
    AdminLayout — sidebar + header shell for all admin pages.

    Dark mode: uses data-theme-toggle / data-icon-sun / data-icon-moon
    data-attributes instead of ids, because both the mobile bar and the
    desktop header render toggle buttons in the same document. The
    AdminPageLayout script uses querySelectorAll('[data-theme-toggle]')
    to wire all instances at once.
  -->
  <div class="min-h-screen bg-base-200 text-base-content">
    <div class="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" class="drawer-toggle" />

      <!-- ═══════ Main content ═══════════════════════════════════ -->
      <div class="drawer-content flex min-h-screen flex-col">

        <!-- Mobile top bar -->
        <div class="navbar sticky top-0 z-30 border-b border-base-300/50 bg-base-100/90 px-4 backdrop-blur-md lg:hidden">
          <div class="flex-none">
            <label for="admin-drawer" class="btn btn-ghost btn-square" aria-label="Open navigation">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="4" y1="6"  x2="20" y2="6"/>
                <line x1="4" y1="12" x2="20" y2="12"/>
                <line x1="4" y1="18" x2="20" y2="18"/>
              </svg>
            </label>
          </div>
          <div class="flex-1 px-2 text-base font-bold text-base-content">
            blug admin
          </div>
          <!-- Dark mode toggle — mobile -->
          <button
            data-theme-toggle
            type="button"
            class="btn btn-ghost btn-square"
            aria-label="Toggle dark mode"
          >
            <svg data-icon-sun xmlns="http://www.w3.org/2000/svg" class="hidden h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
            <svg data-icon-moon xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </div>

        <!-- Desktop page header -->
        <header class="hidden border-b border-base-300/50 bg-base-100/90 px-6 py-4 backdrop-blur-md lg:flex lg:items-center lg:justify-between">
          <div class="space-y-0.5">
            <p class="eyebrow">blug admin</p>
            <h1 class="text-xl font-bold text-base-content">{{ title }}</h1>
          </div>
          <div class="flex items-center gap-2">
            <!-- Dark mode toggle — desktop -->
            <button
              data-theme-toggle
              type="button"
              class="nav-link"
              aria-label="Toggle dark mode"
            >
              <svg data-icon-sun xmlns="http://www.w3.org/2000/svg" class="hidden h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
              <svg data-icon-moon xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>

            <!-- Logout -->
            <form method="POST" action="/api/auth/logout">
              <button
                type="submit"
                class="inline-flex items-center gap-1.5 rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm font-medium text-base-content/60 shadow-card transition-all duration-150 hover:border-error/30 hover:text-error"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </form>
          </div>
        </header>

        <!-- Page content -->
        <main class="flex-1 p-4 lg:p-6">
          <slot />
        </main>
      </div>

      <!-- ═══════ Sidebar ════════════════════════════════════════ -->
      <div class="drawer-side z-40">
        <label for="admin-drawer" aria-label="Close navigation" class="drawer-overlay"></label>

        <aside class="flex min-h-full w-64 flex-col border-r border-base-300/50 bg-base-100 p-5">

          <!-- Sidebar brand -->
          <a
            href="/"
            class="mb-6 flex items-center gap-2.5 font-extrabold tracking-tight text-base-content"
          >
            <span
              class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-content text-sm font-black"
              aria-hidden="true"
            >B</span>
            <span>blug admin</span>
          </a>

          <!-- Nav items -->
          <nav class="flex flex-col gap-1" aria-label="Admin navigation">

            <a
              href="/admin/posts"
              :class="[
                'nav-link',
                currentPath === '/admin/posts' ? 'nav-link-active' : '',
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              All posts
            </a>

            <a
              href="/admin/posts/new"
              :class="[
                'nav-link',
                currentPath === '/admin/posts/new' ? 'nav-link-active' : '',
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New post
            </a>
          </nav>

          <!-- Spacer -->
          <div class="flex-1" />

          <!-- Bottom links -->
          <div class="flex flex-col gap-1 border-t border-base-300/60 pt-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              class="nav-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              View site
            </a>

            <!-- Logout (mobile sidebar) -->
            <form method="POST" action="/api/auth/logout" class="lg:hidden">
              <button
                type="submit"
                class="nav-link w-full text-left text-error/80 hover:bg-error/6 hover:text-error"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  currentPath: string;
}>();
</script>
