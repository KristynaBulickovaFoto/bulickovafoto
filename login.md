adapterFn is not a function
 when i am on admin without being logged in it shows this
The user is getting an error "adapterFn is not a function" when the proxy tries to run. This is likely related to how Supabase SSR client is being created in the middleware/proxy context. Let me check the Supabase client setup and see if there's a compatibility issue.

The error "adapterFn is not a function" suggests something is wrong with the Supabase SSR cookie adapter. Let me check the Supabase packages and how the client is created.

Bash Check Supabase package versions
IN
cat package.json | grep -E "supabase|ssr"

OUT
    "@supabase/ssr": "^0.10.2",
    "@supabase/supabase-js": "^2.103.0",
    "supabase": "^2.91.0",
Read c:\Users\YOGA\Desktop\Programming\kristynabulickova\src\lib\supabase\client.ts
Read c:\Users\YOGA\Desktop\Programming\kristynabulickova\src\lib\supabase\server.ts
The issue is with @supabase/ssr version ^0.10.2. This is a newer version that likely changed the API for cookie handling. The createServerClient in the proxy/middleware context might be using a different cookie adapter pattern.

Let me check what version 0.10.x expects. The error "adapterFn is not a function" suggests the cookie adapter format changed in this version. Let me look at the actual installed version and the source.

Bash Check actual installed @supabase/ssr version
IN
cat /c/Users/YOGA/Desktop/Programming/kristynabulickova/node_modules/@supabase/ssr/package.json | grep '"version"'

OUT
  "version": "0.10.2",
Grep "createServerClient" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\@supabase\ssr\dist, glob: *.d.ts)
9 lines of output
Read c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\@supabase\ssr\dist\main\createServerClient.d.ts
Read c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\@supabase\ssr\dist\main\types.d.ts
I see the issue. The SetAllCookies type signature in @supabase/ssr@0.10.2 has changed — it now takes a second headers parameter:


export type SetAllCookies = (cookies: {
    name: string;
    value: string;
    options: CookieOptions;
}[], headers: Record<string, string>) => Promise<void> | void;
But our setAll in the middleware only handles the first parameter (cookies). However, I'm not sure that's the cause of "adapterFn is not a function".

Let me trace through the source code to find where adapterFn is actually being called and what's going wrong.

Grep "adapterFn" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\@supabase)
1 line of output
Grep "adapterFn" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules)
1 line of output
Grep "adapterFn" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next)
7 lines of output
Now I see the issue. In Next.js 16's source code:


const adapterFn = middlewareModule.default || middlewareModule;
It's looking for middlewareModule.default first, then middlewareModule itself. This means Next.js is looking for a default export or treating the module as a function.

But our proxy.ts exports a named proxy function, not a default export. The docs say either works:

"The file must export a single function, either as a default export or named proxy."

The runtime code isn't checking for middlewareModule.proxy at all—it's only looking for default or the module itself. This suggests there might be a separate code path for proxy files that I need to track down.

Found it. The Next.js runtime code at next-server.js:1186:


const adapterFn = middlewareModule.default || middlewareModule;
It looks for a default export, not a named proxy export. Let me check more context.

Read c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\server\next-server.js (lines 1176-1205)
Now I understand the full picture. The Next.js 16 runtime for Node.js middleware works differently than expected:

It first looks for middlewareModule.default as the adapterFn (line 1186)
Then it calls adapterFn with an object that includes handler: middlewareModule.proxy || middlewareModule.middleware || middlewareModule (line 1193)
So the architecture is:

There's an adapter function (default export) that receives an object with { handler, request, page }

The handler is the actual proxy/middleware function (named proxy or middleware)

The default export needs to be an adapter that accepts the handler and processes the request, while the named proxy export is what actually gets passed in as the handler itself.

Looking at the code more carefully, adapterFn is being called with the handler as a parameter, which means Next.js expects the default export to be a function that wraps the user's proxy handler. This could be a built-in adapter from Next.js or something that gets compiled during the build process. Let me check if there's an adapter available from the Next.js server utilities.

Now I see the architecture. The runtime at line 1192-1193:


result = await adapterFn({
    handler: middlewareModule.proxy || middlewareModule.middleware || middlewareModule,
    ...
});
Next.js expects a default export adapter function, and the named proxy export is passed as the handler. Let me check if Next.js provides an adapter.

Grep "loadNodeMiddleware" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\server\next-server.js)
67 lines of output
OK, so at line 1072:


