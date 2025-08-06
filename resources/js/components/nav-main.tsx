import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, BookMarked, LayoutGrid, Printer, School, Users } from 'lucide-react';
import { useMemo } from 'react';

// Definisikan item menu untuk setiap peran.
// Pastikan nama rute (misal: 'users.index') sudah terdaftar di file rute Laravel Anda.
const navItemsByRole: Record<string, NavItem[]> = {
    admin: [
        { title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid },
        { title: 'Manajemen Pengguna', href: route('users.index'), icon: Users },
    ],
    kepsek: [
        { title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid },
        { title: 'Laporan', href: route('kepsek.reports'), icon: BarChart3 },
        { title: 'Cetak Laporan', href: route('laporan.create'), icon: Printer },
    ],
    guru: [
        { title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid },
        { title: 'Kelas Saya', href: route('guru.my-classes'), icon: School },
        { title: 'Cetak Laporan', href: route('laporan.create'), icon: Printer },
    ],
    siswa: [
        { title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid },
        { title: 'Nilai Saya', href: route('siswa.my-grades'), icon: BookMarked },
    ],
};

// Menu default sebagai fallback
const defaultNavItems: NavItem[] = [{ title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid }];

export function NavMain() {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    // Tentukan item navigasi berdasarkan peran pengguna
    const navItems = useMemo(() => {
        const role = auth.user?.role as keyof typeof navItemsByRole;
        return navItemsByRole[role] || defaultNavItems;
    }, [auth.user?.role]);

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
