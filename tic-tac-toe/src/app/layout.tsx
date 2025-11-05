import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Cric‑Tac | IPL × Country Quiz Tic Tac Toe",
		template: "%s | Cric‑Tac",
	},
	description:
		"Play a fast cricket quiz twist on Tic Tac Toe. Country × IPL and IPL × IPL modes with real player data.",
	applicationName: "Cric‑Tac",
	keywords: [
		"cricket quiz",
		"IPL quiz",
		"tic tac toe",
		"country vs IPL",
		"multiplayer cricket game",
	],
	metadataBase: new URL("https://cric-tac.example.com"),
	alternates: { canonical: "/" },
	openGraph: {
		title: "Cric‑Tac | IPL × Country Quiz Tic Tac Toe",
		description:
			"Answer cricket questions to win squares. Country × IPL and IPL × IPL modes.",
		url: "/",
		siteName: "Cric‑Tac",
		locale: "en_US",
		type: "website",
		images: [
			{ url: "/og-image.png", width: 1200, height: 630, alt: "Cric‑Tac" },
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Cric‑Tac | IPL × Country Quiz",
		description:
			"Play the cricket quiz Tic Tac Toe game. Country × IPL, IPL × IPL modes.",
		images: ["/og-image.png"],
	},
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
	manifest: "/manifest.webmanifest",
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
