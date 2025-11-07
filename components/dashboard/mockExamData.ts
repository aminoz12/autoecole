export interface MockExamQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  category: string
}

// 40 questions for the mock exam
export const mockExamQuestions: MockExamQuestion[] = [
  // Priority Rules (10 questions)
  {
    id: 1,
    question: "À une intersection sans signalisation, qui a la priorité?",
    options: ["Le véhicule venant de droite", "Le véhicule venant de gauche", "Le plus rapide", "Le plus gros véhicule"],
    correctAnswer: 0,
    explanation: "À une intersection sans signalisation, la règle de la priorité à droite s'applique.",
    category: "Règles de priorité"
  },
  {
    id: 2,
    question: "Sur un rond-point, qui a la priorité?",
    options: ["Les véhicules déjà engagés", "Les véhicules qui entrent", "Le premier arrivé", "Les véhicules de droite"],
    correctAnswer: 0,
    explanation: "Les véhicules déjà engagés sur un rond-point ont toujours la priorité.",
    category: "Règles de priorité"
  },
  {
    id: 3,
    question: "Un piéton s'engage sur un passage protégé, que faites-vous?",
    options: ["Je m'arrête obligatoirement", "Je klaxonne", "Je ralentis", "Je continue"],
    correctAnswer: 0,
    explanation: "Vous devez vous arrêter pour laisser passer le piéton.",
    category: "Règles de priorité"
  },
  {
    id: 4,
    question: "À un feu orange, vous devez:",
    options: ["Vous arrêter si vous pouvez le faire en toute sécurité", "Accélérer", "Continuer normalement", "Klaxonner"],
    correctAnswer: 0,
    explanation: "Au feu orange, vous devez vous arrêter sauf si cela présente un danger.",
    category: "Signalisation"
  },
  {
    id: 5,
    question: "Que signifie un panneau triangulaire rouge pointe en bas?",
    options: ["Cédez le passage", "Stop", "Priorité à droite", "Danger"],
    correctAnswer: 0,
    explanation: "Ce panneau indique que vous devez céder le passage.",
    category: "Signalisation"
  },
  {
    id: 6,
    question: "Sur autoroute, la vitesse maximale autorisée par temps sec est de:",
    options: ["130 km/h", "110 km/h", "90 km/h", "150 km/h"],
    correctAnswer: 0,
    explanation: "Sur autoroute, la vitesse est limitée à 130 km/h par temps sec.",
    category: "Vitesse"
  },
  {
    id: 7,
    question: "Quelle est la distance de sécurité minimale sur autoroute?",
    options: ["2 secondes ou 2 bandes blanches", "1 seconde", "5 secondes", "10 mètres"],
    correctAnswer: 0,
    explanation: "Il faut respecter une distance d'au moins 2 secondes.",
    category: "Sécurité"
  },
  {
    id: 8,
    question: "Le port de la ceinture de sécurité est obligatoire:",
    options: ["Pour tous les occupants du véhicule", "Seulement pour le conducteur", "Seulement à l'avant", "Seulement sur autoroute"],
    correctAnswer: 0,
    explanation: "Tous les occupants doivent porter leur ceinture.",
    category: "Sécurité"
  },
  {
    id: 9,
    question: "En cas de dépassement d'un cycliste, je dois laisser:",
    options: ["Au moins 1 mètre en ville, 1,5 m hors agglomération", "50 cm", "2 mètres", "Aucune distance précise"],
    correctAnswer: 0,
    explanation: "La loi impose ces distances minimales de sécurité.",
    category: "Dépassement"
  },
  {
    id: 10,
    question: "Puis-je téléphoner avec un kit main libre en conduisant?",
    options: ["Oui", "Non", "Seulement sur autoroute", "Seulement à l'arrêt"],
    correctAnswer: 0,
    explanation: "Le kit main libre est autorisé, contrairement au téléphone à la main.",
    category: "Équipement"
  },
  // Road Signs (10 questions)
  {
    id: 11,
    question: "Un panneau rond bleu avec une flèche blanche indique:",
    options: ["Direction obligatoire", "Direction conseillée", "Interdiction", "Fin d'interdiction"],
    correctAnswer: 0,
    explanation: "Les panneaux ronds bleus indiquent des obligations.",
    category: "Signalisation"
  },
  {
    id: 12,
    question: "Un panneau rond rouge avec barre blanche signifie:",
    options: ["Interdiction de circuler", "Sens interdit", "Stop", "Cédez le passage"],
    correctAnswer: 0,
    explanation: "Ce panneau interdit l'accès à tous les véhicules.",
    category: "Signalisation"
  },
  {
    id: 13,
    question: "Une ligne blanche continue signifie:",
    options: ["Interdiction de la franchir", "On peut la franchir", "Fin de limitation", "Danger"],
    correctAnswer: 0,
    explanation: "La ligne continue ne doit jamais être franchie.",
    category: "Marquage au sol"
  },
  {
    id: 14,
    question: "Le stationnement est interdit:",
    options: ["À moins de 5m d'un passage piéton", "À 10m", "À 2m", "À 15m"],
    correctAnswer: 0,
    explanation: "Il faut laisser au moins 5 mètres avant un passage piéton.",
    category: "Stationnement"
  },
  {
    id: 15,
    question: "Un feu clignotant orange signifie:",
    options: ["Ralentir et redoubler de prudence", "Arrêt obligatoire", "Accélérer", "Rien de particulier"],
    correctAnswer: 0,
    explanation: "Il faut être particulièrement vigilant.",
    category: "Signalisation lumineuse"
  },
  {
    id: 16,
    question: "Le triangle de pré-signalisation doit être placé à:",
    options: ["Au moins 30m du véhicule", "10m", "50m", "100m"],
    correctAnswer: 0,
    explanation: "Le triangle doit être visible suffisamment tôt.",
    category: "Sécurité"
  },
  {
    id: 17,
    question: "En cas de panne sur autoroute, je dois:",
    options: ["Mettre mon gilet et appeler les secours", "Réparer immédiatement", "Continuer", "Attendre dans la voiture"],
    correctAnswer: 0,
    explanation: "La sécurité est prioritaire : gilet et appel aux secours.",
    category: "Urgence"
  },
  {
    id: 18,
    question: "Le taux d'alcoolémie maximum autorisé pour un conducteur novice est:",
    options: ["0,2 g/L de sang", "0,5 g/L", "0,8 g/L", "0 g/L"],
    correctAnswer: 0,
    explanation: "Les jeunes conducteurs ont une limite plus stricte.",
    category: "Alcool"
  },
  {
    id: 19,
    question: "La conduite sous l'influence de stupéfiants est:",
    options: ["Interdite et sanctionnée", "Tolérée", "Autorisée avec modération", "Légale"],
    correctAnswer: 0,
    explanation: "La conduite sous stupéfiants est strictement interdite.",
    category: "Stupéfiants"
  },
  {
    id: 20,
    question: "Les feux de brouillard avant peuvent être utilisés:",
    options: ["Par brouillard ou forte pluie", "La nuit", "Tout le temps", "Jamais"],
    correctAnswer: 0,
    explanation: "Ils sont réservés aux conditions de visibilité réduite.",
    category: "Éclairage"
  },
  // General Code (10 questions)
  {
    id: 21,
    question: "Un conducteur peut perdre son permis après avoir perdu:",
    options: ["Tous ses points", "6 points", "3 points", "9 points"],
    correctAnswer: 0,
    explanation: "La perte de tous les points entraîne l'annulation du permis.",
    category: "Permis à points"
  },
  {
    id: 22,
    question: "Combien de points un jeune conducteur a-t-il sur son permis?",
    options: ["6 points", "12 points", "8 points", "4 points"],
    correctAnswer: 0,
    explanation: "Les jeunes conducteurs commencent avec un capital de 6 points.",
    category: "Permis à points"
  },
  {
    id: 23,
    question: "La durée de la période probatoire pour un permis classique est de:",
    options: ["3 ans", "2 ans", "1 an", "5 ans"],
    correctAnswer: 0,
    explanation: "La période probatoire dure 3 ans (2 ans avec AAC).",
    category: "Permis probatoire"
  },
  {
    id: 24,
    question: "Un excès de vitesse de plus de 50 km/h entraîne:",
    options: ["Retrait de 6 points et suspension", "Retrait de 3 points", "Amende uniquement", "Rien"],
    correctAnswer: 0,
    explanation: "C'est une infraction grave avec sanctions lourdes.",
    category: "Infractions"
  },
  {
    id: 25,
    question: "Je dois contrôler mes pneus:",
    options: ["Régulièrement", "Jamais", "Une fois par an", "Uniquement avant un long trajet"],
    correctAnswer: 0,
    explanation: "Les pneus doivent être contrôlés fréquemment pour la sécurité.",
    category: "Entretien"
  },
  {
    id: 26,
    question: "La profondeur minimale des sculptures des pneus doit être de:",
    options: ["1,6 mm", "1 mm", "2 mm", "3 mm"],
    correctAnswer: 0,
    explanation: "C'est la profondeur légale minimale.",
    category: "Entretien"
  },
  {
    id: 27,
    question: "Le contrôle technique est obligatoire:",
    options: ["Tous les 2 ans pour un véhicule de plus de 4 ans", "Tous les ans", "Tous les 5 ans", "Jamais"],
    correctAnswer: 0,
    explanation: "Le contrôle technique est régulier pour les véhicules anciens.",
    category: "Contrôle technique"
  },
  {
    id: 28,
    question: "En cas d'accident, je dois:",
    options: ["Remplir un constat amiable", "Partir immédiatement", "Appeler un avocat", "Ne rien faire"],
    correctAnswer: 0,
    explanation: "Le constat amiable est obligatoire pour l'assurance.",
    category: "Accident"
  },
  {
    id: 29,
    question: "L'assurance au tiers couvre:",
    options: ["Les dommages causés aux tiers", "Tous les dommages", "Seulement votre véhicule", "Rien"],
    correctAnswer: 0,
    explanation: "L'assurance au tiers est le minimum légal.",
    category: "Assurance"
  },
  {
    id: 30,
    question: "Puis-je conduire immédiatement après avoir obtenu mon permis?",
    options: ["Oui", "Non", "Seulement accompagné", "Seulement en journée"],
    correctAnswer: 0,
    explanation: "Vous pouvez conduire seul dès l'obtention du permis.",
    category: "Permis"
  },
  // Emergency Situations (10 questions)
  {
    id: 31,
    question: "En cas d'aquaplaning, je dois:",
    options: ["Lever le pied de l'accélérateur et ne pas freiner brusquement", "Freiner fort", "Accélérer", "Tourner le volant"],
    correctAnswer: 0,
    explanation: "Il faut éviter les mouvements brusques.",
    category: "Conduite par temps de pluie"
  },
  {
    id: 32,
    question: "Sur la neige, la distance de freinage est multipliée par:",
    options: ["5 à 10", "2", "3", "15"],
    correctAnswer: 0,
    explanation: "Les distances de freinage augmentent considérablement.",
    category: "Conduite hivernale"
  },
  {
    id: 33,
    question: "En cas de freinage d'urgence avec ABS, je dois:",
    options: ["Appuyer fort sur la pédale sans relâcher", "Pomper", "Freiner doucement", "Ne pas freiner"],
    correctAnswer: 0,
    explanation: "L'ABS gère les à-coups, il faut maintenir la pression.",
    category: "Freinage d'urgence"
  },
  {
    id: 34,
    question: "La fatigue au volant est responsable de:",
    options: ["1 accident mortel sur 3 sur autoroute", "1 sur 10", "1 sur 20", "Aucun"],
    correctAnswer: 0,
    explanation: "La fatigue est une cause majeure d'accidents.",
    category: "Fatigue"
  },
  {
    id: 35,
    question: "Je dois faire une pause toutes les:",
    options: ["2 heures", "4 heures", "1 heure", "6 heures"],
    correctAnswer: 0,
    explanation: "Une pause régulière est essentielle pour la sécurité.",
    category: "Fatigue"
  },
  {
    id: 36,
    question: "En cas d'incendie de mon véhicule, je dois:",
    options: ["M'éloigner et appeler les pompiers", "Éteindre avec de l'eau", "Ouvrir le capot", "Rester dans le véhicule"],
    correctAnswer: 0,
    explanation: "La sécurité des personnes est prioritaire.",
    category: "Incendie"
  },
  {
    id: 37,
    question: "Le numéro d'urgence européen est le:",
    options: ["112", "911", "999", "15"],
    correctAnswer: 0,
    explanation: "Le 112 fonctionne partout en Europe.",
    category: "Numéros d'urgence"
  },
  {
    id: 38,
    question: "En cas de blessé sur la route, je dois:",
    options: ["Protéger, alerter, secourir", "Déplacer immédiatement", "Ne rien faire", "Partir"],
    correctAnswer: 0,
    explanation: "C'est la règle de base du secourisme routier.",
    category: "Secourisme"
  },
  {
    id: 39,
    question: "Je peux déplacer un blessé uniquement si:",
    options: ["Il y a un danger imminent", "Je le souhaite", "Il le demande", "Toujours"],
    correctAnswer: 0,
    explanation: "Ne déplacer qu'en cas de danger vital immédiat.",
    category: "Secourisme"
  },
  {
    id: 40,
    question: "L'extinction d'un feu de véhicule se fait avec:",
    options: ["Un extincteur adapté", "De l'eau", "Du sable", "Une couverture"],
    correctAnswer: 0,
    explanation: "Seul un extincteur automobile est efficace.",
    category: "Incendie"
  }
]

