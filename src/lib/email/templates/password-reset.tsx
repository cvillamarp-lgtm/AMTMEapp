interface PasswordResetEmailProps {
  resetUrl: string;
  expiresIn: string;
}

export const PasswordResetEmail = ({ resetUrl, expiresIn }: PasswordResetEmailProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#0c1f36' }}>
    <h1>Reset de Contraseña</h1>
    <p>Hemos recibido una solicitud para resetear tu contraseña en AMTMEapp.</p>
    <p>Este enlace expira en {expiresIn}.</p>
    <p>
      <a
        href={resetUrl}
        style={{
          backgroundColor: '#0c1f36',
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Resetear contraseña
      </a>
    </p>
    <p style={{ fontSize: '12px', color: '#6b7b8c' }}>
      Si no solicitaste este reset, ignora este correo.
    </p>
  </div>
);
