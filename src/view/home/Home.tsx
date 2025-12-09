import { Link } from "react-router-dom";
import { Users, ChevronRight, Briefcase, GraduationCap } from "lucide-react";
import heroUrl from "@/assets/2.jpg";

const LOGIN_PATH = "/auth/login";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <header className="sticky top-0 z-30 backdrop-blur-md  ">
        <div className="max-w-full mx-auto px-6 py-4 bg-[var(--color-primary-content)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--color-blue)] text-white rounded-xl w-11 h-11 grid place-items-center font-bold shadow-[var(--color-primary-content)]">
              So
            </div>
            <div>
              <h1 className="font-bold sm:text-3xl text-[var(--color-blue)]">
                Sociología UAGRM
              </h1>
              <p className="text-xs text-[var(--color-violet)] font-medium">
                Gestión de Titulados
              </p>
            </div>
          </div>
          <Link
            to={LOGIN_PATH}
            className="px-4 py-2.5 bg-[var(--color-blue)] text-white rounded-lg font-medium shadow-lg shadow-violet-500/30 transition-all duration-300 hover:scale-105"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      {/* HERO rediseñado */}
      <section className="relative h-[60vh] min-h-[420px] sm:h-[70vh] md:h-[75vh] md:min-h-[600px] overflow-hidden bg-[var(--color-base-200)]">
        <img
          src={heroUrl}
          alt="Sociología UAGRM — comunidad y campus"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-40"
        />
        <div className="absolute inset-0" />

        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center">
          <div className="w-full max-w-xl sm:max-w-2xl">
            {/* Título */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight sm:leading-[1.15] text-[var(--color-green)] mb-4 sm:mb-6">
              Conecta con tu{" "}
              <span className="bg-gradient-to-r bg-clip-text text-[var(--color-violet)]">
                comunidad
              </span>{" "}
              de egresados
            </h2>

            {/* Descripción */}
            <p className="text-base sm:text-lg text-[var(--color-base-150)] leading-relaxed mb-6 sm:mb-8 max-w-md sm:max-w-xl">
              Actualiza tu perfil profesional, registra tu trayectoria laboral,
              participa en encuestas y accede a oportunidades exclusivas para
              titulados.
            </p>

            {/* Botones */}

            {/* Stats */}
            <div className="mt-8 sm:mt-12 flex flex-wrap gap-6 sm:gap-8">
              <div className="min-w-[120px]">
                <div className="text-2xl sm:text-3xl font-bold text-[var(--color-blue)]">
                  500+
                </div>
                <div className="text-xs sm:text-sm text-[var(--color-base-200)]">
                  Egresados activos
                </div>
              </div>
              <div className="min-w-[120px]">
                <div className="text-2xl sm:text-3xl font-bold text-[var(--color-blue)]">
                  95%
                </div>
                <div className="text-xs sm:text-sm text-[var(--color-base-200)]">
                  Satisfacción
                </div>
              </div>
              <div className="min-w-[120px]">
                <div className="text-2xl sm:text-3xl font-bold text-[var(--color-blue)]">
                  24/7
                </div>
                <div className="text-xs sm:text-sm text-[var(--color-base-200)]">
                  Acceso disponible
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features rediseñado con iconos y mejor jerarquía */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-[var(--color-blue)] mb-4">
            Todo lo que necesitas en un solo lugar
          </h3>
          <p className="text-lg text-[var(--color-violet)] max-w-2xl mx-auto">
            Herramientas diseñadas específicamente para fortalecer tu desarrollo
            profesional y mantener el vínculo con tu alma máter
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-white hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 border-2 border-violet-100 hover:border-violet-300 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br bg-[var(--color-violet)] rounded-xl grid place-items-center mb-6 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-xl font-bold text-[var(--color-green)] mb-3">
              Perfil de egresado
            </h4>
            <p className="text-[var(--color-info-content)] leading-relaxed">
              Mantén actualizada tu información académica, experiencia laboral y
              logros profesionales en un perfil completo y verificado.
            </p>
          </div>

          <div className="group bg-white hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 border-2 border-violet-100 hover:border-violet-300 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br bg-[var(--color-violet)] rounded-xl grid place-items-center mb-6 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-xl font-bold text-[var(--color-green)] mb-3">
              Ofertas y encuestas
            </h4>
            <p className="text-[var(--color-info-content)] leading-relaxed">
              Accede a oportunidades laborales exclusivas, participa en estudios
              de seguimiento y contribuye a mejorar la formación académica.
            </p>
          </div>

          <div className="group bg-white hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 border-2 border-violet-100 hover:border-violet-300 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br bg-[var(--color-violet)] rounded-xl grid place-items-center mb-6 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-xl font-bold text-[var(--color-green)] mb-3">
              Red de contactos
            </h4>
            <p className="text-[var(--color-info-content)] leading-relaxed">
              Conecta con tu cohorte, amplía tu red profesional y colabora con
              otros egresados en proyectos e iniciativas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 mb-20">
        <div className="bg-gradient-to-r bg-[var(--color-green)] rounded-3xl p-12 shadow-2xl shadow-violet-500/30 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para dar el siguiente paso?
          </h3>
          <p className="text-violet-100 text-lg mb-8 max-w-2xl mx-auto">
            Únete a la comunidad de egresados más activa y mantente conectado
            con tu carrera
          </p>
          <Link
            to={LOGIN_PATH}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-violet-50 text-[var(--color-violet)] rounded-xl font-semibold shadow-xl transition-all duration-300 hover:scale-105"
          >
            Crear mi perfil ahora
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer mejorado */}
      <footer className="border-t border-white bg-[var(--color-primary-content)] backdrop-blur-sm">
        <div className="max-w-full mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br bg-[var(--color-blue)] text-white rounded-xl w-10 h-10 grid place-items-center font-bold shadow-lg shadow-violet-500/20">
                So
              </div>
              <div>
                <div className="font-bold text-[var(--color-info-content)]">
                  Sociología UAGRM
                </div>
                <div className="text-sm text-[var(--color-info-content)]">
                  Gestión de Titulados
                </div>
              </div>
            </div>
            <div className="text-sm text-center text-[var(--color-info-content)]">
              © {new Date().getFullYear()} Universidad Autónoma Gabriel René
              Moreno. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