return require((0, _path.join)(this.distDir, 'server', 'middleware.js'));
It's loading the compiled middleware.js from the build output. The compiled file would include an adapter wrapper that Next.js generates during build. The user-authored proxy.ts gets compiled into this.

So the issue might be that the build isn't properly compiling the proxy file. Or there's a mismatch in how the file is handled during dev mode.

Let me check what the compiled middleware.js looks like in the .next directory, or check if the dev server handles this differently.

In dev mode, Next.js probably compiles the proxy.ts and wraps it with an adapter, so the default export from the compiled module should be that adapter. I should look into whether Next.js has a built-in adapter I need to account for.

Grep "proxy.*adapter|middleware.*adapter|nodeMiddlewareAdapter" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\server)
8 lines of output
Grep "nodeMiddlewareAdapter|node-middleware-adapter|NodeMiddleware" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist)
21 lines of output
Grep "nodeMiddlewareAdapter" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\build\utils.js)
1 line of output
Grep "NodeMiddleware" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\build\utils.js)
15 lines of output
Grep "nodeMiddleware|node-proxy-handler" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\build\index.js)
1 line of output
Grep "NodeMiddleware|hasNodeMiddleware|middleware\.js" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\build\index.js)
61 lines of output
Now I see something key. Let me look at what isProxyFile does and how proxy files get compiled. It seems like Next.js identifies proxy files, then compiles them with some adapter. The compiled middleware.js in .next/server/ should have a default export that's the adapter function.

Let me check what the compiled middleware.js looks like in dev mode (if it exists).

But actually, I think the issue is simpler than I'm making it. Let me look at the loading in dev mode vs production:


