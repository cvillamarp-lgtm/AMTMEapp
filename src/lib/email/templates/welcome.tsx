interface WelcomeEmailProps {
  userName: string;
  loginUrl: string;
}

export const WelcomeEmail = ({ userName, loginUrl }: WelcomeEmailProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
    <h1>¡Bienvenido, {userName}!</h1>
    <p>Tu cuenta en AMTMEapp ha sido creada exitosamente.</p>
    <p>
      <a
        href={loginUrl}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Acceder ahora
      </a>
    </p>
  </div>
);
