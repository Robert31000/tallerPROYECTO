import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { login } from "../../lib/api";
// Cambiar luego por el logo oficial del sistema de donaciones
import logoUrl from "@/icons/logo-sociologia.svg";

type FormState = {
  email: string;
  password: string;
  remember: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function extractErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as unknown;
    if (data && typeof data === "object" && "message" in data) {
      const m = (data as { message?: unknown }).message;
      if (typeof m === "string") return m;
    }
    return err.message ?? "No se pudo iniciar sesión";
  }
  if (err instanceof Error) return err.message;
  return "No se pudo iniciar sesión";
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    remember: false,
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function validate(values: FormState): FormErrors {
    const e: FormErrors = {};
    if (!values.email) e.email = "El correo institucional es obligatorio";
    else if (!(values.email.includes("@") && values.email.includes(".")))
      e.email = "Formato de correo inválido";

    if (!values.password) e.password = "La contraseña es obligatoria";
    else if (values.password.length < 6) e.password = "Mínimo 6 caracteres";

    return e;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setServerError(null);

    const ve = validate(form);
    if (Object.keys(ve).length) return;

    try {
      setIsSubmitting(true);

      const { token, user } = await login(form.email, form.password);
      if (!token || typeof token !== "string") {
        throw new Error("Respuesta inválida del servidor");
      }

      const storage = form.remember ? localStorage : sessionStorage;
      storage.setItem("token", token);
      if (user !== undefined) storage.setItem("user", JSON.stringify(user));

      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      setServerError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-content)] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Header Institucional */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-4 mb-4">
            <div className="w-16 rounded-xl flex items-center justify-center shadow-lg">
              <img src={logoUrl} alt="Sistema de Donaciones UAGRM" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-blue)] mb-2">
            Universidad Autónoma Gabriel René Moreno
          </h1>
          <p className="text-[var(--color-violet)] text-2xl font-bold">
            Sistema Inteligente de Donaciones
          </p>
          <div className="mt-1 text-sm text-[var(--color-info-content)]">
            Priorización y trazabilidad para campañas solidarias
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-[var(--color-primary-content)]">
          <div className="md:col-span-3 flex justify-center items-start border-[var(--color-info-content)]">
            <div className="p-4 w-full max-w-lg">
              <div className="mb-4">
                <h2 className="text-3xl text-center font-bold text-[var(--color-info-content)] mb-2">
                  Iniciar Sesión
                </h2>
                <p className="text-[var(--color-info-content)] text-center">
                  Ingrese sus credenciales institucionales para gestionar
                  solicitudes y donaciones
                </p>
              </div>

              {serverError && (
                <div
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg"
                  role="alert"
                >
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        {serverError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={onSubmit} noValidate className="space-y-2">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Correo institucional
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="usuario@uagrm.edu.bo"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPass ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      autoComplete="current-password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, password: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      aria-label={
                        showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      onClick={() => setShowPass((v) => !v)}
                    >
                      {showPass ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      checked={form.remember}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, remember: e.target.checked }))
                      }
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      Recordar sesión
                    </span>
                  </label>
                  <Link
                    to="/recuperar"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    ¿Olvidó su contraseña?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  className="w-full py-3 px-4 bg-[var(--color-blue)] hover:bg-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>Ingresar</>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <p className="text-sm text-[var(--color-info-content)]">
                  ¿Problemas para acceder?{" "}
                  <a
                    href="mailto:soporte@uagrm.edu.bo"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Contactar soporte
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 text-center text-sm text-[var(--color-info-content)]">
          <p>
            © 2025 Universidad Autónoma Gabriel René Moreno. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
