import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SiswaDashboard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dasbor Siswa</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Selamat datang di dasbor Siswa. Di sini Anda dapat melihat jadwal pelajaran dan nilai.</p>
            </CardContent>
        </Card>
    );
}
