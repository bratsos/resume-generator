import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "~/globals.css?url";

import { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles, type: "text/css" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
