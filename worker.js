const EXPIRING_LINKS = {
  "/91e5a53455.html": Date.parse("2026-06-21T03:00:00Z"),
};

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const expiresAt = EXPIRING_LINKS[pathname];
    if (expiresAt && Date.now() > expiresAt) {
      return new Response("This link has expired.", {
        status: 410,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
