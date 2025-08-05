import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, BookMarked, LayoutGrid, School, Users } from 'lucide-react';
import { useMemo } from 'react';

// Definisikan item menu untuk setiap peran.
// Pastikan nama rute (misal: 'users.index') sudah terdaftar di file rute Laravel Anda.
const navItemsByRole: Record<string, NavItem[]> = {
    admin: [
        { title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid },
        { title: 'Manajemen Pengguna', href: '/users', icon: Users }, // Ganti dengan route('users.index') jika ada
    ],
    kepsek: [
        { title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid },
        { title: 'Laporan', href: '/reports', icon: BarChart3 }, // Ganti dengan route('reports.index') jika ada
    ],
    guru: [
        { title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid },
        { title: 'Kelas Saya', href: '/my-classes', icon: School }, // Ganti dengan route yang sesuai
    ],
    siswa: [
        { title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid },
        { title: 'Nilai Saya', href: '/my-grades', icon: BookMarked }, // Ganti dengan route yang sesuai
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
