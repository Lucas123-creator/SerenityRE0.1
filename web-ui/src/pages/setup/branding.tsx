import { useRouter } from 'next/router'
import BrandingStep from '../../components/ui/onboarding/BrandingStep'

export default function BrandingSetupPage() {
  const router = useRouter()

  return (
    <BrandingStep
      onNext={() => router.push('/setup/listings')}
      onBack={() => router.push('/setup')}
      onSave={(data) => {
        // Save branding data
        console.log('Saving branding data:', data)
      }}
    />
  )
} 