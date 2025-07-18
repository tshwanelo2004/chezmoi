import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/lib/language";

interface Chef {
  id: number;
  title: string;
  bio: string;
  location: string;
  rating: string;
  user: {
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

export default function Home() {
  const { t } = useLanguage();
  
  const { data: chefs, isLoading, error } = useQuery({
    queryKey: ['/api/chefs/featured'],
    queryFn: () => apiRequest('/api/chefs/featured'),
  });

  if (isLoading) return <div className="p-8 text-center">{t("loading")}</div>;
  if (error) return <div className="p-8 text-center text-red-500">{t("error")}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--beige))] to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-[hsl(var(--bordeaux))]">
            ChezMoi
          </h1>
          <p className="text-gray-600 mt-2">
            {t("welcome")}
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-[hsl(var(--dark))] mb-6">
          {t("find_chef")}
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Découvrez des chefs talentueux près de chez vous pour des expériences culinaires uniques
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-[hsl(var(--bordeaux))] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition">
            {t("find_chef")}
          </button>
          <button className="bg-[hsl(var(--geel))] text-[hsl(var(--dark))] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition">
            {t("become_chef")}
          </button>
        </div>
      </section>

      {/* Featured Chefs */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-[hsl(var(--dark))] mb-8 text-center">
          {t("featured_chefs")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chefs?.map((chef: Chef) => (
            <div key={chef.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-[hsl(var(--beige))] to-[hsl(var(--geel))] flex items-center justify-center">
                {chef.user.profileImage ? (
                  <img 
                    src={chef.user.profileImage} 
                    alt={`${chef.user.firstName} ${chef.user.lastName}`}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[hsl(var(--bordeaux))] flex items-center justify-center text-white text-2xl font-bold">
                    {chef.user.firstName[0]}{chef.user.lastName[0]}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-[hsl(var(--dark))] mb-2">
                  {chef.user.firstName} {chef.user.lastName}
                </h4>
                <p className="text-[hsl(var(--bordeaux))] font-medium mb-2">
                  {chef.title}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {chef.bio}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    📍 {chef.location}
                  </span>
                  <span className="text-[hsl(var(--geel))] font-semibold">
                    ⭐ {chef.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(var(--dark))] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h4 className="text-2xl font-bold mb-4">ChezMoi</h4>
          <p className="text-gray-300">
            La plateforme culinaire qui connecte chefs et gourmets en Belgique
          </p>
        </div>
      </footer>
    </div>
  );
}
