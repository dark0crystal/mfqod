import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Alexandria } from "next/font/google";
import {routing} from '@/i18n/routing';
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import Splash from "../components/Splash";
import GoeyToasterRoot from "../components/GoeyToasterRoot";
import {getMessages} from 'next-intl/server';
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../../auth";
import Head from "next/head";
// import Footer from "./components/Footer";

const alexandria = Alexandria({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "مفقود | MFQOD",
  description:"مفقود",
};


export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const session = await auth();
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  let direction ="";
  if(locale == "ar"){
    direction ="rtl"
  }else{
    direction ="ltr"
  }
   // Providing all messages to the client
  // side is the easiest way to get started
  // a20918ee-ab25-4dbd-951e-6bf0763799dd
  const messages = await getMessages();
  return (
    <SessionProvider session={session}>
    <html lang={locale} dir={direction}>
      {/* <Head>
      <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" 
      async="">
    </script>
      </Head> */}

    
    <body className={alexandria.className}>
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(70,130,180,0.3),rgba(255,255,255,0))]"></div>
      <NextIntlClientProvider messages={messages}>
        <GoeyToasterRoot />
        {children}
        {/* <Footer/> */}
      </NextIntlClientProvider>
        </body>
    </html>
    </SessionProvider>
  );
}
