import { requireAdmin } from '@/lib/auth-guard';

export default async function AdminUserUpdatePage() {
  await requireAdmin();

  return (
    <>Admin User Update Page</>
  );
}