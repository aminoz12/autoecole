-- INSERT SAMPLE BLOG ARTICLES WITH IMAGES
-- These are test articles for the blog with driving school related images

-- First, get the admin user ID
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@test.com' LIMIT 1;
  
  -- If admin doesn't exist, use first user or create a dummy UUID
  IF admin_user_id IS NULL THEN
    SELECT id INTO admin_user_id FROM auth.users LIMIT 1;
  END IF;
  
  -- Insert sample articles
  INSERT INTO public.blog_posts (
    title, slug, excerpt, content, featured_image, author_id, author_name,
    category, tags, is_published, is_featured, views_count,
    seo_title, seo_description, published_at, created_at, updated_at
  ) VALUES
  
  -- Article 1: Getting Driver's License
  (
    'Comment réussir son permis de conduire du premier coup ?',
    'comment-reussir-permis-conduire-premier-coup',
    'Découvrez nos meilleurs conseils pour maximiser vos chances de réussite à l''examen du permis de conduire.',
    '<h2>Introduction</h2><p>Passer son permis de conduire est une étape importante dans la vie. Voici nos conseils d''experts pour réussir du premier coup.</p><h2>1. Une préparation solide</h2><p>La clé du succès réside dans une <strong>préparation rigoureuse</strong>. Suivez assidûment vos cours de conduite et n''hésitez pas à poser des questions à votre moniteur.</p><h2>2. Maîtriser le code de la route</h2><ul><li>Révisez régulièrement</li><li>Passez des tests blancs</li><li>Comprenez les situations plutôt que de mémoriser</li></ul><h2>3. La pratique, la pratique, la pratique</h2><p>Plus vous conduisez, plus vous serez à l''aise le jour de l''examen. Multipliez les heures de conduite dans différentes conditions.</p>',
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=800&fit=crop',
    admin_user_id,
    'AutoEcole Pro',
    'Permis de conduire',
    ARRAY['permis', 'conseils', 'réussite', 'examen'],
    true,
    true,
    156,
    'Réussir son permis de conduire du premier coup - Guide complet',
    'Découvrez tous nos conseils d''experts pour réussir votre permis de conduire dès la première tentative. Préparation, astuces et techniques.',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
  ),
  
  -- Article 2: Road Safety
  (
    'Les 10 règles d''or de la sécurité routière',
    'les-10-regles-or-securite-routiere',
    'La sécurité sur la route est primordiale. Découvrez les règles essentielles pour conduire en toute sécurité.',
    '<h2>Protégez-vous et protégez les autres</h2><p>La <strong>sécurité routière</strong> concerne tout le monde. Voici les 10 règles fondamentales à respecter.</p><h2>Les règles essentielles</h2><ol><li><strong>Respectez les limitations de vitesse</strong> - Elles sont là pour votre sécurité</li><li><strong>Attachez toujours votre ceinture</strong> - Elle peut vous sauver la vie</li><li><strong>Ne conduisez jamais sous influence</strong> - Alcool et drogues sont interdits</li><li><strong>Gardez vos distances</strong> - Respectez les distances de sécurité</li><li><strong>Soyez attentif</strong> - Pas de téléphone au volant</li></ol><blockquote>La sécurité routière n''est pas une option, c''est une responsabilité.</blockquote>',
    'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1200&h=800&fit=crop',
    admin_user_id,
    'AutoEcole Pro',
    'Sécurité routière',
    ARRAY['sécurité', 'prévention', 'conduite responsable'],
    true,
    true,
    234,
    '10 règles d''or de la sécurité routière - Guide pratique',
    'Adoptez les bons réflexes pour conduire en toute sécurité. Découvrez les 10 règles essentielles de la sécurité routière.',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '12 days'
  ),
  
  -- Article 3: Code de la route
  (
    'Code de la route 2025 : Les nouvelles règles à connaître',
    'code-route-2025-nouvelles-regles',
    'Le code de la route évolue. Restez informé des dernières modifications pour 2025.',
    '<h2>Quoi de neuf en 2025 ?</h2><p>Le code de la route s''adapte aux nouvelles technologies et aux enjeux environnementaux.</p><h2>Les principales nouveautés</h2><h3>1. Zones à faibles émissions</h3><p>De nouvelles restrictions de circulation dans les centres-villes pour les véhicules polluants.</p><h3>2. Trottinettes électriques</h3><p>Réglementation renforcée pour les nouveaux modes de transport.</p><h3>3. Aide à la conduite</h3><p>Intégration des systèmes d''assistance à la conduite dans le code.</p><p><em>Restez à jour pour éviter les surprises !</em></p>',
    'https://images.unsplash.com/photo-1588112170653-ec6d0b7fc1ff?w=1200&h=800&fit=crop',
    admin_user_id,
    'AutoEcole Pro',
    'Code de la route',
    ARRAY['code', 'nouveautés', '2025', 'réglementation'],
    true,
    true,
    189,
    'Code de la route 2025 : Nouvelles règles et modifications',
    'Découvrez toutes les nouvelles règles du code de la route pour 2025. Restez informé des dernières modifications réglementaires.',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '8 days'
  ),
  
  -- Article 4: Choosing Driving School
  (
    'Comment choisir la meilleure auto-école ?',
    'comment-choisir-meilleure-auto-ecole',
    'Tous nos conseils pour sélectionner l''auto-école qui vous convient le mieux.',
    '<h2>Les critères essentiels</h2><p>Choisir son auto-école est une décision importante qui impactera votre apprentissage.</p><h2>Ce qu''il faut vérifier</h2><ul><li>✅ <strong>Taux de réussite</strong> : Privilégiez les auto-écoles avec de bons résultats</li><li>✅ <strong>Proximité</strong> : Une auto-école proche de chez vous facilite l''organisation</li><li>✅ <strong>Prix</strong> : Comparez les forfaits et vérifiez ce qui est inclus</li><li>✅ <strong>Moniteurs qualifiés</strong> : Des professionnels pédagogues et patients</li><li>✅ <strong>Planning flexible</strong> : Des horaires qui s''adaptent à votre emploi du temps</li></ul><h2>Notre engagement</h2><p>Chez AutoÉcole Pro, nous garantissons un <strong>enseignement de qualité</strong> avec des moniteurs diplômés d''État et un suivi personnalisé.</p>',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=800&fit=crop',
    admin_user_id,
    'AutoEcole Pro',
    'Actualités',
    ARRAY['auto-école', 'choix', 'conseils', 'formation'],
    true,
    true,
    312,
    'Comment choisir la meilleure auto-école ? Guide complet',
    'Découvrez tous les critères pour bien choisir votre auto-école. Taux de réussite, prix, qualité de l''enseignement.',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
  ),
  
  -- Article 5: Insurance Tips
  (
    'Assurance jeune conducteur : Comment payer moins cher ?',
    'assurance-jeune-conducteur-payer-moins-cher',
    'Réduisez le coût de votre assurance auto après l''obtention du permis avec nos astuces.',
    '<h2>L''assurance jeune conducteur coûte cher</h2><p>Les nouveaux conducteurs font face à des primes d''assurance élevées. Voici comment réduire la facture.</p><h2>Nos astuces pour économiser</h2><h3>1. Comparez les offres</h3><p>Ne vous contentez pas de la première offre. Utilisez les comparateurs en ligne pour trouver le meilleur prix.</p><h3>2. Conduite accompagnée</h3><p>Si vous avez fait la conduite accompagnée, vous bénéficiez de <strong>réductions importantes</strong>.</p><h3>3. Boîtier connecté</h3><p>Certaines assurances proposent des réductions avec un boîtier qui analyse votre conduite.</p><h3>4. Franchise élevée</h3><p>Accepter une franchise plus élevée peut réduire votre prime mensuelle.</p><blockquote>💡 Astuce : Assurez-vous en conducteur secondaire sur le véhicule de vos parents peut être moins cher au début.</blockquote>',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&h=800&fit=crop',
    admin_user_id,
    'AutoEcole Pro',
    'Assurance auto',
    ARRAY['assurance', 'jeune conducteur', 'économies', 'astuces'],
    true,
    false,
    145,
    'Assurance jeune conducteur : 10 astuces pour payer moins cher',
    'Découvrez comment réduire le coût de votre assurance auto en tant que jeune conducteur. Astuces et conseils pratiques.',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  
  -- Article 6: Parking Tips
  (
    'Maîtriser le stationnement : Créneau et bataille',
    'maitriser-stationnement-creneau-bataille',
    'Le stationnement est souvent source de stress. Découvrez nos techniques infaillibles.',
    '<h2>Le stationnement simplifié</h2><p>Que ce soit un <strong>créneau</strong> ou une <strong>bataille</strong>, le stationnement ne sera plus un problème.</p><h2>Le créneau en 5 étapes</h2><ol><li>Alignez-vous parallèlement au véhicule devant l''espace</li><li>Reculez en braquant à fond vers l''espace</li><li>Redressez les roues quand vous êtes à 45°</li><li>Braquez dans l''autre sens pour vous ranger</li><li>Ajustez votre position</li></ol><h2>La bataille (stationnement perpendiculaire)</h2><p>Plus simple que le créneau, la bataille nécessite néanmoins de la <strong>précision</strong>.</p><ul><li>Positionnez-vous perpendiculairement</li><li>Vérifiez vos rétroviseurs</li><li>Reculez lentement en gardant le contrôle</li><li>Centrez-vous dans l''espace</li></ul>',
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1200&h=800&fit=crop',
    admin_user_id,
    'AutoEcole Pro',
    'Permis de conduire',
    ARRAY['stationnement', 'créneau', 'technique', 'conduite'],
    true,
    false,
    98,
    'Maîtriser le stationnement en créneau et en bataille',
    'Apprenez les techniques de stationnement en créneau et en bataille. Guide étape par étape avec schémas explicatifs.',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  );

  RAISE NOTICE '✅ 6 articles de test créés avec succès !';
  
END $$;

-- Verify articles were created
SELECT 
  title, 
  category, 
  is_published,
  is_featured,
  views_count,
  'Article créé !' as status
FROM public.blog_posts
ORDER BY created_at DESC
LIMIT 6;


