interface PasswordResetEmailProps {
  resetUrl: string;
  expiresIn: string;
}

export const PasswordResetEmail = ({ resetUrl, expiresIn }: PasswordResetEmailProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
    <h1>Reset de Contraseña</h1>
    <p>Hemos recibido una solicitud para resetear tu contraseña en AMTMEapp.</p>
    <p>Este enlace expira en {expiresIn}.</p>
    <p>
      <a
        href={resetUrl}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Resetear contraseña
      </a>
    </p>
    <p style={{ fontSize: '12px', color: '#999' }}>
      Si no solicitaste este reset, ignora este correo.
    </p>
  </div>
);
