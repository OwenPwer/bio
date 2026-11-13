export const DISCORD_USER_ID = import.meta.env.VITE_DISCORD_USER_ID;

if (!DISCORD_USER_ID) {
  console.warn('VITE_DISCORD_USER_ID не задан. Укажите его в .env');
}