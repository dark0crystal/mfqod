"use client";

type Branch = {
  id: string;
  nameEn: string;
  nameAr?: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  description: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
};

type BranchCardProps = {
  branch: Branch;
  openInMapsLabel: string;
};

function googleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export default function BranchCard({ branch, openInMapsLabel }: BranchCardProps) {
  const url = googleMapsUrl(branch.latitude, branch.longitude);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-800">{branch.nameEn}</h3>
      {branch.address && (
        <p className="mt-1 text-sm text-slate-600">{branch.address}</p>
      )}
      {(branch.descriptionEn ?? branch.description) && (
        <p className="mt-2 text-sm text-slate-500">{branch.descriptionEn ?? branch.description}</p>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 btn-primary inline-flex items-center gap-2 text-sm"
      >
        {openInMapsLabel}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </article>
  );
}
