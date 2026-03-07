import { getTranslations } from "next-intl/server";
import Footer from "@/app/components/Footer";
import { Link } from "@/i18n/routing";
import { auth } from "@/../auth";
import { getUserRoleAndManagedPlaces } from "@/lib/dashboard";
import { roleToSegment } from "@/lib/dashboard";

export const metadata = {
  title: "Pricing | MFQOD",
  description: "Affordable plans for every budget",
};

function CheckIcon({ featured }: { featured?: boolean }) {
  const className = featured ? "text-white shrink-0" : "text-blue-600 shrink-0";
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export default async function PricingPage() {
  const t = await getTranslations("pricing");
  const session = await auth();
  let ticketsNewHref: string | null = null;
  if (session?.user?.id) {
    try {
      const { role } = await getUserRoleAndManagedPlaces(session.user.id);
      const segment = roleToSegment(role);
      ticketsNewHref = `/${segment}/tickets/new?type=subscription`;
    } catch {
      ticketsNewHref = null;
    }
  }

  const freeFeatures = (t("freeFeatures") || "").split("|").filter(Boolean);
  const plusFeatures = (t("plusFeatures") || "").split("|").filter(Boolean);
  const premiumFeatures = (t("premiumFeatures") || "").split("|").filter(Boolean);

  const cards = [
    {
      key: "free",
      name: t("free"),
      price: t("priceFree"),
      description: t("freeDescription"),
      features: freeFeatures,
      featured: false,
    },
    {
      key: "plus",
      name: t("plus"),
      price: t("pricePlus"),
      description: t("plusDescription"),
      features: plusFeatures,
      featured: true,
    },
    {
      key: "premium",
      name: t("premium"),
      price: t("pricePremium"),
      description: t("premiumDescription"),
      features: premiumFeatures,
      featured: false,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {cards.map((card) => (
            <div
              key={card.key}
              className={`rounded-xl border flex flex-col ${
                card.featured
                  ? "bg-primary border-primary text-white"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{card.price}</span>
                </div>
                <p className={`text-sm mb-6 ${card.featured ? "text-primary-light" : "text-gray-600"}`}>
                  {card.description}
                </p>
                <p className="font-medium mb-2">{t("featuresLabel")}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {card.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckIcon featured={card.featured} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={
                    (card.key === "plus" || card.key === "premium") && ticketsNewHref
                      ? ticketsNewHref
                      : "/login"
                  }
                  className={`mt-auto block w-full py-3 px-4 rounded-2xl font-semibold text-center transition-colors ${
                    card.featured
                      ? "bg-white text-primary hover:bg-primary-light"
                      : "btn-primary"
                  }`}
                >
                  {t("getStarted")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
