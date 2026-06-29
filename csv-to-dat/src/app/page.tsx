import CsvConverter from '../components/CsvConverter';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <CsvConverter />
    </main>
  );
}