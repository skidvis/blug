import { spawn } from 'node:child_process';

const DEFAULT_GIT_NAME = 'blug';
const DEFAULT_GIT_EMAIL = 'blug@localhost';

export function triggerDeployForPost(slug: string) {
  const cwd = process.cwd();
  const name = process.env.GIT_AUTHOR_NAME || DEFAULT_GIT_NAME;
  const email = process.env.GIT_AUTHOR_EMAIL || DEFAULT_GIT_EMAIL;

  const steps = [
    ['git', ['-C', cwd, 'add', `src/content/blog/${slug}.md`, 'public/uploads/']],
    ['git', ['-C', cwd, `-c`, `user.name=${name}`, `-c`, `user.email=${email}`, 'commit', '-m', `Post: ${slug}`, '--allow-empty']],
    ['git', ['-C', cwd, 'push', 'origin', 'main']],
  ] as const;

  // Run sequentially in the background; caller gets an immediate response.
  (async () => {
    for (const [cmd, args] of steps) {
      const ok = await new Promise<boolean>((resolve) => {
        const child = spawn(cmd, args, { stdio: 'pipe' });
        child.on('close', (code) => resolve(code === 0));
        child.on('error', () => resolve(false));
      });
      if (!ok) {
        console.error(`Deploy step failed: ${cmd} ${args.join(' ')}`);
        return;
      }
    }
  })();

  return { ok: true as const };
}
