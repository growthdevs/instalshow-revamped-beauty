import { motion } from "framer-motion";

type Palestrante = {
  name: string;
  role: string;
  bio: string;
  initials: string;
};

const palestrantes: Palestrante[] = [
  {
    name: "Hélio Sueta",
    role: "Pesquisador na Divisão Científica de Planejamento e Desenvolvimento Energético do IEE-USP",
    bio: "Especialista em energia e desenvolvimento sustentável, pesquisador do Instituto de Energia e Ambiente da USP.",
    initials: "HS",
  },
  {
    name: "Jose Jorge Porto",
    role: "Engenheiro Eletricista, PhD em Administração e Escritor",
    bio: "PhD com MBA em Gestão Estratégica, formação em Filosofia. Autor de três livros e pesquisador com estudo aprovado pelo Ministério da Cultura.",
    initials: "JP",
  },
  {
    name: "J. Jorge Chaguri Jr",
    role: "Diretor na Chaguri Engenharia de Projetos",
    bio: "Profissional especializado em engenharia de projetos com uma década de experiência no setor.",
    initials: "JC",
  },
  {
    name: "Rodrigo Recife",
    role: "Consultor de Instalações e Sócio da Instal Show",
    bio: "Profissional com experiência desde 1996 em instalações elétricas, hidráulicas e montagens em obras residenciais, comerciais, industriais e hospitalares.",
    initials: "RR",
  },
  {
    name: "Rogério Lin",
    role: "Diretor-Presidente na ABPP | Especialista em Segurança Passiva contra Incêndio",
    bio: "Superintendente do Comitê Brasileiro de Segurança contra Incêndio da ABNT/CB-024. Palestrante e especialista em prevenção de catástrofes.",
    initials: "RL",
  },
  {
    name: "Renata Dal Molin",
    role: "Empresária, Engenheira Civil e Especialista em Eng. de Combate a Incêndio",
    bio: "Fundadora da primeira comunidade de SCI do Brasil (PrevWorld). Influenciadora na conscientização de prevenção e combate a incêndio.",
    initials: "RD",
  },
  {
    name: "Elaine Gonçalves",
    role: "Engenheira de Combate a Incêndio | PPCI | AVCB",
    bio: "Professora, escritora e empresária especializada em elaboração e aprovação de projetos. Instrutora de mais de 3.700 alunos em todo o Brasil.",
    initials: "EG",
  },
  {
    name: "Ernesto Salém",
    role: "ABSpk | Especialista em Sistemas de Sprinklers e Normatização",
    bio: "Especialista em sistemas de sprinklers e normatização técnica para prevenção e combate a incêndio.",
    initials: "ES",
  },
  {
    name: "Rosana Petrella",
    role: "RCA Petrella Consultoria em Engenharia Civil - Sócia Diretora",
    bio: "Sócia diretora da RCA Petrella Consultoria em Engenharia Civil, com atuação em projetos e consultoria técnica.",
    initials: "RP",
  },
  {
    name: "Leandro Rebelato",
    role: "Engenheiro Eletricista formado pela FESP, com MBA em Gestão Empresarial pela FGV",
    bio: "Product Manager de Baixa e Média Tensão na CHINT Brasil.",
    initials: "LR",
  },
];

const Palestrantes = () => {
  return (
    <section id="palestrantes" className="relative py-24 md:py-32 bg-gradient-to-b from-navy-dark via-navy to-navy-dark overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-navy-light/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="text-accent uppercase tracking-widest text-xs md:text-sm font-semibold mb-4 block">
            Congresso Técnico 2026
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6">
            Palestrantes &amp; Convidados
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Conheça os nossos especialistas que conduzirão o nosso Congresso Técnico.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 max-w-7xl mx-auto">
          {palestrantes.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              whileHover={{ y: -6 }}
              className="group glass rounded-2xl p-6 border border-white/5 hover:border-accent/30 transition-all"
            >
              {/* Avatar */}
              <div className="relative mb-5 mx-auto w-24 h-24 md:w-28 md:h-28">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/40 to-navy-light/40 blur-xl group-hover:blur-2xl transition-all opacity-60" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-xl ring-2 ring-white/10 group-hover:ring-accent/40 transition-all">
                  <span className="text-white font-heading font-black text-2xl md:text-3xl tracking-tight">
                    {p.initials}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="text-white font-heading font-bold text-lg md:text-xl mb-2 leading-tight">
                  {p.name}
                </h3>
                <p className="text-accent text-xs md:text-sm font-medium mb-3 leading-snug">
                  {p.role}
                </p>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                  {p.bio}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Palestrantes;
