export interface Launch {
  name: string;
  date_utc: string;
  success: boolean | null;
  rocket: string;
  details?: string;
}

// Fonction pour récupérer tous les lancements
export async function fetchAllLaunches(): Promise<Launch[]> {
  const res = await fetch("https://api.spacexdata.com/v4/launches");
  return await res.json();
}

// Fonction pour récupérer le prochain lancement
export async function fetchNextLaunch(): Promise<Launch> {
  const res = await fetch("https://api.spacexdata.com/v4/launches/next");
  return await res.json();
}

export async function fetchLastLaunches(limit = 10): Promise<Launch[]> {
  const res = await fetch(`https://api.spacexdata.com/v4/launches/past`);
  const data: Launch[] = await res.json();
  // On trie les lancements par date décroissante et on prend les 10 plus récents
  return data
    .sort(
      (a, b) => new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime()
    )
    .slice(0, limit);
}
