import { useRouter } from 'next/router'
import ListingsStep from '../../components/ui/onboarding/ListingsStep'

export default function ListingsSetupPage() {
  const router = useRouter()

  return (
    <ListingsStep
      onNext={() => router.push('/dashboard')}
      onBack={() => router.push('/setup/branding')}
      onSave={(data) => {
        // Save listings data
        console.log('Saving listings data:', data)
      }}
    />
  )
} 