// line 1066-1072
if (this.dev || ...) {


In dev mode, it requires the compiled middleware.js from .next/server/. The build system should compile src/proxy.ts → .next/server/middleware.js with appropriate wrapper.

Let me check if the .next directory has this file.

Bash Check if compiled middleware.js exists in build output
IN
ls -la /c/Users/YOGA/Desktop/Programming/kristynabulickova/.next/server/middleware.js 2>&1

OUT
Exit code 2
ls: cannot access '/c/Users/YOGA/Desktop/Programming/kristynabulickova/.next/server/middleware.js': No such file or directory
Bash List build output server directory
IN
ls /c/Users/YOGA/Desktop/Programming/kristynabulickova/.next/server/ 2>&1 | head -30

OUT
app
app-paths-manifest.json
chunks
edge
functions-config-manifest.json
interception-route-rewrite-manifest.js
middleware
middleware-build-manifest.js
middleware-manifest.json
next-font-manifest.js
next-font-manifest.json
pages
pages-manifest.json
prefetch-hints.json
server-reference-manifest.js
server-reference-manifest.json
There's a middleware directory but no middleware.js file. The compiled proxy was being processed as an edge middleware (put in middleware/ directory) instead of a Node.js middleware file.

Let me check what's in the middleware directory and the middleware-manifest.json.

Bash Check middleware directory contents
IN
ls -la /c/Users/YOGA/Desktop/Programming/kristynabulickova/.next/server/middleware/ 2>&1

OUT
total 8
drwxr-xr-x 1 YOGA 197121    0 Apr 16 10:18 .
drwxr-xr-x 1 YOGA 197121    0 Apr 16 10:18 ..
-rw-r--r-- 1 YOGA 197121 1536 Apr 16 10:18 middleware-manifest.json
Read c:\Users\YOGA\Desktop\Programming\kristynabulickova\.next\server\middleware-manifest.json
Now I see the issue clearly. The middleware-manifest.json shows that the proxy is being compiled as an Edge middleware (running in the edge runtime), not as a Node.js middleware. The functions object is empty, meaning there's no Node.js middleware registered.

The problem is that our proxy uses createServerClient from @supabase/ssr which relies on Node.js APIs. But the proxy file is being compiled for the Edge Runtime by default.

Looking back at the build code:


if (staticInfo.runtime === 'nodejs' || (0, _utils1.isProxyFile)(page)) {


So proxy files should automatically get Node.js runtime during next build, but in dev mode with Turbopack it's being compiled as edge middleware instead. The "adapterFn is not a function" error is coming from the Node.js server code path, but since the proxy is running as edge middleware, that path shouldn't even be triggered. Let me look more closely at what the manifest is actually registering.

The server code only tries to load Node middleware when !middlewareInfo — meaning when edge middleware isn't found. But the manifest shows it IS registered. I'm wondering if the .next build output is stale from before we moved the file, or if the dev server picked up the new location but compiled it incorrectly. The user probably needs to restart the dev server to clear out the old build artifacts.

Actually, the "adapterFn is not a function" error is a runtime error that would only come from the Node.js code path. If the manifest shows edge middleware is registered, then the dev server should be using that path instead. Maybe there's a fallback happening somewhere, or the edge wrapper isn't exporting what the middleware loader expects.

Wait, let me reconsider. The user said the error appears when they're on the admin page without being logged in. That could mean the error is happening in the browser if the dev server crashed, or it's a server-side error in the terminal. The real issue might be simpler though — the .next cache is probably stale from the old middleware build. Since we moved the file from the root to src/, the dev server's cached artifacts are outdated and need to be cleared.

Let me verify there's no lingering middleware.ts file at the root or in src/ that could be causing confusion. I should also check if next.config.ts has any settings that might affect how the middleware or proxy is being resolved.

The .next cache is stale from the old build. The proxy file was moved but the cache still has the old compiled edge middleware. Let me check the next config and then clean the cache.

Read c:\Users\YOGA\Desktop\Programming\kristynabulickova\next.config.ts
Ok, looking at the build code again:


if (staticInfo.runtime === 'nodejs' || (0, _utils1.isProxyFile)(page)) {
    hasNodeMiddleware = true;
Proxy files are treated as Node.js middleware. The isProxyFile function identifies them. But in dev mode with Turbopack, it seems the file is being compiled as edge middleware instead.

Looking at the middleware-manifest.json, the compiled entry is in server/edge/chunks/ — clearly edge runtime.

The runtime error "adapterFn is not a function" happens because:

The edge middleware can't access Node.js APIs that Supabase's createServerClient requires, like cookies. Or there's a second pass where the code tries to run through the Node.js middleware path. Let me look at the build logic more carefully — this condition checks if the runtime is explicitly Node.js OR if it's a proxy file, which should trigger Node.js middleware. But in dev mode with Turbopack, something's causing it to compile as edge instead.

The docs say proxy files default to Node.js runtime, and the build code confirms proxy files should use Node.js middleware. So the issue is likely that Turbopack in dev mode isn't respecting this default and is treating it as edge instead. I should look for a way to explicitly force it to build as Node.js middleware.

The most practical solution is probably to clear the .next cache and restart the dev server with a clean slate, since we just moved the file. But I also need to verify the file is in the correct location and has the proper exports. Let me check how the build code actually locates the proxy file to make sure it's being detected properly.

Grep "isProxyFile|proxyFilePath|middlewareFilePath" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\build\index.js)
61 lines of output
Now I see the detection logic:


const isAtConventionLevel = normalizedFileDir === '/' || normalizedFileDir === '/src';
if (isAtConventionLevel && fileBaseName === PROXY_FILENAME) {
    proxyFilePath = rootPath;
}
So it looks for the proxy file at either / or /src level, and the base name must match PROXY_FILENAME. This is the production build path. In dev mode with Turbopack, the detection might work differently.

The key question is: why is the dev server compiling it as edge middleware instead of Node.js middleware?

Let me trace back to the actual error—when running npm run dev with Turbopack, the middleware module is being loaded but middlewareModule.default and middlewareModule are both not functions. The module exists but doesn't have the expected export shape. In production, Next.js loads the compiled middleware from .next/server/, but in dev mode with Turbopack something's going wrong with how the module is being resolved or compiled.

I'm thinking the issue could be either a stale .next cache from before the file was moved, or the dev server not picking up the new middleware location properly. The quickest fix would be to clear .next and restart, but I suspect the real problem is how Turbopack is handling the middleware compilation in dev mode. The user moved the file and needs to restart the dev server to clear the stale .next cache from before the migration. I'm checking whether the old middleware.ts is still lingering—git status shows it was untracked and we renamed it to proxy.ts in src/, so there shouldn't be a root-level conflict. The real issue is likely that Turbopack is still compiling against the old cached build, so deleting .next and rebuilding should resolve it. Let me verify that the dev server properly recognizes src/proxy.ts as an edge function.

The .next cache is stale from before the file was moved. Let me clean it and rebuild to see if that fixes things.

Bash Delete stale .next build cache
IN
rm -rf /c/Users/YOGA/Desktop/Programming/kristynabulickova/.next

OUT
Exit code 1
rm: cannot remove '/c/Users/YOGA/Desktop/Programming/kristynabulickova/.next/dev': Directory not empty
Bash Force delete .next cache
IN
rm -rf /c/Users/YOGA/Desktop/Programming/kristynabulickova/.next 2>&1 || true

OUT
rm: cannot remove '/c/Users/YOGA/Desktop/Programming/kristynabulickova/.next/dev': Directory not empty
The dev server is still running and locking the .next directory.

Stop the dev server first (Ctrl+C in the terminal where npm run dev is running), then run:


rm -rf .next && npm run dev
But while we wait, let me also check if there's a deeper issue. The build code shows that in production, proxy files automatically get Node.js runtime. But in Turbopack dev mode, the manifest shows it's running as Edge middleware. Let me check if the Supabase client works in Edge or if we need to explicitly set Node.js runtime.

Grep "runtime.*nodejs|export.*config.*runtime" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\docs\01-app\03-api-reference\03-file-conventions\proxy.md)
1 line of output
Grep "runtime|Runtime|edge|Edge|nodejs" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\docs\01-app\03-api-reference\03-file-conventions\proxy.md)
35 lines of output
The docs say: "Proxy defaults to using the Node.js runtime."

