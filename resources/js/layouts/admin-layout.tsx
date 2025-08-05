import { AppShell } from '@/components/app-shell';
import { type Children } from '@/types';

export default function AdminLayout({ children }: { children: Children }) {
    return <AppShell>{children}</AppShell>;
}
