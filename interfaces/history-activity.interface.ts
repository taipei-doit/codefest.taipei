import type { Sponsor } from "./sponsor.interface";

/**
 * 歷年活動
 */
export interface HistoryActivity {
  id: string;
  name: string;
  date: string;
  link?: string;
  available: boolean;
  hero_banner?: HeroBanner;
  past?: Past;
  rules?: Rules;
  schedule?: Schedule;
  sponsor?: {
    available: boolean;
    section_title: string;
    list: Sponsor[];
  };
  footer?: Footer;
}

/**
 * 歷年活動類別
 */
export interface HistoryNavigation {
  name: string;
  type: string;
  current: boolean;
}

interface HeroBanner {
  section_title: string;
  background_options: BackgroundOptions;
}

interface BackgroundOptions {
  title: string;
  left: string;
  right: string;
  mobile: string;
}

interface Past {
  winning_teams: WinningTeams;
}

interface WinningTeams {
  list: PastWinningTeam[];
}

interface PastWinningTeam {
  id: number;
  ranking: string;
  team_name: string;
  thumbnail: string;
  team_members: string;
  descriptions: {
    title: string;
    content: string;
  }[];
  image_list: string[];
}

interface Rules {
  section_title: string;
  description: string;
  promotion_images: PromotionImages;
}

interface PromotionImages {
  desktop_url: string;
  mobile_url: string;
}

interface Schedule {
  list: ScheduleItem[];
}

interface ScheduleItem {
  id: string;
  name: string;
  date: string;
  link: string;
  available: boolean;
}

interface Footer {
  organizer: string[];
  co_organizer?: string[];
  implementer?: string[];
  buttons: Button[];
}

interface Button {
  name: string;
  link: string;
}
