import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import NewHome from './components/NewHome'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Hex Color Mix Master 3000</title>
        <meta name="description" content="Put in your paint colors to get your palette with Hex Color Mix Master 3000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="https://hex-color-mix-master.vercel.app/screenshot.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NewHome/>
    </>
  )
}
