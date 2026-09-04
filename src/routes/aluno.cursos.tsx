import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, PlayCircle, Star, Clock, Flame, CheckCircle2, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { COURSE_POSTERS, coursePoster, lessonCover, SUPPORT_ART } from "@/lib/course-art";

import josiHero from "@/assets/josi_nascimento_40_anos-2.jpg";

export const Route = createFileRoute("/aluno/cursos")({
  component: StudentCourses,
});

function GoldRule() {
  return <div className="h-px w-full bg-gradient-to-r from-gold/60 via-gold/10 to-transparent" />;
}

function SectionTitle({ label, accent, action }: { label: string; accent: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-6">
      <div>
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.4em] text-gold/70">Portfólio</span>
        <h2 className="text-2xl font-serif text-white">
          {label} <span className="italic text-gold">{accent}</span>
        </h2>
      </div>
      {action}
    </div>
  );
}

function NetflixHero({ course, lessons }: { course: any; lessons: any[] }) {
  if (!course) return null;
  const bg = coursePoster(course) || josiHero;

  return (
    <div className="relative mb-14 h-[62vh] min-h-[420px] w-full overflow-hidden rounded-[2rem] border border-gold/20 shadow-lux">
      <img src={bg} alt={course.title} className="h-full w-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/10" />

      <div className="absolute bottom-0 left-0 p-8 md:p-12 lg:w-3/5">
        <div className="mb-4 flex items-center gap-2 text-gold">
          <Flame className="h-4 w-4 fill-gold" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Em destaque</span>
        </div>
        <h1 className="mb-4 font-serif text-4xl leading-tight text-white md:text-6xl">{course.title}</h1>
        <p className="mb-6 max-w-xl text-sm text-white/70 md:text-base line-clamp-3">{course.description}</p>
        <div className="mb-8 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/50">
          <span className="rounded-full border border-gold/30 px-3 py-1 text-gold">{lessons.length} módulos</span>
          <span>Acesso vitalício</span>
          <span className="h-1 w-1 rounded-full bg-gold/50" />
          <span>Certificado Josi Nascimento</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/aluno/cursos/$courseId"
            params={{ courseId: course.id }}
            className="flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-black transition-colors hover:bg-gold"
          >
            <PlayCircle className="h-5 w-5 fill-black" />
            Assistir agora
          </Link>
          <Link
            to="/aluno/materiais"
            className="flex items-center gap-2 rounded-full border border-gold/30 bg-white/10 px-8 py-3 font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            Materiais do módulo
          </Link>
        </div>
      </div>
    </div>
  );
}

