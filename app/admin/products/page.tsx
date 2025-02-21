
import { requireAdmin } from '@/lib/auth-guard';

export default function AdminProductsPage() {
  requireAdmin();

  return (
    <>Product Page</>
  )
}