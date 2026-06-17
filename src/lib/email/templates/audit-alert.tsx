interface AuditAlertEmailProps {
  eventType: string;
  summary: string;
  dashboardUrl: string;
}

export const AuditAlertEmail = ({ eventType, summary, dashboardUrl }: AuditAlertEmailProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#0c1f36' }}>
    <h1>Alerta de Auditoría: {eventType}</h1>
    <p>{summary}</p>
    <p>
      <a
        href={dashboardUrl}
        style={{
          backgroundColor: '#0c1f36',
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Ver en dashboard
      </a>
    </p>
  </div>
);
