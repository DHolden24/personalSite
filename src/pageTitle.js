import { watchEffect } from 'vue';
import { owner } from './site.js';

// Sets the browser tab title; pass a getter returning the page name, or nothing for the bare site name.
export function usePageTitle(getTitle = () => null) {
  watchEffect(() => {
    const title = getTitle();
    document.title = title ? `${title} · ${owner.name}` : owner.name;
  });
}
