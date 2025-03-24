import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SideBar from "@/components/sideBarProfessional";
import styles from "@/styles/dashboard.module.css";
import FormProfServico from "@/components/formProfServico";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(true);

  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    const buscarServicos = async () => {
      const res = await fetch("http://localhost:3001/api/services/by-user", {
        credentials: "include"
      });      

      if (res.ok) {
        const data = await res.json();
        setServicos(data);
      } else {
        console.error("Erro ao buscar serviços");
      }
    };

    buscarServicos();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/protected", {
          credentials: "include",
        });
        if (!res.ok) return router.push("/login");

        const data = await res.json();
        setUser(data);
        setFirstName(data.name?.split(" ")[0] ?? "Usuário");
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className={styles.paginaContainer}>
      <SideBar />
      <div className={styles.conteudoPrincipal}>
        <div className={styles.saudacaoCentralizada}>
          <p>
            Olá, <span className={styles.nomeDestaque}>{firstName}</span>
          </p>
        </div>

        <FormProfServico />
        <div>
          <h2>Seus Serviços Cadastrados</h2>
          <ul>
            {servicos.map((servico) => (
              <li key={servico.id}>
                <strong>{servico.name}</strong> - R$ {servico.price} (
                {servico.duration} min)
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
