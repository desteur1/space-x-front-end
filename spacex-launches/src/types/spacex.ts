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
