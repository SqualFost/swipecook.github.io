// app/settings/page.tsx

import AccountSettings from '@/components/AccountSettings'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'

export default function SettingsPage() {
  return (
    <>
      <Header/>
      <AccountSettings />
      <Navbar/>
    </>
  )
}
