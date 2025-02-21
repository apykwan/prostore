import { requireAdmin } from '@/lib/auth-guard';

export default async function AdminUserPage() {
  await requireAdmin();
  return (
    <>Admin User Page</>
  );
}