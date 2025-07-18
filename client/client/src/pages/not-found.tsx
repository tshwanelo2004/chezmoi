import { useLanguage } from "@/lib/language";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--beige))] to-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[hsl(var(--bordeaux))] mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
        <a 
          href="/" 
          className="bg-[hsl(var(--bordeaux))] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
