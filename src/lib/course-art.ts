import josiElite from "@/assets/josi_nascimento_40_anos-26.jpg";
import josiAvancada from "@/assets/josi_nascimento_40_anos-14.jpg";
import josiVitoria from "@/assets/josi_nascimento_40_anos-38-2.jpg";
import josiDestaque from "@/assets/josi_nascimento_40_anos-31.jpg";
import josiRetrato from "@/assets/josi_nascimento_40_anos-2.jpg";
import josiVermelho from "@/assets/josi_nascimento_40_anos-42-2.jpg";
import aula01 from "@/assets/aula-01.webp";
import aula02 from "@/assets/aula-02.webp";
import aula03 from "@/assets/aula-03.webp";
import aula04 from "@/assets/aula-04.png";
import aula05 from "@/assets/aula-05.png";
import aula06 from "@/assets/aula-06.png";


/** Capa por curso (fallback quando não há cover_url no banco). */
export const COURSE_POSTERS: Record<string, string> = {
  "Mentoria Elite": josiElite,
  "Massoterapia Avançada": josiAvancada,
  "Protocolo da Vitória": josiVitoria,
  "Destaque-se no Mercado": josiDestaque,
  "Destaque-se — Mentoria Josi Nascimento": josiVermelho,
};

/** Capa temática de cada videoaula da mentoria (por número da aula). */
export const LESSON_COVERS: Record<number, string> = {
  1: aula01,
  2: aula02,
  3: aula03,
  4: aula04,
  5: aula05,
  6: aula06,
};


export function lessonCover(module: { title?: string | null; position?: number | null; cover_url?: string | null }) {
  if (module.cover_url) return module.cover_url;
  const fromTitle = module.title?.match(/Aula\s*0?(\d+)/i)?.[1];
  const n = fromTitle ? Number(fromTitle) : (module.position ?? 0);
  return LESSON_COVERS[n] ?? josiRetrato;
}

/** Capa do curso com fallback garantido (nunca retorna vazio). */
export function coursePoster(course: { title?: string | null; cover_url?: string | null }) {
  if (course?.cover_url) return course.cover_url;
  if (course?.title && COURSE_POSTERS[course.title]) return COURSE_POSTERS[course.title];
  return josiRetrato;
}

/** Imagens usadas em áreas de apoio (materiais, financeiro, agenda). */
export const SUPPORT_ART = {
  agenda: josiAvancada,
  financeiro: josiRetrato,
  materiais: josiElite,
  suporte: josiVitoria,
  destaque: josiVermelho,
  aulas: [aula01, aula02, aula03, aula04, aula05, aula06],
};
