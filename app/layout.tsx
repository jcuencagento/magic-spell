import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import { WandIcon } from "@/app/icons";

export const metadata: Metadata = {
	title: "Magic Spell",
	description: "AI prompting built into your <textarea>",
	metadataBase: new URL("https://magic-spell.vercel.app"),
	twitter: {
		card: "summary_large_image",
	},
};

export const viewport: Viewport = {
	maximumScale: 1, // Disable auto-zoom on mobile Safari
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-gray-100 dark:bg-gray-800 text-black dark:text-white flex flex-col items-center px-3 py-10 min-h-dvh`}
			>
				<Toaster richColors theme="light" />

				<h1 className="font-semibold text-xl flex items-center justify-center">
					<WandIcon />

					<span className="bg-gradient-to-b text-2xl xl:text-4xl dark:from-gray-50 dark:to-gray-200 from-gray-950 to-gray-800 bg-clip-text text-transparent ml-3">
						Medical Chat
					</span>
				</h1>

				<p className="mt-4 lg:mt-8 text-center text-base lg:text-xl font-mono">
					Chat de {" "}
					<strong className="bg-orange-600 text-black dark:bg-yellow-200 rounded p-1">
						&lt;Inteligencia Artificial&gt;
					</strong>
					{" "} para asistirte!
				</p>

				{children}

				<footer className="text-center text-sm dark:text-gray-600 text-gray-600 font-mono">
					<p>
						<A href="https://github.com/jcuencagento"> jcuencagento </A> /{" "}
						<A href="https://github.com/jcuencagento/magic-spell"> {"< code />"} </A>
					</p>
					<p>
						<A href="https://github.com/ai-ng/magic-spell"> original here </A>/{" "}
						<A href="https://nickoates.com">from him</A>
					</p>
				</footer>

				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}

function A(props: any) {
	return (
		<a {...props} className="text-black dark:text-white hover:text-yellow-200" />
	);
}
