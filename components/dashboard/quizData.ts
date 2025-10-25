export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export const priorityRulesQuiz: Question[] = [
  {
    id: 1,
    question: "À une intersection sans signalisation, qui a la priorité ?",
    options: [
      "Le véhicule venant de gauche",
      "Le véhicule venant de droite",
      "Le véhicule le plus rapide",
      "Le premier arrivé"
    ],
    correctAnswer: 1,
    explanation: "En France, la règle de base est la priorité à droite. Le véhicule venant de droite a toujours la priorité à une intersection sans signalisation."
  },
  {
    id: 2,
    question: "Que signifie un panneau triangulaire rouge et blanc pointé vers le bas ?",
    options: [
      "Stop obligatoire",
      "Cédez le passage",
      "Sens interdit",
      "Priorité à droite"
    ],
    correctAnswer: 1,
    explanation: "Le panneau triangulaire rouge et blanc pointé vers le bas indique 'Cédez le passage'. Vous devez ralentir et laisser passer les véhicules sur la voie prioritaire."
  },
  {
    id: 3,
    question: "Dans un rond-point, qui a la priorité ?",
    options: [
      "Les véhicules entrant dans le rond-point",
      "Les véhicules déjà engagés dans le rond-point",
      "Le véhicule le plus gros",
      "Aucune règle spécifique"
    ],
    correctAnswer: 1,
    explanation: "Les véhicules déjà engagés dans le rond-point ont toujours la priorité sur ceux qui entrent, sauf indication contraire."
  },
  {
    id: 4,
    question: "Un véhicule prioritaire (pompiers, police, SAMU) arrive avec gyrophare et sirène. Que faites-vous ?",
    options: [
      "Je continue normalement",
      "Je m'arrête immédiatement où je suis",
      "Je me range sur le côté pour faciliter son passage",
      "J'accélère pour libérer la route"
    ],
    correctAnswer: 2,
    explanation: "Vous devez vous ranger sur le côté de manière sécurisée pour faciliter le passage du véhicule prioritaire. Ne vous arrêtez jamais brusquement au milieu de la route."
  },
  {
    id: 5,
    question: "À un feu orange fixe, vous devez :",
    options: [
      "Accélérer pour passer",
      "Vous arrêter si vous le pouvez en toute sécurité",
      "Continuer à la même vitesse",
      "Klaxonner"
    ],
    correctAnswer: 1,
    explanation: "Le feu orange signifie que vous devez vous arrêter si vous le pouvez en toute sécurité. Si vous êtes trop proche pour vous arrêter sans danger, vous pouvez passer."
  }
]

export const roadSignsQuiz: Question[] = [
  {
    id: 1,
    question: "Que signifie un panneau rond rouge avec une barre blanche horizontale ?",
    options: [
      "Sens interdit",
      "Stationnement interdit",
      "Arrêt interdit",
      "Dépassement interdit"
    ],
    correctAnswer: 0,
    explanation: "Un panneau rond rouge avec une barre blanche horizontale signifie 'Sens interdit'. Vous ne pouvez pas entrer dans cette voie."
  },
  {
    id: 2,
    question: "Un panneau bleu rond avec une flèche blanche vers la droite indique :",
    options: [
      "Direction conseillée",
      "Direction obligatoire",
      "Tourner à droite interdit",
      "Priorité à droite"
    ],
    correctAnswer: 1,
    explanation: "Les panneaux bleus ronds indiquent une obligation. Une flèche blanche sur fond bleu signifie que vous devez obligatoirement suivre cette direction."
  },
  {
    id: 3,
    question: "Que signifie un panneau triangulaire avec un point d'exclamation ?",
    options: [
      "Danger en général",
      "Travaux",
      "École",
      "Hôpital"
    ],
    correctAnswer: 0,
    explanation: "Le panneau triangulaire avec un point d'exclamation avertit d'un danger non spécifié. Soyez particulièrement vigilant."
  },
  {
    id: 4,
    question: "Un panneau carré bleu avec un 'P' blanc indique :",
    options: [
      "Péage",
      "Parking/Stationnement autorisé",
      "Pharmacie",
      "Poste de police"
    ],
    correctAnswer: 1,
    explanation: "Le panneau carré bleu avec 'P' indique un parking ou une zone de stationnement autorisé."
  },
  {
    id: 5,
    question: "Que signifie un panneau rond rouge avec le chiffre '50' ?",
    options: [
      "Vitesse recommandée",
      "Vitesse minimale",
      "Vitesse maximale autorisée",
      "Distance minimale"
    ],
    correctAnswer: 2,
    explanation: "Un panneau rond rouge avec un chiffre indique la vitesse maximale autorisée. Ici, vous ne devez pas dépasser 50 km/h."
  }
]

