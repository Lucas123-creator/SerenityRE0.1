import type { AppProps } from 'next/app'
import { DashboardLayout } from '../components/ui/layout/DashboardLayout'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DashboardLayout>
      <Component {...pageProps} />
    </DashboardLayout>
  )
} 