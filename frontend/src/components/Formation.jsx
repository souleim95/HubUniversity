import React, { useState } from 'react';
import { 
  FormationContainer,
  FormationHeader,
  FormationGrid,
  FormationCard,
  FormationType,
  FormationDetails,
  TabContainer,
  Tab
} from '../styles/FormationStyles';

const Formation = () => {
  const [activeTab, setActiveTab] = useState('classique');

  const formationsData = {
    classique: {
      INFORMATIQUE: {
        description: "Plongez au cœur de l'innovation numérique avec notre formation d'ingénieur en informatique. Devenez un expert en développement logiciel, cybersécurité, IA et Big Data. Imaginez-vous concevoir des applications révolutionnaires et protéger les données de demain.",
        competences: ["Programmation avancée", "Architecture des systèmes", "Intelligence artificielle", "Sécurité informatique"],
        image: "https://images.unsplash.com/photo-1577676492979-474055517581?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW5nw6ludWV1ciUyMGluZm9ybWF0aXF1ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        temoignage: "« Cette formation m'a ouvert les portes d'un monde passionnant. J'ai pu travailler sur des projets concrets et développer des compétences très recherchées. » - Ancien élève en Informatique",
        lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-informatique"
      },
      "GÉNIE CIVIL": {
        description: "Construisez le monde de demain avec notre formation d'ingénieur en génie civil. Apprenez à concevoir des infrastructures durables, à gérer des projets de construction ambitieux et à relever les défis environnementaux. Votre expertise façonnera le paysage urbain et rural.",
        competences: ["Structures complexes", "Matériaux innovants", "Géotechnique avancée", "Management de grands projets"],
        image: "https://images.unsplash.com/photo-1606852529474-ce6389488450?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGdlbmllJTIwY2l2aWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        temoignage: "« J'ai toujours été passionné par la construction. Cette formation m'a donné les outils pour réaliser mes rêves et contribuer à des projets d'envergure. » - Ancien élève en Génie Civil",
        lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-genie-civil"
      },
      BIOTECHNOLOGIES: {
        description: "Explorez les frontières de la science avec notre formation d'ingénieur en biotechnologies. Innovez dans les domaines de la santé, de l'environnement et de l'agroalimentaire. Votre créativité et votre expertise contribueront à améliorer la qualité de vie et à préserver notre planète.",
        competences: ["Biologie moléculaire avancée", "Génie des procédés", "Chimie analytique", "Biotechnologie industrielle"],
        image: "https://images.unsplash.com/photo-1518186300418-8f5e5ef690e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJpb3RlY2hub2xvZ2llfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        temoignage: "« La biotechnologie est un domaine en pleine expansion. Cette formation m'a permis d'acquérir des connaissances pointues et de participer à des projets de recherche passionnants. » - Ancien élève en Biotechnologies",
        lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-biotechnologies-et-chimie"
      },
      MÉCANIQUE: {
        description: "Devenez un acteur clé de l'industrie avec notre formation d'ingénieur en mécanique. Concevez des systèmes innovants, optimisez les performances des machines et relevez les défis de la robotique. Votre expertise contribuera à l'essor de l'industrie 4.0.",
        competences: ["CAO avancée", "Mécanique des fluides", "Robotique industrielle", "Matériaux avancés"],
        image: "https://images.unsplash.com/photo-1621949845721-0494440a954b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1lY2FuaXF1ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        temoignage: "« La mécanique est au cœur de nombreuses industries. Cette formation m'a permis de développer une expertise technique solide et de travailler sur des projets concrets. » - Ancien élève en Mécanique",
        lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-mecanique"
      },
      "MATHÉMATIQUES APPLIQUÉES": {
        description: "Explorez le monde fascinant des mathématiques appliquées à travers notre formation d'ingénieur. Développez des modèles mathématiques pour résoudre des problèmes concrets dans des domaines variés tels que la finance, l'ingénierie et la science des données. Devenez un expert en modélisation, simulation et optimisation.",
        competences: ["Modélisation mathématique", "Analyse numérique", "Optimisation", "Science des données"],
        image: "https://images.unsplash.com/photo-1587268378082-c94244785233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1hdGhlbWF0aXF1ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        temoignage: "« Les mathématiques appliquées sont un outil puissant pour résoudre des problèmes complexes. Cette formation m'a permis d'acquérir des compétences très recherchées dans de nombreux secteurs. » - Ancien élève en Mathématiques Appliquées",
        lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-mathematiques-appliquees"
      },
    },
    recherche: {
      "BIOTECHNOLOGIES & CHIMIE (Chimie voie Recherche)": {
        description: "Explorez la voie de la recherche avec notre parcours en chimie. Développez des compétences en chimie moléculaire, chimie verte et matériaux innovants. Contribuez à l'avancement des connaissances et à la résolution des défis environnementaux.",
        competences: ["Chimie moléculaire", "Chimie verte", "Matériaux innovants", "Analyse chimique"],
        image: "https://images.unsplash.com/photo-1554156665-b39699828451?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNoaW1pZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        temoignage: "« La recherche en chimie est passionnante. Cette formation m'a permis de développer une expertise pointue et de contribuer à des projets innovants. » - Ancien élève en Chimie voie Recherche",
        lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-biotechnologies-chimie-parcours-chimie"
      },
      "BIOTECHNOLOGIES & CHIMIE (Biologie voie Recherche)": {
        description: "Explorez la voie de la recherche avec notre parcours en biologie. Développez des compétences en biologie moléculaire, génomique et biotechnologies. Contribuez à l'avancement des connaissances et à la résolution des défis de santé.",
        competences: ["Biologie moléculaire", "Génomique", "Biotechnologies", "Analyse biologique"],
        image: "https://images.unsplash.com/photo-1576766420349-145249264531?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJpb2xvZ2llfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        temoignage: "« La recherche en biologie est essentielle pour l'avenir. Cette formation m'a permis de développer une expertise pointue et de contribuer à des projets innovants. » - Ancien élève en Biologie voie Recherche",
        lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-biotechnologies-chimie-parcours-biologie"
      },
    },
    "double-diplome": {
      "GÉNIE CIVIL - ARCHITECTE (ENSA-V)": {
        description: "Devenez un expert en génie civil et en architecture grâce à notre double diplôme avec l'ENSA-V. Concevez des bâtiments innovants et durables en intégrant les aspects techniques et esthétiques. Votre expertise façonnera le paysage urbain de demain.",
        competences: ["Génie civil", "Architecture", "Conception de bâtiments", "Urbanisme"],
        image: "https://images.unsplash.com/photo-1541454127-84539240e472?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFyY2hpdGVjdHVyZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        temoignage: "« Ce double diplôme est une opportunité unique. J'ai pu développer une expertise à la fois technique et artistique, ce qui me permet de concevoir des bâtiments innovants et durables. » - Ancien élève en Génie Civil - Architecte",
        lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-genie-civil-architecte"
      },
      "DATA - HUMANITÉS DIGITALES (Sciences Po Saint-Germain-en-Laye)": {
        description: "Devenez un expert en data et en humanités digitales grâce à notre double diplôme avec Sciences Po Saint-Germain-en-Laye. Analysez les données pour comprendre les enjeux sociaux, économiques et politiques. Votre expertise contribuera à éclairer les décisions et à construire un monde plus juste.",
        competences: ["Data science", "Humanités digitales", "Analyse de données", "Sciences sociales"],
        image: "https://images.unsplash.com/photo-1563235459-019dd20c55f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRhdGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        temoignage: "« Ce double diplôme est une combinaison unique de compétences techniques et humaines. J'ai pu développer une expertise très recherchée dans le monde d'aujourd'hui. » - Ancien élève en Data - Humanités Digitales",
        lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-data-et-humanites-digitales"
      },
      "INFORMATIQUE - DESIGNER (CY École de Design)": {
        description: "Devenez un expert en informatique et en design grâce à notre double diplôme avec CY École de Design. Concevez des interfaces utilisateur innovantes et intuitives en intégrant les aspects techniques et esthétiques. Votre créativité façonnera l'expérience utilisateur de demain.",
        competences: ["Informatique", "Design", "Conception d'interfaces", "Expérience utilisateur"],
        image: "https://images.unsplash.com/photo-1542751371-adc38f48795e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRlc2lnfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        temoignage: "« Ce double diplôme est une opportunité unique de combiner mes passions pour l'informatique et le design. J'ai pu développer une expertise très recherchée dans le monde d'aujourd'hui. » - Ancien élève en Informatique - Designer",
        lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-informatique-designer"
      }
    }
  };

  const currentFormations = formationsData[activeTab];

  return (
    <FormationContainer>
      <FormationHeader>
        <h1>Nos Formations</h1>
        <TabContainer>
          <Tab 
            active={activeTab === 'classique'} 
            onClick={() => setActiveTab('classique')}
          >
            Ingénieur | Voie classique
          </Tab>
          <Tab 
            active={activeTab === 'recherche'} 
            onClick={() => setActiveTab('recherche')}
          >
            Ingénieur | Voie Recherche & Développement
          </Tab>
          <Tab 
            active={activeTab === 'double-diplome'} 
            onClick={() => setActiveTab('double-diplome')}
          >
            Ingénieur | Doubles diplômes (en 6 ans)
          </Tab>
        </TabContainer>
      </FormationHeader>

      <FormationGrid>
        {currentFormations && Object.entries(currentFormations).map(([name, details]) => (
          <FormationCard key={name}>
            <FormationType>{name}</FormationType>
            <img src={details.image} alt={name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <FormationDetails>
              <p>{details.description}</p>
              <h4>Compétences clés :</h4>
              <ul>
                {details.competences.map(comp => (
                  <li key={comp}>{comp}</li>
                ))}
              </ul>
              <p style={{ fontStyle: 'italic' }}>{details.temoignage}</p>
              <a href={details.lien} target="_blank" rel="noopener noreferrer">En savoir plus</a>
            </FormationDetails>
          </FormationCard>
        ))}
      </FormationGrid>
    </FormationContainer>
  );
};

export default Formation;
