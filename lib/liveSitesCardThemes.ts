export const LIVE_SITES_CARD_THEMES = [
  {
    gradient: "from-[#3a7d44] to-[#2d6235]",
    accent: "text-[#6dba7d]",
    badgeBg: "bg-white/20 text-white border-white/30",
    btn: "bg-[#3a7d44] text-white hover:bg-[#2d6235]",
    darkGradient: "from-[#0d1f10] to-[#08140b]",
  },
  {
    gradient: "from-[#7e5bbd] to-[#6642a8]",
    accent: "text-[#c4aef0]",
    badgeBg: "bg-white/20 text-white border-white/30",
    btn: "bg-[#7e5bbd] text-white hover:bg-[#6642a8]",
    darkGradient: "from-[#1a1028] to-[#110a1e]",
  },
  {
    gradient: "from-[#9146ff] to-[#772ce8]",
    accent: "text-[#c89bff]",
    badgeBg: "bg-white/20 text-white border-white/30",
    btn: "bg-[#9146ff] text-white hover:bg-[#772ce8]",
    darkGradient: "from-[#1a0d35] to-[#110826]",
  },
  {
    gradient: "from-[#e85d04] to-[#c44d03]",
    accent: "text-[#ffaa6b]",
    badgeBg: "bg-white/20 text-white border-white/30",
    btn: "bg-[#e85d04] text-white hover:bg-[#c44d03]",
    darkGradient: "from-[#1e0e00] to-[#160900]",
  },
  {
    gradient: "from-[#2e5f8a] to-[#1e4a70]",
    accent: "text-[#7eb8e8]",
    badgeBg: "bg-white/20 text-white border-white/30",
    btn: "bg-[#2e5f8a] text-white hover:bg-[#1e4a70]",
    darkGradient: "from-[#0a1826] to-[#06101a]",
  },
] as const;

export type LiveSitesCardTheme = (typeof LIVE_SITES_CARD_THEMES)[number];
