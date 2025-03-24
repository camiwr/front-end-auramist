import { useContext, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AuthContext } from "@/context/AuthContext";
import styles from "@/styles/formProfServico.module.css";

export default function FormProfServico() {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', duration: '', price: '' });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const handleChange = e => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleFile = e => {
      setFile(e.target.files[0]);
    };
  
    const handleSubmit = async e => {
      e.preventDefault();
      if (!user) return alert('Faça login primeiro');
  
      setLoading(true);
      const professionalId = user.id;
      const filePath = `services/${professionalId}/${Date.now()}_${file.name}`;
  
      const { data, error: uploadError } = await supabase.storage
        .from('auramist')
        .upload(filePath, file);
  
      if (uploadError) {
        setLoading(false);
        return alert(uploadError.message);
      }
  
    //   const { publicURL } = supabase.storage.from('auramist').getPublicUrl(data.path);
  
      const res = await fetch('http://localhost:3001/api/services', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, professionalId }),
      });
  
      const result = await res.json();
      setLoading(false);
  
      if (!res.ok) return alert(result.mensagem);
      alert('Serviço cadastrado com sucesso!');
      setFormData({ name: '', duration: '', price: '' });
      setFile(null);
    };  

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Cadastrar Serviço</h2>

      <label>
        Nome do Serviço
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Duração (minutos)
        <input
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Preço (R$)
        <input
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </label>

      {/* <label>
        Imagem do Serviço
        <input type="file" accept="image/*" onChange={handleFile} required />
      </label> */}

      <button type="submit" disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar Serviço"}
      </button>
    </form>
  );
}