But in the build code:


if (staticInfo.runtime === 'nodejs' || (0, _utils1.isProxyFile)(page)) {
    hasNodeMiddleware = true;
For production build, if it's a proxy file, it's treated as Node.js middleware. But in dev mode with Turbopack, the manifest shows it's being compiled as Edge middleware. This might be a Turbopack bug or different behavior.

The error "adapterFn is not a function" is thrown when trying to access the middleware module, but the error handling suggests that if the module doesn't load, it should throw "MiddlewareNotFoundError" instead. So the proxy must be loading something, just not what the Node.js code path expects—maybe the Edge-compiled version is being loaded when the Node.js adapter tries to use it.

Looking at the loadNodeMiddleware() function, in dev mode it's checking for a middleware file and requiring it directly. The issue is likely that in dev, the function is returning the Edge-compiled middleware module instead of a Node.js-compatible one, which doesn't have a proper default export that's a function. I think the issue is that Turbopack compiled src/proxy.ts into .next/server/middleware.js, but it's missing the default export wrapper that the runtime expects—our file only exports proxy and config as named exports, not a default function. The docs indicate the middleware file needs either a default export or a named proxy export, so I need to add the proper default export to fix this.

Grep "node.*wrapper|nodeProxyHandler|node-proxy" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\build)
5 lines of output
Grep "middleware.*adapter|adapter.*middleware|proxyHandler|proxy.*handler" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\server, glob: *.js)
2 lines of output
Grep "node-proxy-handler|nodeProxyHandler|nodeMiddlewareHandler" (in c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist)
1 line of output
Globpattern: "node_modules/next/dist/server/*middleware*"
No files found
Globpattern: "node_modules/next/dist/server/web/*"
Found 33 files
Read c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\server\web\adapter.d.ts
Now I see it. The adapter function from next/dist/server/web/adapter.js takes AdapterOptions which includes a handler function. The Node.js middleware code path at line 1192 does:


result = await adapterFn({
    handler: middlewareModule.proxy || middlewareModule.middleware || middlewareModule,
    request: { ... },
    page: 'middleware'
});
So adapterFn should be the adapter function from next/dist/server/web/adapter.js. During the build process, Next.js would normally compile the proxy file and create a middleware.js that has this adapter as the default export.

In dev mode with Turbopack, the compilation might work differently, but the compiled middleware file should import the adapter and the user's proxy file, then export a function that calls the adapter with the appropriate handler and options. I'm trying to understand what's actually being executed when we run this in development.

