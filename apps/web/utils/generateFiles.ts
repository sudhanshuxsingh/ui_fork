export function generateFiles({
  demoComponentName,
  componentSlug,
  relativeImportPath,
  code,
  demoCode,
  theme,
}: {
  demoComponentName: string
  componentSlug: string
  relativeImportPath: string
  code: string
  demoCode: string
  theme: "light" | "dark"
}) {

  const files = {
    "/App.tsx": `
import React from 'react';
import Variants, { ${demoComponentName} } from './demo';
import { ThemeProvider } from './next-themes';
import { RouterProvider } from 'next/router';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="${theme}" enableSystem={false}>
      <RouterProvider>
        <div className="flex items-center h-screen m-auto justify-center">
          <div className="bg-background text-foreground w-full h-full flex items-center justify-center relative">
            <div className="absolute lab-bg inset-0 size-full bg-[radial-gradient(#00000055_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px]">
            </div>
            <div className="flex w-full min-w-[500px] md:w-auto justify-center items-center p-4 relative">
              {Variants?.${demoComponentName} ? <Variants.${demoComponentName} /> : <${demoComponentName} />}
            </div>
          </div>
        </div>
      </RouterProvider>
    </ThemeProvider>
  );
}
`,
    "/next-themes.tsx": `
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: (theme: string) => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children, defaultTheme = 'light', enableSystem = false }) => {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
`,
    "/node_modules/next/package.json": `
   {
     "name": "next",
     "version": "latest",
     "main": "index.js"
   }
   `,
    "/node_modules/next/index.js": `
      export { default as Image } from './image';
      export { default as Link } from './link';
      export { useRouter, RouterProvider } from './router';
      export { default as Head } from './head';
      export { default as Script } from './script';
      export { default as dynamic } from './dynamic';
      export { Roboto } from './font';
      export { default as Document } from './document';
    `,
    "/node_modules/next/image.js": `
      import React from 'react';
      
      const Image = ({ src, alt, width, height, ...props }) => (
        <img src={src} alt={alt} width={width} height={height} {...props} />
      );
      
      export default Image;
    `,
    "/node_modules/next/link.js": `
      import React from 'react';
      
      const Link = ({ href, children, ...props }) => (
        <a href={href} {...props}>{children}</a>
      );
      
      export default Link;
    `,
    "/node_modules/next/head.js": `
      import React from 'react';
      
      const Head = ({ children }) => {
        return <div>{children}</div>;
      };
      
      export default Head;
    `,
    "/node_modules/next/script.js": `
      import React from 'react';
      
      const Script = ({ src, strategy, children, ...props }) => {
        return <script src={src} {...props}>{children}</script>;
      };
      
      export default Script;
    `,
    "/node_modules/next/router.js": `
      import React, { createContext, useContext } from 'react';
      
      const RouterContext = createContext({
        pathname: '/',
        push: (url) => {},
        replace: (url) => {},
      });
      
      export const useRouter = () => useContext(RouterContext);
      
      export const RouterProvider = ({ children }) => {
        const router = {
          pathname: '/',
          push: (url) => {
            console.log(\`Navigating to \${url}\`);
          },
          replace: (url) => {
            console.log(\`Replacing with \${url}\`);
          },
        };
        
        return (
          <RouterContext.Provider value={router}>
            {children}
          </RouterContext.Provider>
        );
      };
    `,
    "/node_modules/next/dynamic.js": `
      import React, { Suspense } from 'react';
      
      const dynamic = (importFunc, options = {}) => {
        const { ssr = true, loading: LoadingComponent = () => <div>Loading...</div> } = options;
        
        const LazyComponent = React.lazy(importFunc);
        
        return (props) => (
          <Suspense fallback={<LoadingComponent />}>
            <LazyComponent {...props} />
          </Suspense>
        );
      };
      
      export default dynamic;
    `,
    "/node_modules/next/font.js": `
      export const Roboto = {
        className: 'font-roboto',
      };
    `,
    "/node_modules/next/document.js": `
      import React from 'react';
      
      const Html = ({ children, ...props }) => <html {...props}>{children}</html>;
      const Head = ({ children }) => <head>{children}</head>;
      const Main = () => <div id="__next"></div>;
      const NextScript = () => <script />;
      
      export default function Document() {
        return (
          <Html>
            <Head />
            <body>
              <Main />
              <NextScript />
            </body>
          </Html>
        );
      }
    `,
    [`${relativeImportPath}/${componentSlug}.tsx`]: code,
    "/demo.tsx": demoCode,
    "/lib/utils.ts": `
export function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(' ');
}
`,
    "/globals.css": `
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  max-width: 100vw;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`,
    "/tailwind.config.js": `
module.exports = {
  darkMode: 'class',
  content: ['./**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
`,
    "/tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          jsx: "react-jsx",
          esModuleInterop: true,
          baseUrl: ".",
          paths: {
            "@/*": ["./*"],
          },
        },
      },
      null,
      2,
    ),
  }

  return files
}