function LessonPoster({ courseId, lesson, index, done }: { courseId: string; lesson: any; index: number; done: boolean }) {
  return (
    <motion.div whileHover={{ scale: 1.04, zIndex: 10 }} className="relative w-[170px] shrink-0 md:w-[210px]">
      <Link
        to="/aluno/cursos/$courseId"
        params={{ courseId }}
        className="group block overflow-hidden rounded-2xl border border-gold/20 bg-card shadow-lux"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <img
            src={lessonCover(lesson)}
            alt={lesson.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
          <div className="absolute left-3 top-3 rounded-full border border-gold/40 bg-black/60 px-2 py-0.5 text-[10px] font-bold tracking-widest text-gold backdrop-blur-md">
            {String(index + 1).padStart(2, "0")}
          </div>
          {done && (
            <div className="absolute right-3 top-3 rounded-full bg-emerald-500/90 p-1">
              <CheckCircle2 className="h-3 w-3 text-black" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="line-clamp-2 text-[11px] font-bold uppercase leading-tight tracking-wide text-white">
              {lesson.title.replace(/^Aula\s*\d+\s*[—-]\s*/i, "")}
            </h3>
            <div className="mt-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gold opacity-0 transition-opacity group-hover:opacity-100">
              <PlayCircle className="h-3 w-3" /> Assistir
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CoursePoster({ course, progress, lessons }: { course: any; progress: number; lessons: number }) {
  return (
    <motion.div whileHover={{ scale: 1.05, zIndex: 10 }} className="w-[170px] shrink-0 md:w-[200px]">
      <Link
        to="/aluno/cursos/$courseId"
        params={{ courseId: course.id }}
        className="group relative block aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-card shadow-lux"
      >
        <img
          src={coursePoster(course)}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-gold">
              <Star className="h-3 w-3 fill-gold" />
              <span className="text-[9px] font-bold tracking-widest">PREMIUM</span>
            </div>
            <span className="flex items-center gap-1 text-[9px] text-white/60">
              <Clock className="h-3 w-3" />
              {lessons} aulas
            </span>
          </div>
          <h3 className="mb-3 line-clamp-2 text-xs font-bold text-white">{course.title}</h3>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gold" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
}

function StudentCourses() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["aluno-cursos", user?.id],
    queryFn: async () => {
      const [coursesRes, progressRes] = await Promise.all([
        supabase
          .from("courses")
          .select("id, title, description, cover_url, course_modules(id, title, position, cover_url)")
          .eq("published", true)
          .order("created_at", { ascending: false }),
        supabase.from("lesson_progress").select("module_id").not("completed_at", "is", null),
      ]);
      if (coursesRes.error) throw coursesRes.error;
      return {
        courses: coursesRes.data ?? [],
        done: new Set((progressRes.data ?? []).map((p: any) => p.module_id)),
      };
    },
  });

  const courses = data?.courses ?? [];
  const featured =
    courses.find((c: any) => c.title?.startsWith("Destaque-se —")) ??
    courses.slice().sort((a: any, b: any) => (b.course_modules?.length ?? 0) - (a.course_modules?.length ?? 0))[0];
  const featuredLessons = [...(featured?.course_modules ?? [])].sort((a: any, b: any) => a.position - b.position);

  return (
    <div className="pb-24">
      {isLoading ? (
        <div className="mb-14 h-[62vh] min-h-[420px] w-full animate-pulse rounded-[2rem] bg-white/5" />
      ) : (
        <NetflixHero course={featured} lessons={featuredLessons} />
      )}

      {featuredLessons.length > 0 && (
        <section className="mb-16">
          <SectionTitle
            label="Módulos da"
            accent="Mentoria"
            action={
              featured && (
                <Link
                  to="/aluno/cursos/$courseId"
                  params={{ courseId: featured.id }}
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold hover:text-white"
                >
                  Ver tudo <ChevronRight className="h-3 w-3" />
                </Link>
              )
            }
          />
          <GoldRule />
          <div className="mt-6">
            <Row>
              {featuredLessons.map((m: any, i: number) => (
                <LessonPoster
                  key={m.id}
                  courseId={featured!.id}
                  lesson={m}
                  index={i}
                  done={!!data?.done.has(m.id)}
                />
              ))}
            </Row>
          </div>
        </section>
      )}

      <section className="mb-16">
        <SectionTitle label="Sua jornada" accent="Premium" />
        <GoldRule />

        {isLoading && (
          <div className="mt-6 flex gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="aspect-[2/3] w-[170px] shrink-0 animate-pulse rounded-2xl bg-white/5 md:w-[200px]" />
            ))}
          </div>
        )}

        {!isLoading && courses.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-gold/20 py-20 text-center">
            <GraduationCap className="mx-auto mb-4 h-12 w-12 text-gold/30" />
            <p className="text-muted-foreground">Nenhum curso disponível na sua conta ainda.</p>
          </div>
        )}

        {!isLoading && courses.length > 0 && (
          <div className="mt-6">
            <Row>
              {courses.map((course: any) => {
                const modules = course.course_modules ?? [];
                const completed = modules.filter((m: any) => data?.done.has(m.id)).length;
                const pct = modules.length ? (completed / modules.length) * 100 : 0;
                return <CoursePoster key={course.id} course={course} progress={pct} lessons={modules.length} />;
              })}
            </Row>
          </div>
        )}
      </section>

      <section>
        <SectionTitle label="Materiais" accent="Complementares" />
        <GoldRule />
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[
            { img: SUPPORT_ART.materiais, title: "E-book: A Arte do Toque", meta: "PDF interativo • 45 páginas" },
            { img: SUPPORT_ART.suporte, title: "Checklist da Vitória", meta: "Material prático • Planilha" },
            { img: SUPPORT_ART.destaque, title: "Guia de Posicionamento", meta: "Vídeo complementar • 12min" },
          ].map(item => (
            <Link
              key={item.title}
              to="/aluno/materiais"
              className="group relative block h-56 overflow-hidden rounded-2xl border border-gold/15 bg-card"
            >
              <img
                src={item.img}
                alt={item.title}
                className="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="font-serif text-lg text-white">{item.title}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold/80">{item.meta}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