The "adapterFn is not a function" error tells me that Turbopack is creating the middleware file (otherwise we'd get a different error), but it's probably not wrapping it with the adapter correctly. My guess is that Turbopack is only exporting the user's exports without the adapter wrapper, so when the code tries to get the default export and falls back to the module itself, it's trying to call an object as a function instead of getting a callable function.

Let me try switching to a default export in the proxy file so that middlewareModule.default actually points to the adapter function. But wait — the adapter signature expects { handler, request, page }, not just a NextRequest, so a simple default export wouldn't match that signature. Looking at the runtime code, it's trying to call adapterFn with a handler object and request, which means the adapter needs to be a wrapper function that accepts those parameters and then calls the actual middleware handler inside.

The real issue is that when the file only exports proxy and config, the runtime gets back an object instead of a function, so calling adapterFn(...) fails. The production build must wrap this with an adapter as the default export, but in dev mode with Turbopack that wrapper isn't being applied.

I could try importing the adapter directly from Next.js internals and exporting it as default, though I'm not sure if that's the right approach or if there's a simpler solution. Let me think about whether this is actually a Turbopack-specific issue or something about how the project is configured.

Now I'm looking at what the edge wrapper template looks like — that's what Next.js uses internally for edge middleware compilation.

Globpattern: "node_modules/next/dist/**/templates/*edge*"
Found 24 files
Globpattern: "node_modules/next/dist/**/templates/*middleware*"
Found 5 files
Globpattern: "node_modules/next/dist/**/templates/*proxy*"
No files found
Read c:\Users\YOGA\Desktop\Programming\kristynabulickova\node_modules\next\dist\build\templates\middleware.js
Now I understand the full picture. This is the template file at node_modules/next/dist/build/templates/middleware.js. During build, Next.js replaces VAR_USERLAND with the path to the user's proxy file and VAR_DEFINITION_PAGE with the page name.

The template:

Imports the user's proxy module as _VAR_USERLAND (which would be our src/proxy.ts)

Creates mod = { ..._VAR_USERLAND }

Determines if we're dealing with a proxy file, then extracts the appropriate handler (either proxy, middleware, or default)

Wraps that handler with an adapter and exports both the wrapped handler as default and a secondary handler function, so the compiled middleware in .next/server/ has everything it needs to execute.

Now looking at the runtime code, I'm seeing a mismatch—the internalHandler function receives opts and spreads them into the adapter call along with additional context like IncrementalCache and the page, but the runtime is trying to pass { handler: middlewareModule.proxy } directly to adapterFn. The template's internalHandler actually expects to receive opts and then enriches it with the handler and other metadata before calling the adapter. rides it with the wrapped handler. The adapterFn is the bridge that connects the runtime's handler to the template's error handling.

So the real problem is that in dev mode with Turbopack, the middleware compilation works differently than in production builds with webpack. Turbopack compiles the proxy file as edge middleware in the .next directory, but there's no corresponding Node.js middleware.js file that the template expects to find.

When a request comes in, the edge middleware runs first since it's registered in the manifest, but if it fails or isn't invoked for some reason, the server falls back to looking for the Node.js middleware file. That's where it breaks — the file doesn't exist or doesn't have the expected default export, so adapterFn ends up undefined.

The real issue might be that Turbopack is treating the proxy file as Node.js-only and never adding it to the edge middleware manifest in the first place, so the server always tries the Node.js path and fails when the compiled file isn't there. The page variable needs to match either /proxy or /src/proxy for the detection to work, so if the file is at src/proxy.ts, it should resolve correctly. But if VAR_DEFINITION_PAGE isn't being set properly by the build system, that could be the culprit. I think the most likely issue is that the .next cache is stale from before moving the file, so clearing it and restarting the dev server should fix it. There might also be a deeper issue with how Turbopack handles proxy files in this version, so I should explore alternative patterns that work more reliably.

Looking at this more carefully, the user said "still" — meaning my previous fix of renaming the export didn't work. They're getting "adapterFn is not a function" even after that change, which suggests the dev server might not have been restarted, or there's something else going on with how the proxy is being loaded.

Let me reconsider the options. The safest bet is probably to go back to middleware.ts with the standard export, since that's the convention Next.js has the most support for, even if it's technically deprecated. The new proxy.ts convention might not be fully working in dev mode with Turbopack yet. The real problem might be that Turbopack doesn't support Node.js runtime for middleware/proxy during development, though the Supabase server client should work fine in edge runtime since it uses the standard NextRequest/NextResponse cookie APIs. Let me try a different approach entirely — moving the auth logic to the layout level instead.

Actually, let me first check if just adding a default export resolves the adapterFn error before switching strategies.

I found the root cause. Looking at the Node.js middleware template at node_modules/next/dist/build/templates/middleware.js, the compiled middleware needs a default export that wraps the adapter. In dev mode (Turbopack), this wrapping might not happen correctly.

Let me try a more reliable approach — implement auth protection at the layout level instead of relying on proxy/middleware, which has compilation issues with Turbopack.

Read c:\Users\YOGA\Desktop\Programming\kristynabulickova\src\app\admin\layout.tsx
Read c:\Users\YOGA\Desktop\Programming\kristynabulickova\src\app\klient\layout.tsx