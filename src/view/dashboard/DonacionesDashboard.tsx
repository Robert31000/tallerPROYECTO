import React from "react";
import { needs, transactions } from "../../lib/mockData";

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-BO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-BO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

const DonacionesDashboard: React.FC = () => {
  const totalRecaudado = transactions
    .filter((t) => t.direction === "in")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDesembolsado = transactions
    .filter((t) => t.direction === "out")
    .reduce((sum, t) => sum + t.amount, 0);

  const saldoActual = totalRecaudado - totalDesembolsado;

  const necesidadesAbiertas = needs.filter(
    (n) => n.status === "abierta",
  ).length;

  const ultimasTransacciones = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Sistema Inteligente de Donaciones </h1>
      <p style={{ marginBottom: "1rem", color: "#4b5563" }}>
        Vista de ejemplo sin autenticación ni backend, usando datos simulados.
      </p>

      {/* Resumen */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={cardStyle}>
          <p style={cardLabel}>Saldo actual</p>
          <p style={cardNumber}>{formatCurrency(saldoActual)}</p>
        </div>
        <div style={cardStyle}>
          <p style={cardLabel}>Total recaudado</p>
          <p style={cardNumber}>{formatCurrency(totalRecaudado)}</p>
        </div>
        <div style={cardStyle}>
          <p style={cardLabel}>Total desembolsado</p>
          <p style={cardNumber}>{formatCurrency(totalDesembolsado)}</p>
        </div>
        <div style={cardStyle}>
          <p style={cardLabel}>Necesidades abiertas</p>
          <p style={cardNumber}>{necesidadesAbiertas}</p>
        </div>
      </section>

      {/* Tabla de transacciones */}
      <section>
        <h2>Últimas transacciones</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {ultimasTransacciones.map((t) => (
              <tr key={t.id}>
                <td>{formatDate(t.createdAt)}</td>
                <td>{t.description}</td>
                <td>
                  <span
                    style={{
                      padding: "0.1rem 0.5rem",
                      borderRadius: 999,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      backgroundColor:
                        t.type === "donacion" ? "#dbeafe" : "#fee2e2",
                      color: t.type === "donacion" ? "#1d4ed8" : "#b91c1c",
                    }}
                  >
                    {t.type === "donacion" ? "Donación" : "Gasto"}
                  </span>
                </td>
                <td>
                  {t.direction === "out" ? "-" : "+"}
                  {formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 12,
  padding: "0.9rem 1rem",
  border: "1px solid #e5e7eb",
};

const cardLabel: React.CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
};

const cardNumber: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginTop: 4,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "0.5rem",
  fontSize: "0.85rem",
};

export default DonacionesDashboard;
