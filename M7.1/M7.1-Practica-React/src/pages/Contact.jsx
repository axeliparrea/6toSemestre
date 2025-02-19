import { useState } from "react";

const Contact = () => {
  const [emails, setEmails] = useState([]); 
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmails([...emails, { name, email }]);
    setName("");
    setEmail("");
  };

  return (
    <div className="contact">
      <h2>Contacto</h2>
      <p>Pon tu email</p>

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Tu Nombre" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
        />
        <input 
          type="email" 
          placeholder="Tu Correo" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <button type="submit">Enviar</button>
      </form>

      {/* Lista de emails enviados */}
      <div className="email-list">
        <h3>Mensajes enviados:</h3>
        <ul>
          {emails.map((item, index) => (
            <li key={index}>
              {item.name} - {item.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Contact;
