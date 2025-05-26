// Interface répresentant SpaceX launch
export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  rocket: string;
  details?: string;
  links: {
    patch: { small: string | null; large: string | null };
    webcast: string | null;
    article: string | null;
  };
  launchpad: string;
  payloads: string[];
}
// Interface répresentant payload
export interface payload {
  id: string;
  name: string;
  customers: string[];
}
// Interface répresentant launchpad
export interface Launchpad {
  id: string;
  name: string;
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
// Fonction pour récupérer les 10 derniers lancements
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

// Fonction pour récupérer un lancement par son ID (pas utilisé)
export async function fetchLaunchById(id: string): Promise<Launch> {
  const res = await fetch(`https://api.spacexdata.com/v4/launches/${id}`);
  return await res.json();
}
// Fonction pour récupérer une charge(payload) par son ID
export async function fetchPayloadById(id: string): Promise<payload> {
  const res = await fetch(`https://api.spacexdata.com/v4/payloads/${id}`);
  return await res.json();
}
// Fonction pour récupérer un site de lancement (launchpad) par son ID
export async function fetchLaunchpadById(id: string): Promise<Launchpad> {
  const res = await fetch(`https://api.spacexdata.com/v4/launchpads/${id}`);
  return await res.json();
}