export const generalCodeQuiz: Question[] = [
  {
    id: 1,
    question: "Le taux d'alcoolémie maximum autorisé pour un conducteur confirmé est de :",
    options: [
      "0,2 g/L",
      "0,5 g/L",
      "0,8 g/L",
      "1,0 g/L"
    ],
    correctAnswer: 1,
    explanation: "Le taux d'alcoolémie maximum est de 0,5 g/L dans le sang pour les conducteurs confirmés, et 0,2 g/L pour les jeunes conducteurs."
  },
  {
    id: 2,
    question: "Sur autoroute par temps sec, la distance de sécurité minimale est de :",
    options: [
      "1 seconde",
      "2 secondes",
      "3 secondes",
      "5 secondes"
    ],
    correctAnswer: 1,
    explanation: "La règle des 2 secondes s'applique : choisissez un point de repère et comptez 2 secondes entre le moment où le véhicule devant vous le passe et votre passage."
  },
  {
    id: 3,
    question: "Le port de la ceinture de sécurité est obligatoire :",
    options: [
      "Uniquement sur autoroute",
      "Uniquement à l'avant",
      "À l'avant et à l'arrière",
      "Uniquement pour le conducteur"
    ],
    correctAnswer: 2,
    explanation: "Le port de la ceinture est obligatoire pour tous les occupants du véhicule, à l'avant comme à l'arrière."
  },
  {
    id: 4,
    question: "À quelle distance minimum d'un passage piéton devez-vous vous arrêter ?",
    options: [
      "2 mètres",
      "5 mètres",
      "10 mètres",
      "Il n'y a pas de distance spécifique"
    ],
    correctAnswer: 1,
    explanation: "Vous devez vous arrêter à au moins 5 mètres avant un passage piéton pour laisser la visibilité aux piétons."
  },
  {
    id: 5,
    question: "Un permis probatoire dure :",
    options: [
      "1 an",
      "2 ans",
      "3 ans",
      "5 ans"
    ],
    correctAnswer: 2,
    explanation: "La période probatoire dure 3 ans (ou 2 ans en cas de conduite accompagnée). Durant cette période, vous avez 6 points au lieu de 12."
  }
]

export const emergencySituationsQuiz: Question[] = [
  {
    id: 1,
    question: "En cas de panne sur autoroute, vous devez :",
    options: [
      "Rester dans votre véhicule",
      "Sortir par le côté droit et vous placer derrière la glissière",
      "Réparer immédiatement",
      "Faire signe aux autres automobilistes"
    ],
    correctAnswer: 1,
    explanation: "Sortez du véhicule par le côté droit (côté terre-plein) et placez-vous derrière la glissière de sécurité. C'est l'endroit le plus sûr."
  },
  {
    id: 2,
    question: "Le triangle de présignalisation doit être placé à quelle distance de votre véhicule en panne ?",
    options: [
      "10 mètres",
      "30 mètres",
      "50 mètres",
      "100 mètres"
    ],
    correctAnswer: 1,
    explanation: "Le triangle doit être placé à au moins 30 mètres du véhicule en panne pour prévenir les autres usagers suffisamment tôt."
  },
  {
    id: 3,
    question: "En cas d'accident, vous devez appeler :",
    options: [
      "Uniquement votre assurance",
      "Les pompiers (18) ou le SAMU (15)",
      "Votre famille d'abord",
      "Un dépanneur"
    ],
    correctAnswer: 1,
    explanation: "En cas d'accident avec blessés, appelez immédiatement les secours : pompiers (18), SAMU (15) ou numéro d'urgence européen (112)."
  },
  {
    id: 4,
    question: "Si votre véhicule prend feu, vous devez :",
    options: [
      "Tenter d'éteindre le feu vous-même",
      "Sortir immédiatement et appeler les pompiers",
      "Ouvrir le capot pour voir",
      "Continuer à rouler jusqu'au garage"
    ],
    correctAnswer: 1,
    explanation: "Sortez immédiatement du véhicule, éloignez-vous et appelez les pompiers (18). N'essayez jamais d'éteindre un feu de véhicule vous-même."
  },
  {
    id: 5,
    question: "En cas d'aquaplaning, vous devez :",
    options: [
      "Freiner fort",
      "Accélérer",
      "Lever le pied de l'accélérateur et tenir fermement le volant",
      "Tourner brusquement le volant"
    ],
    correctAnswer: 2,
    explanation: "En cas d'aquaplaning, levez doucement le pied de l'accélérateur, tenez fermement le volant et évitez tout mouvement brusque. Ne freinez pas brutalement."
  }
]

